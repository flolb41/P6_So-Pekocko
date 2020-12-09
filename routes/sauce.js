/**
 * Importations d'Express et de nos controllers et middleware
 * Ici nous créons chaque route pour nos sauces chaque requête 
 * venant du frontend passe par l'une de ces routes
 * on voit que tout de suite après le chemin on passe dans 'auth'
 * ici l'ordre est important
 */
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sauceCtrl = require('../controllers/sauce');

router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likestatus);

module.exports = router;