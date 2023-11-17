const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = 3000;

app.use(express.json());

mongoose.connect('mongodb+srv://mohhomadfarman:2psfCQztmQjcWWjB@webforum.fgkdlah.mongodb.net/Drycleaning', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Attach Socket.IO to the server
app.set('io', io);

app.use('/api', orderRoutes);

// Socket.IO connection event
io.on('connection', (socket) => {
  console.log('A user connected');
  // You can handle additional events here if needed

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


// app.post('/api/drycleaning-orders', async (req, res) => {
//   const { customerName, mobileNumber, articles,totalPrice } = req.body;
  
//     try {
//     //   // Check if articles is an array
//     //   if (!Array.isArray(articles)) {
//     //     throw new Error('Invalid format for articles. Expecting an array.');
//     //   }
      
  
//     //   // Calculate the total price based on the rate card
//     //   const totalPrice = articles.reduce((total, article) => {
//     //     const rate = rateCard[article.articleName] || 0;
  
//     //     // If the rate is a range, handle it appropriately
//     //     const amount = Array.isArray(rate) ? article.amount : 1;
  
//     //     return total + rate * amount;
//     //   }, 0);
  
//       // Create a new order
//       const order = await Order.create({
//         customerName,
//         mobileNumber,
//         articles:[{articleName:articles,amount:"200"}],
//         totalPrice,
//         status: 'Pending', // You might want to set an initial status
//       });
  
//       // Emit a notification when a new order is placed
//       const io = req.app.get('io');
//       io.emit('newDryCleaningOrder', { customerName, totalPrice });
  
//       // Send the order details as a response
//       res.status(201).json(order);
//     } catch (error) {
//       // Handle errors and send a meaningful response
//       res.status(400).json({ error: error.message });
//     }

// })

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
