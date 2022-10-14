const pool = require('../config/db_config');

async function updateAccountBalance(accountId) {
    const startingAccountBalanceData = await pool.query('SELECT starting_balance FROM accounts WHERE account_id = $1', [accountId]);
    const accountCreditsData = await pool.query(`SELECT SUM(amount) FROM transactions WHERE credited_account_id = $1`, [accountId]);
    const accountDebitsData = await pool.query('SELECT SUM(amount) FROM transactions WHERE debited_account_id = $1', [accountId]);

    const startingAccountBalance = parseFloat(startingAccountBalanceData.rows[0].starting_balance) || 0;
    const accountCredits = parseFloat(accountCreditsData.rows[0].sum) || 0;
    const accountDebits = parseFloat(accountDebitsData.rows[0].sum) || 0;

    const accountBalance = startingAccountBalance + accountDebits - accountCredits;
    const updateAccount = await pool.query('UPDATE accounts SET current_balance = $1 WHERE account_id = $2', [accountBalance, accountId]);
}

module.exports = updateAccountBalance;