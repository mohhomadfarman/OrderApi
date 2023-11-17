const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/drycleaning-orders', orderController.createDryCleaningOrder);
router.get('/get', orderController.getAllOrders);

module.exports = router;
