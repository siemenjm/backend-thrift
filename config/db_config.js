const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'jaredsiemen',
    password: '',
    host: 'localhost',
    port: '5432',
    database: 'thrift'
});

module.exports = pool;