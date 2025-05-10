const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User');


// Register
router.post('/register', async (req, res) => {
    const { account, password, firstName, lastName, birth_date, sex } = req.body;

    // Input validation
    if (!account || !password || !firstName || !lastName || !birth_date || !sex) {
        return res.status(400).json({ msg: ' Please fill in all the fields' });
    }

    try { 
        let user;
        if (account.includes('@')) {
            user = await User.findOne({ email: account });
        }
        if (user) {
            return res.status(400).json({ msg: 'An account with the provided Email already exists.'  });
        }

        // create a new user
        user = new User({
            first_name: firstName,
            last_name: lastName,
            email: account,
            password: password, // Password hashing will be handled by the middleware in User model
            birth_date: birth_date,
            sex: sex
        });

        // save the user to the database
        await user.save();
        res.status(201).json({ msg: 'User registered successfully' });

      } catch (err) {
        console.error(err.message);
        // MoongoseDB validation error handling
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ msg: messages.join(', ') });
        }
        res.status(500).send('Server error');
    }
});

// Login
router.post('/login', async (req, res) => {
        const { account, password, rememberMe } = req.body;

        // Validate email or phone and password
        if (!account || !password) {
            return res.status(400).json({ msg: 'Email and password are required.' });
        }

        try { //search for user by email or phone
            let user;
            if (account.includes('@')) { // Check if account is an email
            user = await User.findOne({ email: account });
            }

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

        console.log('Login successful:', user.first_name, user.last_name, user.email, user.phone);

        res.json({
          token,
          first_name: user.first_name,
          msg: 'Login successful! You will be redirected to the home page!',
        });
      } catch (err) {
        console.error(err.message);
        // MoongoseDB validation error handling
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ msg: messages.join(', ') });
        }
        res.status(500).send('Server error');
    }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    const { account } = req.body;
  
    if (!account) return res.status(400).json({ msg: 'Email is required.' });
  
    try {
      const user = await User.findOne({ email: account });
      if (user) {
  
        const resetToken = crypto.randomBytes(20).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
        await user.save({ validateBeforeSave: false });        
  
        // Create a reset URL
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
        
        // Send email with the reset link
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
            }
        });
  
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: account,
        subject: 'Password Reset Request',
        html: `
          <h3>Password Reset</h3>
          <p>Click the link below to reset your password. It expires in 10 minutes:</p>
          <a href="${resetUrl}">${resetUrl}</a>
        `
      });
    }
      res.json({ msg: 'If an account with that email exists, you\'ll receive a password reset link shortly.' });
    } catch (err) {
      console.error(err.message);
      // MoongoseDB validation error handling
      if (err.name === 'ValidationError') {
          const messages = Object.values(err.errors).map(val => val.message);
          return res.status(400).json({ msg: messages.join(', ') });
      }
      res.status(500).send('Server error');
  }
});

// Reset password using the generated token
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    console.log('Token:', token);
    console.log('Password:', password);
    
    if (!password) return res.status(400).json({ msg: 'Password is required.' });
  
    try {
       const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
      // Find user by resetPasswordToken and check if the token is still valid (not expired)
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
      });
  
      if (!user) return res.status(400).json({ msg: 'Invalid or expired token.' });
  
   
      user.password = password; //hash password in the User model pre-save hook   ///MERGE DAR DOAR CAND ARE CHEF?? NU IMI DAU SEAMA PT CE NU MERGE
      user.resetPasswordToken = undefined;  // Clear the reset token after reset
      user.resetPasswordExpire = undefined; // Clear the expiration date
      await user.save();
  
      res.json({ msg: 'Password has been successfully reset.' });
    } catch (err) {
      console.error(err.message);
      // MoongoseDB validation error handling
      if (err.name === 'ValidationError') {
          const messages = Object.values(err.errors).map(val => val.message);
          return res.status(400).json({ msg: messages.join(', ') });
      }
      res.status(500).send('Server error');
  }
  
});

    module.exports = router;


