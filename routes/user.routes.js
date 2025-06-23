const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users.js');

const router = express.Router();

// Home route
router.get('/', (req, res) => {
  res.send('User Home Page');
});

// Show register form
router.get('/register', (req, res) => {
  res.render('register');
});

// Show login form
router.get('/login', (req, res) => {
  res.render('login');
});

// Handle login
router.post(
  '/login',
  [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email format'),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Validation failed',
      });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({
        $or: [{ email: email }, { Username: email }],
      });

      if (!user) {
        return res.status(400).json({ message: 'Email or password is incorrect' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Email or password is incorrect' });
      }

      const token = jwt.sign(
        {
          id: user._id,
          Username: user.Username,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 3600000,
      });

      res.render('redirect', { user }); // or redirect to dashboard if you have one
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Handle registration
router.post(
  '/user/register',
  [
    body('Username').notEmpty().withMessage('Username is required'),
    body('email').trim().isEmail().withMessage('Invalid email format'),
    body('password')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Validation failed',
      });
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordPattern.test(req.body.password)) {
      return res.status(400).json({
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number.'
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const { Username, email } = req.body;

      const user = new User({
        Username,
        email,
        password: hashedPassword,
      });

      await user.save();

      console.log(`✅ User Registered: ${Username}, ${email}`);
      res.redirect('/users/login'); // 🔥 Redirect to login page after successful registration
    } catch (error) {
      console.error('❌ Error saving user:', error);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
