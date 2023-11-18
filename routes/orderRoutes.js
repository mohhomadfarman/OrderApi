const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/drycleaning-orders', orderController.createDryCleaningOrder);
router.get('/get', orderController.getAllOrders);
router.post('/update-click/:orderId', orderController.updateOrderClick);
router.post('/orderDetails/:orderId', orderController.OrderDetails);
module.exports = router;
