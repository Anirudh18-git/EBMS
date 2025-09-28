const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  date: { type: String, required: true },
  amount: { type: Number, required: true },
});

const billSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, required: true },
  meterNumber: { type: String, required: true },
  month: { type: String, required: true },
  unitsConsumed: { type: Number, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Paid', 'Unpaid'], required: true },
  generationDate: { type: String, required: true },
  payments: [paymentSchema],
}, { timestamps: true });

module.exports = mongoose.model('Bill', billSchema);
