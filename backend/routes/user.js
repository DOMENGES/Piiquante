const express = require('express');
const router = express.Router();
// contrôleur pour associer les fonctions aux différentes routes
const userCtrl = require('../controllers/user');

// routes pour que l'utilisateur envoie son mail et mdp
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;