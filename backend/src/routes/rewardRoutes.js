const express = require('express');
const { listRewards, createReward, buyReward, getInventory, equipItem, unequipItem, useItem } = require('../controllers/rewardController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', listRewards);
router.post('/', auth, createReward); // Admin only in future
router.post('/buy', auth, buyReward);
router.get('/inventory', auth, getInventory);
router.post('/equip', auth, equipItem);
router.post('/unequip', auth, unequipItem);
router.post('/use', auth, useItem);

module.exports = router;
