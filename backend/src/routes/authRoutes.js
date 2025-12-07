const express = require('express');
const { register, login, updatePushToken } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/push-token', updatePushToken);

module.exports = router;