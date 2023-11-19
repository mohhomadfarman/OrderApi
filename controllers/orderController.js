const EnqueryOrders = require("../modals/Enquery");
const Order = require("../modals/Order");
const rateCard = require("../rate");
var easyinvoice = require('easyinvoice');
var fs = require('fs');

// enquiries
exports.getEnquiries = async (req, res) => {
  try {
    const orders = await EnqueryOrders.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.EnqueryOrders = async (req, res) => {
  const { customerName, mobileNumber,  pickupDate, deliveryDate, address } = req.body;

  try {
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



      const order = await EnqueryOrders.create({
          customerName,
          mobileNumber,
          pickupDate: pickupDateTime,
          deliveryDate: deliveryDateTime,
          address,
      });

      res.status(201).json(order);

      // Emit a notification when a new order is placed
      const io = req.app.get('io');
      io.emit('newEnqueryOrders', {
        data:order,
          customerName,
          pickupDate: pickupDateTime,
          deliveryDate: deliveryDateTime,
      });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

exports.enqueryClick = async (req, res) => {
  const { orderId } = req.params;
  const { click } = req.body;

  try {
    const orderCheck = await EnqueryOrders.findOne({_id:orderId});
    if(orderCheck._id === orderId){
      res.json({status:"Open"})
    }else{
      const order = await EnqueryOrders.findByIdAndUpdate(orderId, { click }, { new: true });
      res.json(order);
    }

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Crdeate Order
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

      var data = {
        "client": {
          "company": "Client Corp",
          "address": "Clientstreet 456",
          "zip": "4567 CD",
          "city": "Clientcity",
          "country": "Clientcountry"
      },
      "sender": {
        "company": "Sample Corp",
        "address": "Sample Street 123",
        "zip": "1234 AB",
        "city": "Sampletown",
        "country": "Samplecountry"
    },
    "images": {
      logo: "https://public.easyinvoice.cloud/img/logo_en_original.png",
    },
    "information": {
      // Invoice number
      "number": "2021.0001",
      // Invoice data
      "date": "12-12-2021",
      // Invoice due date
      "due-date": "31-12-2021"
  },
  "products": [
    {
        "quantity": "2",
        "description": "Test1",
        "tax-rate": 6,
        "price": 33.87
    },
    {
        "quantity": "4",
        "description": "Test2",
        "tax-rate": 21,
        "price": 10.45
    }
],
"bottomNotice": "Kindly pay your invoice within 15 days.",
"settings": {
  "currency": "USD",
}
      };
      easyinvoice.createInvoice(data, function (result) {
        fs.writeFileSync(`./Invoice/${order._id}_invoice.pdf`, result.pdf, 'base64');
     });
    

      res.status(201).json({order:order,invoice:`${order._id}_invoice.pdf`});

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
    const orderCheck = await Order.findOne({_id:orderId});
    if(orderCheck._id === orderId){
      res.json({status:"Open"})
    }else{
      const order = await Order.findByIdAndUpdate(orderId, { click }, { new: true });
      res.json(order);
    }

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
