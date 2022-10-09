// Dependencies -----
require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');

const { PORT } = process.env;

// Middleware -----
app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})