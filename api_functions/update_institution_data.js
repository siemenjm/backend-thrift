const pool = require('../config/db_config');

async function updateInstitutionBalance(accountId) {
    const institutionID = await pool.query('SELECT ins_id FROM accounts WHERE account_id = $1', [accountId]);
    const institutionBalance = await pool.query('SELECT SUM(current_balance) FROM accounts WHERE ins_id = $1', [institutionID.rows[0].ins_id]);
    const updateInstitution = await pool.query('UPDATE institutions SET current_balance = $1 WHERE ins_id = $2', [institutionBalance.rows[0].sum, institutionID.rows[0].ins_id]);
}

module.exports = updateInstitutionBalance;