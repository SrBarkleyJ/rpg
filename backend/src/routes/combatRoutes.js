const express = require('express');
const {
    startAutoCombat,
    initiateCombat,
    performAction,
    rest,
    getEnemies,
    getDungeons,
    getActiveDungeonSession,
    startDungeon,
    continueDungeon
} = require('../controllers/combat');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

// Existing routes
router.post('/auto', protect, startAutoCombat);
router.post('/initiate', protect, initiateCombat);
router.post('/action', protect, performAction);
router.post('/rest', protect, rest);

// New routes for enemy selection and dungeons
router.get('/enemies', protect, getEnemies);
router.get('/dungeons', protect, getDungeons);
router.get('/dungeon/session/:dungeonId', protect, getActiveDungeonSession);
router.post('/dungeon/start', protect, startDungeon);
router.post('/dungeon/continue', protect, continueDungeon);

module.exports = router;
