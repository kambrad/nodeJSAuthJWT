const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const token = require('../auth/token');
const validate = require('../auth/valid');

const Errors = [];

router.get('/account', token, (req, res) => {
    res.render('index.ejs', { name: 'user' }); 
})

router.get('/login', validate, (req, res) => {
    res.render('login.ejs', { errors: Errors });
})

router.get('/register', validate, (req, res) => {
    res.render('register.ejs', { errors: Errors});
})

router.post('/register', validate, async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!(name || email || password)) return res.status(400).render('register.ejs', { errors: "input values are required." });
        if (password.length > 3) return res.status(400).render('register.ejs', { errors: "password too long."});

        if ( await User.findOne({ email: email })) return res.status(409).render('register.ejs', { errors: "email already exists"})

        const salt = await bcrypt.genSalt(Number('10'));
        const hashPassword = await bcrypt.hash(password, salt);

        const user = await User.create(
            {
                name: name,
                email: email,
                password: hashPassword
            }
        )

        const savedUser = await user.save();
       res.status(201).redirect('/api/user/login');
        // res.status(201).header("authorization", accessToken).redirect('/api/user/login');
    } catch(error)
    {
        console.error(error);
    }
});

    router.post('/login', validate, async (req, res) => {
        try
        {
            const { email, password } = req.body;

            if (!(email || password)) return res.status(400).render('login.ejs', { errors: "input values are required"});
            const user = await User.findOne({ email: email});
            if ( !user ) return res.status(409).render("login.ejs", { errors: "email does not exists"});
            if (!await bcrypt.compare(password, user.password)) return res.status(400).render('login.ejs', { errors: "password is incorrect "});

            const _token = jwt.sign({ id: user._id, name: user.name }, process.env.SECRET);
            console.log (
                {
                    name: user.name,
                    email: user.email
                }
            )
            res.status(200).cookie("auth", _token, { maxAge: 1000 * 24, httpOnly: true }).redirect("/api/user/account");
        } catch(e)
        {
            console.log(e);
        }
    })

    router.post('/logout', (req, res, next) => {
        const { auth } = req.cookies;
        if ( auth ) return res.status(400).cookie("auth", "").redirect('/api/user/login');
    })


module.exports = router;