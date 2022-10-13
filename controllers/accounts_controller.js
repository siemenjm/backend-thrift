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

        // get transaction which have this account id in tranasaction credited/debited account id AND that have other account id attached to them
        // then get those account ids and update their balances after that transcation is deleted
        const creditedAccountIdData = await pool.query('SELECT credited_account_id FROM transactions WHERE debited_account_id = $1 AND credited_account_id IS NOT NULL', [accountId]);
        const debitedAccountIdData = await pool.query('SELECT debited_account_id FROM transactions WHERE credited_account_id = $1 AND debited_account_id IS NOT NULL', [accountId]);

        const creditedAccountIds = creditedAccountIdData.rows.map((account) => {
            return account.credited_account_id;
        });
        const debitedAccountIds = debitedAccountIdData.rows.map((account) => {
            return account.debited_account_id;
        });

        let condensedCreditedAccountIds = [];
        for (let i = 0; i < creditedAccountIds.length; i++) {
            if (!condensedCreditedAccountIds.includes(creditedAccountIds[i])) {
                condensedCreditedAccountIds.push(creditedAccountIds[i]);
            }
        }
        let condensedDebitedAccountIds = [];
        for (let i = 0; i < debitedAccountIds.length; i++) {
            if (!condensedDebitedAccountIds.includes(debitedAccountIds[i])) {
                condensedDebitedAccountIds.push(debitedAccountIds[i]);
            }
        }

        const deleteAccount = await pool.query('DELETE FROM accounts WHERE account_id = $1', [accountId]);

        // Update other accounts and institutions affected by deleting related transactions (have both credited and debited account ids)
        condensedCreditedAccountIds.forEach(async (accountId) => {
            await updateAccountBalance(accountId);
            await updateInstitutionBalance(accountId);
        });
        condensedDebitedAccountIds.forEach(async (accountId) => {
            await updateAccountBalance(accountId);
            await updateInstitutionBalance(accountId);
        });

        // Update Institution balance after deleting account
        const institutionBalance = await pool.query('SELECT SUM(current_balance) FROM accounts WHERE ins_id = $1', [institutionID.rows[0].ins_id]);
        const updateInstitution = await pool.query('UPDATE institutions SET current_balance = $1 WHERE ins_id = $2', [institutionBalance.rows[0].sum, institutionID.rows[0].ins_id]);

        res.json(`Account with account_id = ${accountId} was deleted`);
    } catch (error) {
        console.error(error.message);
    }
});

module.exports = router;