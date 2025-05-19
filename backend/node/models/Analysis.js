const mongoose = require('mongoose');

const testCodeRegex = /^[A-Za-z0-9]+$/; // Alphanumeric only for test code
const testNameRegex = /^[A-Za-z\s]+$/; // Only letters and spaces for test name
const testUnitRegex = /^[A-Za-z\/]+$/; // Only letters and slashes for test unit
const testValueRegex = /^(positive|negative|\d+(\.\d+)?)$/; // Accepts "positive", "negative", or a number (integer or float)

const AnalysisSchema = new mongoose.Schema({
  /*test_code: { 
    type: String, 
    required: true, 
    match: [testCodeRegex, 'Test code must be alphanumeric.']
  },*/
  test_name: { 
    type: String, 
    required: true, 
    match: [testNameRegex, 'Test name must contain only letters and spaces.']
  },
  test_value: { 
    type: String,
    required: true,
    match: [testValueRegex, 'Test value must be "positive", "negative", or a number']
  },
  test_unit: { 
    type: String, 
    required: true, 
    match: [testUnitRegex, 'Test unit must contain only letters and slashes.']
  },
  test_date: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(value) {
        return !isNaN(value.getTime()); // Ensures it's a valid date
      },
      message: 'Test date must be a valid date.'
    }
  },
  reference_range: {
    min: {
      type: String,
      required: true,
      match: [testValueRegex, 'Reference range must be "positive", "negative", or a number']
    },
    max: {
      type: String,
      required: true,
      match: [testValueRegex, 'Reference range must be "positive", "negative", or a number']
    }
  }
});

const Analysis = mongoose.model('Analysis', AnalysisSchema);

module.exports = Analysis;
