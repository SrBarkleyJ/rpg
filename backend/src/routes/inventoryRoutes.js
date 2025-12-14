const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const inventoryController = require('../controllers/inventoryController');
const rewardController = require('../controllers/rewardController');

// Todas las rutas requieren autenticación
router.use(auth);

// Rutas de inventario y equip
router.get('/', inventoryController.getInventory);
router.post('/equip', inventoryController.equipItem);
router.post('/unequip', inventoryController.unequipItem);
router.post('/use', rewardController.useItem);

module.exports = router;