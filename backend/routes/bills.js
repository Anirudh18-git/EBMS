const express = require('express');
const Bill = require('../models/Bill');
const User = require('../models/User');
const { auth, admin } = require('../middleware/auth');

const router = express.Router();

// Get bills (admin gets all, customer gets their own)
router.get('/', auth, async (req, res) => {
  try {
    let bills;
    if (req.user.role === 'ADMIN') {
      bills = await Bill.find().populate('customerId', 'name email');
    } else {
      bills = await Bill.find({ customerId: req.user.id });
    }
    res.json(bills);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Generate new bill (admin only)
router.post('/', auth, admin, async (req, res) => {
  const { customerId, month, unitsConsumed, amount } = req.body;
  try {
    const user = await User.findById(customerId);
    if (!user) {
      return res.status(404).json({ msg: 'Customer not found' });
    }
    const bill = new Bill({
      customerId,
      customerName: user.name,
      meterNumber: user.meterNumber,
      month,
      unitsConsumed,
      amount,
      status: 'Unpaid',
      generationDate: new Date().toISOString().split('T')[0],
    });
    await bill.save();
    res.json(bill);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update bill status (e.g., mark as paid)
router.put('/:id', auth, async (req, res) => {
  const { status, payments } = req.body;
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ msg: 'Bill not found' });
    }
    if (req.user.role !== 'ADMIN' && bill.customerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Access denied' });
    }
    bill.status = status || bill.status;
    if (payments) bill.payments = payments;
    await bill.save();
    res.json(bill);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
