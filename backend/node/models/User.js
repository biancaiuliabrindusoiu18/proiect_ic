const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const emailRegex = /^[a-zA-Z0-9._%+-]{6,30}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; // Minimum 6 characters before @, 2-4 characters after .
const nameRegex = /^[A-Za-zăîșțâĂÎȘȚÂ]{3,30}$/; // Minimum 3 characters, only letters
//const phoneRegex = /^\+?[0-9]{10,15}$/; // Optional +, 10-15 digits
const addressRegex = /^[A-Za-z0-9\s,.'-]{3,}$/; // Minimum 3 characters, letters, numbers, spaces, and some special characters
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum 8 characters, at least one letter and one number

const UserSchema = new mongoose.Schema({
  first_name: {     //ASTA E PRENUMELE
    type: String,
    required: true,
    match: [nameRegex, 'Minimum 3 characters, only letters']
  },
  last_name: {
    type: String,
    required: true,
    match: [nameRegex, 'Minimum 3 characters, only letters']          
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [emailRegex, 'Invalid email format']             
  },
  password: {
    type: String,
    required: true,
    match: [passwordRegex, 'Minimum 8 characters, at least one letter and one number']           
  },
  /*phone: {
    type: String,
    required: true,
    unique: true,
    match: [phoneRegex, 'Invalid phone number format']
  },*/
  address: {
    type: String,
    required: false,
    match: [addressRegex, 'Invalid address format']
  },
  date: {
    type: Date,
    default: Date.now        
  },
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
