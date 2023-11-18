const Order = require("../modals/Order");
const rateCard = require("../rate");

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.createDryCleaningOrder = async (req, res) => {
  const { customerName, mobileNumber, articles, pickupDate, deliveryDate, address } = req.body;

  try {
      // Check if articles is an array
      if (!Array.isArray(articles)) {
          throw new Error('Invalid format for articles. Expecting an array.');
      }

      // Check if pickupDate and deliveryDate are provided
      if (!pickupDate || !deliveryDate) {
          throw new Error('Both pickupDate and deliveryDate are required.');
      }

      // Validate pickupDate and deliveryDate
      const pickupDateTime = new Date(pickupDate);
      const deliveryDateTime = new Date(deliveryDate);

      if (pickupDateTime >= deliveryDateTime) {
          throw new Error('Invalid date range. Pickup date must be before delivery date.');
      }

      // Calculate the total price based on the rate card
      const totalPrice = articles.reduce((total, article) => {
          const rate = rateCard[article.articleName] || 0;
          return total + rate * article.amount;
      }, 0);

      const order = await Order.create({
          customerName,
          mobileNumber,
          articles,
          totalPrice,
          pickupDate: pickupDateTime,
          deliveryDate: deliveryDateTime,
          address,
      });

      res.status(201).json(order);

      // Emit a notification when a new order is placed
      const io = req.app.get('io');
      io.emit('newDryCleaningOrder', {
        data:order,
          customerName,
          totalPrice,
          pickupDate: pickupDateTime,
          deliveryDate: deliveryDateTime,
      });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

exports.OrderDetails = async (req,res) =>{
  const { orderId } = req.params;
  try {
    const orders = await Order.findById(orderId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.updateOrderClick = async (req, res) => {
  const { orderId } = req.params;
  const { click } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(orderId, { click }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findByIdAndRemove(orderId);
    res.json({ message: 'Order canceled successfully', order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
