const express = require('express');
const Analyses = require('../models/Analyses');
const User = require('../models/User');
const mongoose = require('mongoose');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add-analyses', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;  // token already verified by authMiddleware

    // Get request body
    const { nume, valoare, unit, intv, data } = req.body;

    if (!nume || !valoare || !data) {
      return res.status(400).json({ msg: 'Test name, value, and date are required' });
    }

    // Parse date from DD.MM.YYYY format to Date object
    let testDate;
    try {
      const dateParts = data.split('.');
      if (dateParts.length === 3) {
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
      if (intv.min !== null && intv.min !== '') reference_range.min = String(intv.min);
      if (intv.max !== null && intv.max !== '') reference_range.max = String(intv.max);
      if (intv.nonvalue !== null && intv.nonvalue !== '') reference_range.label = String(intv.nonvalue);
    }

    const newAnalyses = new Analyses({
      userId,
      test_name: nume,
      test_value: String(valoare),
      test_unit: unit || '',
      test_date: testDate,
      reference_range
    });

    const savedAnalyses = await newAnalyses.save();

    // add analyses ID to user's analyses array
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    await User.findByIdAndUpdate(userId, { $push: { analyses: savedAnalyses._id } });

    res.status(201).json({ msg: 'Analyses added successfully', analyses: savedAnalyses });

  } catch (err) {
    console.error('Error in add-analyses:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ msg: 'Validation error', errors });
    }
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// get all analyses for the authenticated user
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;  // token already verified by authMiddleware

    const analyses = await Analyses.find({ userId: mongoose.Types.ObjectId(userId) }).sort({ test_date: -1 });
    res.json(analyses);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});


// get recent analyses grouped by date
router.get('/recent', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId; // string

    const objectUserId = new mongoose.Types.ObjectId(userId);

    const recentGrouped = await Analyses.aggregate([
      { $match: { userId: objectUserId } },  // filtrare corectă după ObjectId
      {
        $group: {
          _id: {
            $dateToString: { format: "%d.%m.%Y", date: "$test_date" }
          },
          tests: { $push: "$$ROOT" }
        }
      },
      { $sort: { _id: -1 } }, // cele mai recente zile primele
      
    ]);

    if (!recentGrouped.length) {
      return res.status(404).json({ msg: 'No recent tests found' });
    }

    res.json(recentGrouped);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// get latest analyses for each test name
router.get('/latest', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const objectUserId = new mongoose.Types.ObjectId(userId);

    const latestAnalyses = await Analyses.aggregate([
      { $match: { userId: objectUserId } },
      { $sort: { test_date: -1 } },
      {
        $group: {
          _id: "$test_name",
          latest: { $first: "$$ROOT" }
        }
      },
      { $replaceWith: "$latest" },
      { $sort: { test_name: 1 } } // sortare alfabetică ascendentă
    ]);

    res.json(latestAnalyses);
  } catch (err) {
    console.error('Error in /analyses/latest:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// get all analyses by test name
router.get('/by-name/:testName', authMiddleware, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const { testName } = req.params;

    const tests = await Analyses.find({
      userId: userId,
      test_name: testName
    }).sort({ test_date: 1 }); // cronologic

    if (!tests.length) {
      return res.status(404).json({ msg: `No tests found for ${testName}` });
    }

    res.json(tests);
  } catch (err) {
    console.error('Error in /analyses/by-name/:testName:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});


// get all analyses for a specific date
router.get('/by-date/:date', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const formattedDate = req.params.date; // e.g. "27.05.2025"

    // convert to ISO date range (start of day to end of day)
    const [day, month, year] = formattedDate.split('.');
    const start = new Date(`${year}-${month}-${day}T00:00:00`);
    const end = new Date(`${year}-${month}-${day}T23:59:59`);

    const tests = await Analyses.find({
      userId: new mongoose.Types.ObjectId(userId),
      test_date: { $gte: start, $lte: end }
    }).sort({ test_name: 1 });

    if (!tests.length) {
      return res.status(404).json({ msg: `No tests found for ${formattedDate}` });
    }

    res.json(tests);
  } catch (err) {
    console.error('Error in /analyses/by-date/:date', err);
    res.status(500).json({ msg: 'Server error' });
  }
});




module.exports = router;
