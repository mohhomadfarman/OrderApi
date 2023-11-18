const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');
const orderRoutes = require('./routes/orderRoutes');
const dotenv = require("dotenv");
const authRoutes = require('./auth');
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = process.env.PORT;

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
app.use('/auth', authRoutes);
app.use('/api/Invoice',express.static('Invoice'));
// Socket.IO connection event
io.on('connection', (socket) => {
  console.log('A user connected');
  // You can handle additional events here if needed

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
