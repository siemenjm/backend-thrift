// Dependencies -----
require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./config/db_config');

const { PORT } = process.env;

// Middleware -----
app.use(express.json());
app.use(cors());

// Routes -----
app.get('/institutions', async (req, res) => {
    try {
        const allInstitutions = await pool.query('SELECT * FROM institutions');

        res.json(allInstitutions.rows);
    } catch (error) {
        console.error(error.message);
    }
});

app.get('/institutions/:insId', async (req, res) => {
    try {
        const { insId } = req.params;
        const thisInstitution = await pool.query('SELECT * FROM institutions WHERE ins_id = $1', [insId]);

        res.json(thisInstitution.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
});

app.post('/institutions', async (req, res) => {
    try {
        const { name, logo } = req.body;
        const newInstitution = await pool.query('INSERT INTO institutions (name, logo) VALUES ($1, $2) RETURNING *', [name, logo]);

        res.json(newInstitution.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
});

app.put('/institutions/:insId', async (req, res) => {
    try {
        const { insId } = req.params;
        const { name, logo } = req.body;
        const updateInstitution = await pool.query('UPDATE institutions SET name = $1, logo = $2 WHERE ins_id = $3', [name, logo, insId]);

        res.json(`Institution with ins_id = ${insId} was updated`);
    } catch (error) {
        console.error(error.message);
    }
});

app.delete('/institutions/:insId', async (req, res) => {
    try {
        const { insId } = req.params;
        const deleteInstitution = await pool.query('DELETE FROM institutions WHERE ins_id = $1', [insId]);

        res.json(`Institution with ins_id = ${insId} was deleted`);
    } catch (error) {
        console.error(error.message);
    }
});

// Listener -----
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})