const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const emailRegex = /^[a-zA-Z0-9._%+-]{6,30}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; // Minimum 6 characters before @, 2-4 characters after .
const nameRegex = /^[A-Za-zăîșțâĂÎȘȚÂ]{3,30}$/; // Minimum 3 characters, only letters
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum 8 characters, at least one letter and one number

const UserSchema = new mongoose.Schema({
  first_name: {     //ASTA E PRENUMELE
    type: String,
    required: true,
    match: [nameRegex, 'First name must be minimum 3 characters, only letters']
  },
  last_name: {
    type: String,
    required: true,
    match: [nameRegex, 'Last name must be minimum 3 characters, only letters']          
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [emailRegex, 'Invalid email format']             
  },
  password: {
    type: String,
    required: true,
    match: [passwordRegex, 'Password must be inimum 8 characters, at least one letter and one number']           
  },
  birth_date: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        const today = new Date();
        const maxAge = 120;
        const minDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
  
        return value <= today && value >= minDate;
      },
      message: 'Date of birth must be a valid date and not more than 120 years ago'
    }
  },
  sex: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },  
  date: {
    type: Date,
    default: Date.now        
  },
  analyses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Analysis'  // Referencing the Analysis model
  }],
  resetPasswordToken: String,    // Token for password reset
  resetPasswordExpire: Date     // Expiration date for the token
});

// hash password before saving to the database
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) { // If the password is not modified, skip hashing
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10); 
    this.password = await bcrypt.hash(this.password, salt);  // Hash the password
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', UserSchema);
