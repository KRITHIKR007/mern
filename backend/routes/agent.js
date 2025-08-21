const express = require('express');
const router = express.Router();
const { addAgent, getAgents, deleteAgent, updateAgent } = require('../controllers/agentController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, addAgent);
router.get('/', auth, getAgents);
router.delete('/:id', auth, deleteAgent);
router.put('/:id', auth, updateAgent);

module.exports = router;
