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
        const allAccounts = await pool.query('SELECT * FROM accounts');

        res.json(allAccounts.rows);
    } catch (error) {
        console.error(error.message);
    }
});

router.get('/:accountId', async (req, res) => {
    try {
        const { accountId } = req.params;
        const thisAccount = await pool.query('SELECT * FROM accounts WHERE account_id = $1', [accountId]);

        res.json(thisAccount.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, startingBalance, accountType, insId, userId } = req.body;
        const newAccount = await pool.query('INSERT INTO accounts (name, starting_balance, account_type, ins_id, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *', [name, startingBalance, accountType, insId, userId]);

        // Update Account current_balance and Institution balance to include starting_balance before responding
        await updateAccountBalance(newAccount.rows[0].account_id);
        await updateInstitutionBalance(newAccount.rows[0].account_id);

        res.json(newAccount.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
});

router.put('/:accountId', async (req, res) => {
    try {
        const { accountId } = req.params;
        const { name, startingBalance, accountType, insId, userId } = req.body;
        const updatedAccount = await pool.query('UPDATE accounts SET name = $1, starting_balance = $2, account_type = $3, ins_id = $4, user_id = $5 WHERE account_id = $6', [name, startingBalance, accountType, insId, userId, accountId]);

        // Update Account current_balance and Institution balance to include starting_balance before responding
        await updateAccountBalance(updatedAccount.rows[0].account_id);
        await updateInstitutionBalance(updatedAccount.rows[0].account_id);
        
        res.json(`Account with account_id = ${accountId} was updated`);
    } catch (error) {
        console.error(error.message);
    }
});

router.delete('/:accountId', async (req, res) => {
    try {
        const { accountId } = req.params;
        const institutionID = await pool.query('SELECT ins_id FROM accounts WHERE account_id = $1', [accountId]);

        const deleteAccount = await pool.query('DELETE FROM accounts WHERE account_id = $1', [accountId]);

        // Update Institution balance after deleting account
        const institutionBalance = await pool.query('SELECT SUM(current_balance) FROM accounts WHERE ins_id = $1', [institutionID.rows[0].ins_id]);
        const updateInstitution = await pool.query('UPDATE institutions SET current_balance = $1 WHERE ins_id = $2', [institutionBalance.rows[0].sum, institutionID.rows[0].ins_id]);

        res.json(`Account with account_id = ${accountId} was deleted`);
    } catch (error) {
        console.error(error.message);
    }
});

module.exports = router;