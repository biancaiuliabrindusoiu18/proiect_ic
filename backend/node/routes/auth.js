const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
bcrypt = require('bcryptjs');

// Register
router.post('/register', async (req, res) => {
    const { account, password, firstName, lastName } = req.body;

    // Input validation
    if (!account || !password || !firstName || !lastName) {
        return res.status(400).json({ msg: 'All fields are mandatory.' });
    }

    try { 
        let user;
        if (account.includes('@')) {
            user = await User.findOne({ email: account });
        } /*else { //
            user = await User.findOne({ phone: account });
        }*/ // TBD if phone number

        if (user) {
            return res.status(400).json({ msg: 'An account with the provided Email or Phone number already exists.'  });
        }

        // create a new user
        user = new User({
            first_name: firstName,
            last_name: lastName,
            email: account.includes('@') ? account : null,
            //phone: !account.includes('@') ? account : null,
            password: password // Password hashing will be handled by the middleware in User model
        });

        // save the user to the database
        await user.save();
                                    //choosing the option not to be logged in after registration
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login
router.post('/login', async (req, res) => {
        const { account, password, rememberMe } = req.body;

        //const emailRegex = /^[a-zA-Z0-9._%+-]{6,30}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        //const phoneRegex = /^\+?[0-9]{10,15}$/; // Optional +, 10-15 digits  TBD

        // Validate email or phone and password
        if (!account || !password) {
            return res.status(400).json({ msg: 'Email or or Phone number and password are required.' });
        }

        try { //search for user by email or phone
            let user;
            if (account.includes('@')) { // Check if account is an email
            user = await User.findOne({ email: account });
            } /*else {// It is a phone number
            user = await User.findOne({ phone: account });
            }   TBD if phone number*/                                        
            if (!user) {
                return res.status(400).json({ msg: 'No account found with the provided Email or Phone number.' });
            }

        const isMatch = await bcrypt.compare(password, user.password);
        // Check if the password is correct
        if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid password.' });
        }

        const payload = {// Create JWT payload
        user: {
            id: user.id
        }
        };
        let expiresIn = rememberMe ? '7d' : '1h'; // Set expiration time based on rememberMe
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });// Sign the token with a secret key and set expiration time

        res.json({ token });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
    });

    module.exports = router;