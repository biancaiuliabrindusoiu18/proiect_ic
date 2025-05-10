const Analysis = require('../models/Analysis');  // Assuming Analysis model is defined
const User = require('../models/User');

//add
router.post('/add-analysis', async (req, res) => {
  const { userId, test_code, test_name, test_value, test_unit, test_date, reference_range } = req.body;

  try {
    const newAnalysis = new Analysis({
      test_code,
      test_name,
      test_value,
      test_unit,
      test_date,
      reference_range
    });
    
    // Save the analysis to the database
    const savedAnalysis = await newAnalysis.save();

    // Find the user by userId and add the new analysis ObjectId to their analyses array
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.analyses.push(savedAnalysis._id); // Add the analysis ObjectId to the user's analyses array
    await user.save(); // Save the updated user document

    res.status(201).json({ msg: 'Analysis added successfully', analysis: savedAnalysis });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete analysis by ID and remove it from the user's analyses array
router.delete('/delete-analysis/:analysisId', async (req, res) => {
  const { analysisId } = req.params;
  const { userId } = req.body;

  try {
    // Find the analysis in the database
    const analysis = await Analysis.findById(analysisId);
    if (!analysis) {
      return res.status(404).json({ msg: 'Analysis not found.' });
    }

    // Find the user who owns the analysis
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found.' });
    }

    // Check if the analysis belongs to the user
    if (!user.analyses.includes(analysisId)) {
      return res.status(400).json({ msg: 'Analysis does not belong to the user.' });
    }

    // Remove the analysis from the user's analyses array
    user.analyses.pull(analysisId);
    await user.save();

    // Delete the analysis from the Analysis collection
    await Analysis.findByIdAndDelete(analysisId);

    res.status(200).json({ msg: 'Analysis successfully deleted.' });
  } catch (err) {
    console.error(err.message);
    if (err.name === 'CastError') {
      return res.status(400).json({ msg: 'Invalid analysis ID or user ID.' });
    }
    res.status(500).send('Server error');
  }
});
