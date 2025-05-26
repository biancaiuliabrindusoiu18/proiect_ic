const mongoose = require('mongoose');

const testCodeRegex = /^[A-Za-z0-9]+$/; // Alphanumeric only for test code
const testNameRegex = /^[A-Za-z\s]+$/; // Only letters and spaces for test name
const testUnitRegex = /^[A-Za-z\/]+$/; // Only letters and slashes for test unit
const testValueRegex = /^(positive|negative|\d+(\.\d+)?)$/; // Accepts "positive", "negative", or a number (integer or float)

const AnalysesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  test_name: { 
    type: String, 
    required: true, 
    //match: [testNameRegex, 'Test name must contain only letters and spaces.']
  },
  test_value: { 
    type: String,
    required: true,
    //match: [testValueRegex, 'Test value must be "positive", "negative", or a number']
  },
  test_unit: { 
    type: String, 
    //required: true, 
    //match: [testUnitRegex, 'Test unit must contain only letters and slashes.']
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
      //required: true,
      //match: [testValueRegex, 'Reference range must be "positive", "negative", or a number']
    },
    max: {
      type: String,
      //required: true,
      //match: [testValueRegex, 'Reference range must be "positive", "negative", or a number']
    },
    label: {
      type: String,
      //required: true,
      //match: [testNameRegex, 'Reference range label must contain only letters and spaces.']
    }
  }
});


AnalysesSchema.pre('validate', function (next) {
  const { reference_range } = this;

  const hasLabel = reference_range?.label?.trim() !== '';
  const hasMin = reference_range?.min?.trim() !== '';
  const hasMax = reference_range?.max?.trim() !== '';

  if (!hasLabel && !hasMin && !hasMax) {
    return next(
      new Error('Reference range must contain at least one of: min, max, or label.')
    );
  }

  return next();
});


const Analyses = mongoose.model('Analyses', AnalysesSchema);

module.exports = Analyses;
