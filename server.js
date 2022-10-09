// Dependencies -----
require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const controllers = require('./controllers');
const { PORT } = process.env;

// Middleware -----
app.use(express.json());
app.use(cors());

// Routers -----
app.use('/users', controllers.users);
app.use('/institutions', controllers.institutions);
app.use('/accounts', controllers.accounts);

// Listener -----
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})