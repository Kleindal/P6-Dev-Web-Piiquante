const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
// const multer = require('../middleware/multer-config');

// router.post('/', auth, multer, saucesCtrl.createThing);
// router.put('/:id', auth, saucesCtrl.modifyThing);
// router.delete('/:id', auth, saucesCtrl.deleteThing);
router.get('/', auth, saucesCtrl.getAllSauces);
router.get('/:id', auth, saucesCtrl.getOneSauce);

// module.exports = mongoose.model('NewSauce', saucesSchema);
module.exports = router;
