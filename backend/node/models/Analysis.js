const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  userId: { // ID-ul utilizatorului
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { // Numele analizei (ex: HTC)
    type: String,
    required: true,
    trim: true
  },
  value: { // Valoarea rezultatului analizei
    type: Number,
    required: true
  },
  unit: { // Unități (ex: mg/dL, cm, etc.)
    type: String,
    required: true
  },
  interval: { // Intervalul de referință pentru analiza respectivă
    type: String,
    required: true
  },
  date: { // Data la care a fost efectuată analiza
    type: Date,
    required: true
  }
});
module.exports = mongoose.model('Analysis', AnalysisSchema);