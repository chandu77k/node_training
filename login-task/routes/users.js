var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var authenticate = require('../middleware/authMiddleware');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', async function (req, res) {
  const { username, password } = req.body;
  console.log('Registration data received:', req.body);

  try {
    await User.create({ username, password });
    res.status(200).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error in registration:', err.message);
    res.status(400).json({ error: 'Registration failed' });
  }
});

router.post('/login', async function(req, res) {
  const { username, password } = req.body;

  try {
    var user = await User.findOne({ where: { username: username } });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    var token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({ token: token });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/dashboard', authenticate, async function (req, res) {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: `Welcome ${user.username}, you are logged in!`
    });
  } catch (err) {
    console.error('Dashboard error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});




module.exports = router;
