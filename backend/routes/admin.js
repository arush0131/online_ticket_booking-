const express = require('express');
const router = express.Router();
const {
  addTransport,
  updateTransport,
  deleteTransport,
  getAllTransports,
  getAllBookings,
  getUserBookings,
  getAllUsers,
  updateUserRole
} = require('../controllers/adminController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Protected admin routes
router.use(auth);
router.use(adminAuth);

// Transport Management Routes
router.post('/transport', addTransport);
router.put('/transport/:id', updateTransport);
router.delete('/transport/:id', deleteTransport);
router.get('/transport', getAllTransports);

// Booking Management Routes
router.get('/bookings', getAllBookings);
router.get('/bookings/user/:userId', getUserBookings);

// User Management Routes
router.get('/users', getAllUsers);
router.put('/users/:userId/role', updateUserRole);

module.exports = router; 