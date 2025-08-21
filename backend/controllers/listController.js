const Agent = require('../models/Agent');
const ListItem = require('../models/ListItem');
const csvParse = require('csv-parse/sync');
const XLSX = require('xlsx');

exports.uploadList = async (req, res) => {
  try {
    let items = [];
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });
    const ext = require('path').extname(file.originalname).toLowerCase();
    if (ext === '.csv') {
      const text = file.buffer.toString('utf8');
      items = csvParse(text, { columns: true });
    } else if (ext === '.xlsx' || ext === '.xls') {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      items = XLSX.utils.sheet_to_json(sheet);
    }
    // Normalize item keys to lowercase for flexible headers
    items = items.map(raw => {
      const obj = {};
      Object.keys(raw).forEach(k => { obj[k.trim().toLowerCase()] = raw[k]; });
      return obj;
    });

    // Validate format (look for firstname, phone, notes)
    if (!items.every(i => i.firstname && i.phone && i.notes)) {
      return res.status(400).json({ message: 'Invalid file format. Required columns: FirstName, Phone, Notes' });
    }

    // Distribute items among first 5 agents
    const agents = await Agent.find();
    if (agents.length < 5) return res.status(400).json({ message: 'At least 5 agents are required to distribute lists' });
    const agentCount = 5;
    const usedAgents = agents.slice(0, agentCount);
    let distributed = Array.from({ length: agentCount }, () => []);
    items.forEach((item, idx) => {
      distributed[idx % agentCount].push(item);
    });
    // Save to DB
    for (let i = 0; i < agentCount; i++) {
      for (const item of distributed[i]) {
        await ListItem.create({
          firstName: item.firstname,
          phone: item.phone,
          notes: item.notes,
          agentId: usedAgents[i]._id
        });
      }
    }
    res.json({ message: 'List distributed and saved' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

exports.getAgentLists = async (req, res) => {
  try {
    const agentId = req.params.agentId;
    const items = await ListItem.find({ agentId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
