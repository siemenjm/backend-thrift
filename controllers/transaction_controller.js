// Dependencies -----
const express = require('express');
const updateAccountBalance = require('../api_functions/update_account_data');
const updateInstitutionBalance = require('../api_functions/update_institution_data');
const router = express.Router();
const pool = require('../config/db_config');

// Middleware -----
router.use(express.json());

// Routes -----
router.get('/', async (req, res) => {
    try {
        const allTransactions = await pool.query('SELECT * FROM transactions');

        res.json(allTransactions.rows);
    } catch (error) {
        console.error(error.message);
    }
});

router.get('/:transId', async (req, res) => {
    try {
        const { transId } = req.params;
        const thisTransaction = await pool.query('SELECT * FROM transactions WHERE trans_id = $1', [transId]);

        res.json(thisTransaction.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const {
            date,
            description,
            amount,
            transType,
            category,
            subCategory,
            creditedAccountId,
            debitedAccountId,
            userId } = req.body;

        // Create new transaction
        const newTransaction = await pool.query('INSERT INTO transactions (date, description, amount, trans_type, category, sub_category, credited_account_id, debited_account_id, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [
            date,
            description,
            amount,
            transType,
            category,
            subCategory,
            creditedAccountId,
            debitedAccountId,
            userId
        ]);

        // Update Account balance and Institution balance
        if (creditedAccountId) {
            await updateAccountBalance(creditedAccountId);
            await updateInstitutionBalance(creditedAccountId);
        }

        if (debitedAccountId) {
            await updateAccountBalance(debitedAccountId);
            await updateInstitutionBalance(debitedAccountId);
        }

        res.json(newTransaction.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
});

router.put('/:transId', async (req, res) => {
    try {
        const { transId } = req.params;
        const { 
            date,
            description,
            amount,
            trans_type,
            category,
            sub_category,
            credited_account_id,
            debited_account_id } = req.body;
        
        // Update transaction
        const updateTransaction = await pool.query('UPDATE transactions SET date = $1, description = $2, amount = $3, trans_type = $4, category = $5, sub_category = $6, credited_account_id = $7, debited_account_id = $8 WHERE trans_id = $9', [
            date,
            description,
            amount,
            trans_type,
            category,
            sub_category,
            credited_account_id,
            debited_account_id,
            transId
        ]);

        // Update Account balance and Institution balance
        if (credited_account_id) {
            await updateAccountBalance(credited_account_id);
            await updateInstitutionBalance(credited_account_id);
        }

        if (debited_account_id) {
            await updateAccountBalance(debited_account_id);
            await updateInstitutionBalance(debited_account_id);
        }

        res.json(`Transaction with trans_id = ${transId} was updated`);
    } catch (error) {
        console.error(error.message);
    }
});

router.delete('/:transId', async (req, res) => {
    try {
        const { transId } = req.params;

        const creditedAccountIdData = await pool.query('SELECT (credited_account_id) FROM transactions WHERE trans_id = $1', [transId]);
        const creditedAccountId = creditedAccountIdData.rows[0].credited_account_id;
        const debitedAccountIdData = await pool.query('SELECT (debited_account_id) FROM transactions WHERE trans_id = $1', [transId]);
        const debitedAccountId = debitedAccountIdData.rows[0].debited_account_id;

        const deleteTransaction = await pool.query('DELETE FROM transactions WHERE trans_id = $1', [transId]);

        // Update Account balance and Institution balance
        if (creditedAccountId) {
            await updateAccountBalance(creditedAccountId);
            await updateInstitutionBalance(creditedAccountId);
        }
        
        if (debitedAccountId) {
            await updateAccountBalance(debitedAccountId);
            await updateInstitutionBalance(debitedAccountId);
        }

        
                
        res.json(`Transaction with trans_id = ${transId} was deleted`);
    } catch (error) {
        console.error(error.message);
    }
});

module.exports = router;