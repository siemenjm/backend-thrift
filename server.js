// Dependencies -----
require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

const controllers = require('./controllers');
const { PORT } = process.env;

// Middleware -----
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Routers -----
app.use('/users', controllers.users);
app.use('/institutions', controllers.institutions);
app.use('/accounts', controllers.accounts);
app.use('/transactions', controllers.transactions);

// Test route -----
app.get('/', async (req, res) => {
    try {
        res.send('Hello World');
    } catch (error) {
        console.error(error.message);
    }
});

// Listener -----
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})