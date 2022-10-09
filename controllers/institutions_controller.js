// Dependencies -----
const express = require('express');
const router = express.Router();
const pool = require('../config/db_config');

// Middleware -----
router.use(express.json());

// Routes -----
router.get('/', async (req, res) => {
    try {
        const allInstitutions = await pool.query('SELECT * FROM institutions');

        res.json(allInstitutions.rows);
    } catch (error) {
        console.error(error.message);
    }
});

router.get('/:insId', async (req, res) => {
    try {
        const { insId } = req.params;
        const thisInstitution = await pool.query('SELECT * FROM institutions WHERE ins_id = $1', [insId]);

        res.json(thisInstitution.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, logo } = req.body;
        const newInstitution = await pool.query('INSERT INTO institutions (name, logo) VALUES ($1, $2) RETURNING *', [name, logo]);

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
        const deleteInstitution = await pool.query('DELETE FROM institutions WHERE ins_id = $1', [insId]);

        res.json(`Institution with ins_id = ${insId} was deleted`);
    } catch (error) {
        console.error(error.message);
    }
});

module.exports = router;