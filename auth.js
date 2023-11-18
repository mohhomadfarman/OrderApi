// auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./modals/user');
const authenticateToken = require('./midelwareToken');



// Register
router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      role:req.body.role ? req.body.role : "user",
      email: req.body.email,
      phone: req.body.phone,
      interest: req.body.interest,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      socialMedia: req.body.socialMedia,
      education: req.body.education,
      profession: req.body.profession,
    });
    await user.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// Login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).send('User not found');
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).send('Invalid password');
    }
    const token = jwt.sign({ id: user._id, role: user.role }, 'hgsj#4&*#$9ejjen');
    res.json({ token });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/users', authenticateToken, async (req, res) => {
  try {
    const user = await User.find();
    if (!user) {
      return res.status(404).send('Users not found');
    }else{
      res.send(user);
    }
   
  } catch (error) {
    res.status(500).send(error.message);
  }
});






router.put('/user/settings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user settings based on the request body, adjust as needed
    if (req.body.email) {
      user.email = req.body.email;
    }
    if (req.body.phone) {
      user.phone = req.body.phone;
    }
    // Add other fields to update here

    await user.save();

    res.status(200).json({ message: 'User settings updated successfully' });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
