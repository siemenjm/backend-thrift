// Dependencies -----
const express = require('express');
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

        res.json(newAccount.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
});

router.put('/:accountId', async (req, res) => {
    try {
        const { accountId } = req.params;
        const { name, startingBalance, accountType, insId, userId } = req.body;
        const updateAccount = await pool.query('UPDATE accounts SET name = $1, starting_balance = $2, account_type = $3, ins_id = $4, user_id = $5 WHERE account_id = $6', [name, startingBalance, accountType, insId, userId, accountId]);

        res.json(`Account with account_id = ${accountId} was updated`);
    } catch (error) {
        console.error(error.message);
    }
});

router.delete('/:accountId', async (req, res) => {
    try {
        const { accountId } = req.params;
        const deleteAccount = await pool.query('DELETE FROM accounts WHERE account_id = $1', [accountId]);

        res.json(`Account with account_id = ${accountId} was deleted`);
    } catch (error) {
        console.error(error.message);
    }
});

module.exports = router;