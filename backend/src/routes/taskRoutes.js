const express = require('express');
const { listTasks, createTask, completeTask } = require('../controllers/taskController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', auth, listTasks);
router.post('/', auth, createTask); // admin use maybe later
router.post('/complete', auth, completeTask);

module.exports = router;
