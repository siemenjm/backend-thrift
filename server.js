// Dependencies -----
require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./database/db_config');

const { PORT } = process.env;

// Middleware -----
app.use(express.json());
app.use(cors());

// Routes -----
app.get('/institutions', async (req, res) => {
    try {
        const allInstitutions = await pool.query('SELECT * FROM institution');

        res.json(allInstitutions.rows);
    } catch (error) {
        console.error(error.message);
    }
});

app.post('/institutions', async (req, res) => {
    try {
        const { name, logo } = req.body;
        const newInstitution = await pool.query('INSERT INTO institution (name, logo) VALUES ($1, $2) RETURNING *', [name, logo]);

        res.json(newInstitution.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
});

// Listener -----
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})