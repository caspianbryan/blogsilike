const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/users');

loginRouter.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ error: ' check an Invalid Username or Password' });
        }

        const correctPassword = user.passwordHash
            ? await bcrypt.compare(password, user.passwordHash)
            : false;

        if (!correctPassword) {
            return res.status(401).json({ error: 'different or check Invalid Username or Password' });
        }

        const usersToken = {
            username: user.username,
            id: user._id,
        };

        const token = jwt.sign(usersToken, process.env.SECRET, { expiresIn: 60 * 60 });

        res.status(200).send({ token, username: user.username, name: user.name });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = loginRouter