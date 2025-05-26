const express = require('express');
const Analyses = require('../models/Analyses');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/add-analyses', async (req, res) => {
  try {
    // Take the token from the request header
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Header should be in the format "Bearer <token>"
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return res.status(401).json({ msg: 'Token missing' });
    }

    // Decode the token to get user ID
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ msg: 'Token is not valid' });
    }
    const userId = decoded.user.id;

    // Get request body
    const { nume, valoare, unit, intv, data } = req.body;

    // Validate required fields
    if (!nume || !valoare || !data) {
      return res.status(400).json({ msg: 'Test name, value, and date are required' });
    }

    // Parse date from DD.MM.YYYY format to Date object
    let testDate;
    try {
      const dateParts = data.split('.');
      if (dateParts.length === 3) {
        // Convert DD.MM.YYYY to YYYY-MM-DD
        const [day, month, year] = dateParts;
        testDate = new Date(`${year}-${month}-${day}`);
      } else {
        throw new Error('Invalid date format');
      }
    } catch (err) {
      return res.status(400).json({ msg: 'Invalid date format. Expected DD.MM.YYYY' });
    }

    // Make reference_range object
    const reference_range = {};
    
    if (intv) {
      if (intv.min !== null && intv.min !== '') {
        reference_range.min = String(intv.min);
      }
      if (intv.max !== null && intv.max !== '') {
        reference_range.max = String(intv.max);
      }
      if (intv.nonvalue !== null && intv.nonvalue !== '') {
        reference_range.label = String(intv.nonvalue);
      }
    }

    // Creates a new analyses document
    const newAnalyses = new Analyses({
      userId,
      test_name: nume,
      test_value: String(valoare),
      test_unit: unit || '',
      test_date: testDate,
      reference_range
    });

    const savedAnalyses = await newAnalyses.save();

    // Add the analyses ID to the user's analyses array
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    await User.findByIdAndUpdate(
      userId,
      { $push: { analyses: savedAnalyses._id } }
    );

    // Success response
    res.status(201).json({ 
      msg: 'Analyses added successfully', 
      analyses: savedAnalyses 
    });

  } catch (err) {
    console.error('Error in add-analyses:', err);
    
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ msg: 'Validation error', errors });
    }
    
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Delete analyses by ID and remove it from the user's analyses array
router.delete('/delete-analyses/:analysesId', async (req, res) => {
  try {
    // Get token from header for authentication
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ msg: 'Token missing' });
    }

    // Decode the token to get user ID
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ msg: 'Token is not valid' });
    }
    const userId = decoded.user.id;

    const { analysesId } = req.params;

    // Find the analyses in the database
    const analyses = await Analyses.findById(analysesId);
    if (!analyses) {
      return res.status(404).json({ msg: 'Analyses not found.' });
    }

    // Check if the analyses belongs to the authenticated user
    if (analyses.userId.toString() !== userId) {
      return res.status(403).json({ msg: 'Not authorized to delete this analyses.' });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found.' });
    }

    // Remove the analyses from the user's analyses array
    user.analyses.pull(analysesId);
    await user.save();

    // Delete the analyses from the Analyses collection
    await Analyses.findByIdAndDelete(analysesId);

    res.status(200).json({ msg: 'Analyses successfully deleted.' });
  } catch (err) {
    console.error('Error in delete-analyses:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ msg: 'Invalid analyses ID.' });
    }
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;