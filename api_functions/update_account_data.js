const pool = require('../config/db_config');

async function updateAccountBalance(accountId) {
    const accountCredits = await pool.query(`SELECT SUM(amount) FROM transactions WHERE credited_account_id = $1`, [accountId]);
    const accountDebits = await pool.query('SELECT SUM(amount) FROM transactions WHERE debited_account_id = $1', [accountId]);
    const accountBalance = accountDebits.rows[0].sum - accountCredits.rows[0].sum;
    const updateAccount = await pool.query('UPDATE accounts SET current_balance = $1 WHERE account_id = $2', [accountBalance, accountId]);
}

module.exports = updateAccountBalance;