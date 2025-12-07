const express = require('express');
const { getStats, assignSkillPoint } = require('../controllers/statsController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', auth, getStats);
router.post('/assign', auth, assignSkillPoint);

module.exports = router;
