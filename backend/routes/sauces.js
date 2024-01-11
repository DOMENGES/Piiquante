const express = require('express');
// import du middleware qui vérifie et transmet les infos du token
// Avant le gestionnaire de routes
const auth = require('../middleware/auth');
const router = express.Router();
// ajout middleware multer à la route à partir du répertoire middleware
const multer = require('../middleware/multer-config');

const Thing = require('../models/Thing');

const sauceCtrl = require('../controllers/sauces');

// ajout de auth avant le gestionnaire de route
// toutes les routes doivent être authentifiées
router.get('/', auth, sauceCtrl.getAllThing);
// ajout multer Après authentification(token etc.)
// Format multer de la req est changé c'est du JSON mais en chaîne de caractères
router.post('/', auth, multer, sauceCtrl.createThing);
router.get('/:id', auth, sauceCtrl.getOneThing);
router.put('/:id', auth, multer, sauceCtrl.modifyThing);
router.delete('/:id', auth, sauceCtrl.deleteThing);

module.exports = router;