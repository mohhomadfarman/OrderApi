const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
});

const articleSchema = new mongoose.Schema({
  articleName: { type: String, required: true },
  amount: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  address: addressSchema, // Include the address schema
  articles: [articleSchema],
  totalPrice: { type: Number },
  status: { type: String, enum: ['Pending', 'Processing', 'Ready', 'Delivered'], default: 'Pending' },
  click: { type: String, enum: ['New', 'Old'], default: 'New' },
  pickupDate: { type: Date, required: true },
  deliveryDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
