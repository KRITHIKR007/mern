const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadList, getAgentLists } = require('../controllers/listController');
const auth = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['.csv', '.xlsx', '.xls'];
    const ext = require('path').extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only csv, xlsx, xls files allowed'));
  }
});

router.post('/upload', auth, upload.single('file'), uploadList);
router.get('/agent/:agentId', auth, getAgentLists);

module.exports = router;
