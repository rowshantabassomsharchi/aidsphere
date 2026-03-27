const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Auth fields
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },

  // Health profile fields (all optional — filled later on /user page)
  profile: {
    name: String,
    age: Number,
    gender: String,
    height: Number,
    weight: Number,
    bloodType: String,
    diseases: [String],      // array of strings like ["Diabetes", "Asthma"]
    allergies: [String],
    medications: [String],
    smoking: String,
    alcohol: String,
    profileComplete: { type: Boolean, default: false }
  }
}, {
  timestamps: true  // adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('User', userSchema);