const Agent = require('../models/Agent');
const bcrypt = require('bcryptjs');

exports.addAgent = async (req, res) => {
  const { name, email, mobile, password } = req.body;
  try {
    const existing = await Agent.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Agent already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const agent = new Agent({ name, email, mobile, password: hashedPassword });
    await agent.save();
    res.status(201).json(agent);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAgents = async (req, res) => {
  try {
    const agents = await Agent.find();
    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteAgent = async (req, res) => {
  try {
    const id = req.params.id;
    await Agent.findByIdAndDelete(id);
    res.json({ message: 'Agent deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateAgent = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, mobile, password } = req.body;
    const updateData = { name, email, mobile };
    
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }
    
    const agent = await Agent.findByIdAndUpdate(id, updateData, { new: true });
    res.json(agent);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
