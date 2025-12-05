const express = require('express');
const { getSkills, upgradeSkill } = require('../controllers/skillController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', auth, getSkills);
router.post('/upgrade', auth, upgradeSkill);

module.exports = router;
