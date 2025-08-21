const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Agent = require('./models/Agent');

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const agents = [
    { name: 'Agent One', email: 'a1@example.com', mobile: '+10000000001' },
    { name: 'Agent Two', email: 'a2@example.com', mobile: '+10000000002' },
    { name: 'Agent Three', email: 'a3@example.com', mobile: '+10000000003' },
    { name: 'Agent Four', email: 'a4@example.com', mobile: '+10000000004' },
    { name: 'Agent Five', email: 'a5@example.com', mobile: '+10000000005' }
  ];
  for (const a of agents) {
    const existing = await Agent.findOne({ email: a.email });
    if (existing) continue;
    const hashed = await bcrypt.hash('Agent@123', 10);
    const agent = new Agent({ ...a, password: hashed });
    await agent.save();
    console.log('Created agent', a.email);
  }
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
