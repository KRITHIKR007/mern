const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const email = 'admin@example.com';
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin already exists');
    process.exit(0);
  }
  const hashed = await bcrypt.hash('Admin@123', 10);
  const user = new User({ email, password: hashed });
  await user.save();
  console.log('Admin created:', email);
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
