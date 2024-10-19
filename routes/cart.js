const express = require('express');
const router = express.Router();
const PurchaseController = require('../controllers/PurchaseController');
const { userMiddleware } = require('../middlewares/roles');

// Ruta para finalizar la compra (solo accesible para usuarios autenticados)
router.post('/purchase', userMiddleware, PurchaseController.finalizePurchase);

module.exports = router;
