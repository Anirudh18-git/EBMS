const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/bills', require('./routes/bills'));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
    // Seed admin user
    const adminExists = await User.findOne({ role: 'ADMIN' });
    if (!adminExists) {
      const admin = new User({
        name: 'Admin',
        address: '123 Power Grid St.',
        email: 'admin@system.com',
        meterNumber: 'N/A',
        password: 'admin',
        role: 'ADMIN',
      });
      await admin.save();
      console.log('Admin user seeded');
    }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
