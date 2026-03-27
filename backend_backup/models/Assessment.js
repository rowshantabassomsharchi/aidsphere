const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,  // links to the User document
    ref: 'User',
    required: true
  },
  symptoms: [String],         // e.g. ["Chest Pain", "Fatigue"]
  conditions: [String],       // existing conditions checked
  score: Number,              // the final risk score number
  riskLevel: String,          // "Low", "Moderate", "High", "Emergency"
  recommendation: String      // text recommendation shown to user
}, {
  timestamps: true
});

module.exports = mongoose.model('Assessment', assessmentSchema);