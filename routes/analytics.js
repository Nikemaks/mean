const express = require('express');
const router = express.Router();
const controller = require('../controllers/analytics');
const passport = require('passport');

router.get('/overview', passport.authenticate('jwt', {session: false}), controller.overview);
router.post('/analytics', passport.authenticate('jwt', {session: false}), controller.analytics);


module.exports = router;
