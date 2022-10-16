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
        const allInstitutions = await pool.query('SELECT * FROM institutions ORDER BY name ASC');

        res.json(allInstitutions.rows);
    } catch (error) {
        console.error(error.message);
    }
});

router.get('/:insId', async (req, res) => {
    try {
        const { insId } = req.params;
        const thisInstitution = await pool.query('SELECT * FROM institutions WHERE ins_id = $1', [insId]);
        const relatedAccounts = await pool.query('SELECT * FROM accounts WHERE ins_id = $1', [insId]);

        const data = {
            institution: thisInstitution.rows[0], 
            accounts: relatedAccounts.rows
        };

        res.json(data);
    } catch (error) {
        console.error(error.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, logo, userId } = req.body;
        const newInstitution = await pool.query('INSERT INTO institutions (name, logo, user_id) VALUES ($1, $2, $3) RETURNING *', [name, logo, userId]);

        res.json(newInstitution.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
});

router.put('/:insId', async (req, res) => {
    try {
        const { insId } = req.params;
        const { name, logo } = req.body;
        const updateInstitution = await pool.query('UPDATE institutions SET name = $1, logo = $2 WHERE ins_id = $3', [name, logo, insId]);

        res.json(`Institution with ins_id = ${insId} was updated`);
    } catch (error) {
        console.error(error.message);
    }
});

router.delete('/:insId', async (req, res) => {
    try {
        const { insId } = req.params;

        // get all account id assoc with institution
        // loop through looking for transfer transactions belonging to account
        // get other transfer account ids
        // update those account and institution balances
        const creditedAccountIdData = await pool.query('SELECT credited_account_id FROM transactions JOIN accounts ON debited_account_id = account_id WHERE ins_id = $1 AND credited_account_id IS NOT NULL', [insId]);
        const debitedAccountIdData = await pool.query('SELECT debited_account_id FROM transactions JOIN accounts ON credited_account_id = account_id WHERE ins_id = $1 AND debited_account_id IS NOT NULL', [insId]);

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

        console.log(condensedCreditedAccountIds);
        console.log(condensedDebitedAccountIds);

        const deleteInstitution = await pool.query('DELETE FROM institutions WHERE ins_id = $1', [insId]);

        // Update other accounts and institutions affected by deleting related transactions (have both credited and debited account ids)
        condensedCreditedAccountIds.forEach(async (accountId) => {
            await updateAccountBalance(accountId);
            await updateInstitutionBalance(accountId);
        });
        condensedDebitedAccountIds.forEach(async (accountId) => {
            await updateAccountBalance(accountId);
            await updateInstitutionBalance(accountId);
        });

        res.json(`Institution with ins_id = ${insId} was deleted`);
    } catch (error) {
        console.error(error.message);
    }
});

module.exports = router;