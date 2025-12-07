const express = require('express');
const router = express.Router();
const { getForgeableItems, forgeItem } = require('../controllers/forgeController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', getForgeableItems);
router.post('/upgrade', forgeItem);

module.exports = router;
