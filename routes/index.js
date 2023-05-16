const express = require('express');
const router = express.Router();
const user = require('../controllers/user');

const middlewares = require('../utils/middlewares');

router.post('/auth/register', user.register);
router.post('/auth/login', user.login);
router.get('/auth/whoami', middlewares.auth, user.whoami);

module.exports = router;