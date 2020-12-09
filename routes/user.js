/**
 * Importations et création des routes user
 * Ici nous avons les deux routes qui vervent 
 * à crééer un User et à identifier un User
 */
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;