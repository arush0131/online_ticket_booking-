const { readData, writeData } = require('../utils/fileUtils');
const Ticket = require('../models/Ticket');
const Route = require('../models/Route');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Transport = require('../models/Transport');
const mongoose = require('mongoose');

// Transport Management
const addTransport = async (req, res) => {
    try {
        const transport = new Transport(req.body);
        await transport.save();
        res.status(201).json(transport);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateTransport = async (req, res) => {
    try {
        const transport = await Transport.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!transport) {
            return res.status(404).json({ message: 'Transport not found' });
        }
        res.json(transport);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteTransport = async (req, res) => {
    try {
        console.log('Attempting to delete transport with ID:', req.params.id);
        
        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            console.error('Invalid transport ID format:', req.params.id);
            return res.status(400).json({ message: 'Invalid transport ID format' });
        }

        const transport = await Transport.findById(req.params.id);
        
        if (!transport) {
            console.error('Transport not found with ID:', req.params.id);
            return res.status(404).json({ message: 'Transport not found' });
        }

        // Check if there are any bookings for this transport
        const bookings = await Booking.find({ transport: req.params.id });
        if (bookings.length > 0) {
            console.error('Cannot delete transport with existing bookings:', bookings.length);
            return res.status(400).json({ 
                message: 'Cannot delete transport with existing bookings',
                bookingCount: bookings.length
            });
        }

        await transport.deleteOne();
        console.log('Transport deleted successfully:', req.params.id);
        res.json({ message: 'Transport deleted successfully' });
    } catch (error) {
        console.error('Error deleting transport:', error);
        res.status(500).json({ 
            message: 'Error deleting transport',
            error: error.message 
        });
    }
};

const getAllTransports = async (req, res) => {
    try {
        const transports = await Transport.find();
        res.json(transports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Booking Management
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'username email')
            .populate('transport', 'name type from to price');
        
        const formattedBookings = bookings.map(booking => ({
            id: booking._id,
            user: {
                id: booking.user._id,
                username: booking.user.username,
                email: booking.user.email
            },
            transport: {
                id: booking.transport._id,
                name: booking.transport.name,
                type: booking.transport.type,
                from: booking.transport.from,
                to: booking.transport.to,
                price: booking.transport.price
            },
            numberOfTickets: booking.numberOfTickets,
            totalAmount: booking.totalAmount,
            status: booking.status,
            bookingDate: booking.bookingDate
        }));

        res.json(formattedBookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.params.userId })
            .populate('transport', 'name type from to price');
        
        const formattedBookings = bookings.map(booking => ({
            id: booking._id,
            transport: {
                id: booking.transport._id,
                name: booking.transport.name,
                type: booking.transport.type,
                from: booking.transport.from,
                to: booking.transport.to,
                price: booking.transport.price
            },
            numberOfTickets: booking.numberOfTickets,
            totalAmount: booking.totalAmount,
            status: booking.status,
            bookingDate: booking.bookingDate
        }));

        res.json(formattedBookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Ticket Management
exports.addTicket = async (req, res) => {
    try {
        const ticket = new Ticket(req.body);
        await ticket.save();
        res.status(201).json(ticket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json(ticket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndDelete(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Route Management
exports.addRoute = async (req, res) => {
    try {
        const route = new Route(req.body);
        await route.save();
        res.status(201).json(route);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateRoute = async (req, res) => {
    try {
        const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!route) {
            return res.status(404).json({ message: 'Route not found' });
        }
        res.json(route);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteRoute = async (req, res) => {
    try {
        const route = await Route.findByIdAndDelete(req.params.id);
        if (!route) {
            return res.status(404).json({ message: 'Route not found' });
        }
        res.json({ message: 'Route deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllRoutes = async (req, res) => {
    try {
        const routes = await Route.find();
        res.json(routes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// User Management
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    // Transport Management
    addTransport,
    updateTransport,
    deleteTransport,
    getAllTransports,
    
    // Booking Management
    getAllBookings,
    getUserBookings,
    
    // User Management
    getAllUsers,
    updateUserRole
}; 