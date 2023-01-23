process.env.NODE_ENV !== "production" ? require('dotenv').config() : '';

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('mongoose').set('strictQuery', true);
require('./config/db').connect()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'key',
    resave: false,
    saveUninitialized: false
})) // SAME AS session_start()
app.use(cookieParser("MY SECRET"));


function manageErrors(err, req, res, next)
{
    if (req.statusCode === (404 || 500)) return next(err);
}

const authRoutes = require('./routes/auth');
app.use('/api/user', authRoutes);
app.use(manageErrors, (req, res, next) => {
    res.send("NOT FOUND");
})

const port = 3001;
app.listen(port);