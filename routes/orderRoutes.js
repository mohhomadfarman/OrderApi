const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/drycleaning-orders', orderController.createDryCleaningOrder);
router.get('/get', orderController.getAllOrders);
router.post('/update-click/:orderId', orderController.updateOrderClick);
router.post('/orderDetails/:orderId', orderController.OrderDetails);
router.post('/enquiries', orderController.EnqueryOrders);
router.post('/enquiries-click/:orderId', orderController.enqueryClick);
router.get('/enquiries', orderController.getEnquiries);


module.exports = router;
