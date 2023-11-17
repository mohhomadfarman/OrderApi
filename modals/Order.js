const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  articleName: { type: String, required: true },
  amount: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  articles: [articleSchema],
  totalPrice: { type: Number },
  status: { type: String, enum: ['Pending', 'Processing', 'Ready', 'Delivered'], default: 'Pending' },
  pickupDate: { type: Date, required: true },
  deliveryDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
