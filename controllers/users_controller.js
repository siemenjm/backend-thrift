// Dependencies -----
const express = require('express');
const router = express.Router();
const pool = require('../config/db_config');

// Middleware -----
router.use(express.json());

// Routes -----
router.get('/', async (req, res) => {
    try {
        const allUsers = await pool.query('SELECT * FROM users');

        res.json(allUsers.rows);
    } catch (error) {
        console.error(error.message);
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const thisUser = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);

        res.json(thisUser.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const { first_name, last_name, email, password, avatar } = req.body;
        const newUser = await pool.query('INSERT INTO users (first_name, last_name, email, password, avatar) VALUES ($1, $2, $3, $4, $5) RETURNING *', [first_name, last_name, email, password, avatar]);

        res.json(newUser.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
});

router.put('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { first_name, last_name, email, password, avatar } = req.body;
        const updateUser = await pool.query('UPDATE users SET first_name = $1, last_name = $2, email = $3, password = $4, avatar = $5 WHERE user_id = $6', [first_name, last_name, email, password, avatar, userId]);

        res.json(`User with user_id = ${userId} was updated`);
    } catch (error) {
        console.error(error.message);
    }
});

router.delete('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const deleteUser = await pool.query('DELETE FROM users WHERE user_id = $1', [userId]);

        res.json(`User with user_id = ${userId} was deleted`);
    } catch (error) {
        console.error(error.message);
    }
});

module.exports = router;