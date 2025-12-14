const express = require('express');
const { listRewards, createReward, buyReward } = require('../controllers/rewardController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Rutas específicas de REWARDS (tienda de objetos)
router.get('/', listRewards);
router.post('/', auth, createReward); // Admin only in future
router.post('/buy', auth, buyReward);

module.exports = router;
