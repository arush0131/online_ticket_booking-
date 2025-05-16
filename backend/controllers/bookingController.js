const Booking = require('../models/Booking');
const Transport = require('../models/Transport');
const mongoose = require('mongoose');

const createBooking = async (req, res) => {
    try {
        console.log('Received booking request body:', req.body);
        const { transportId, passengers } = req.body;
        const userId = req.user.id;

        console.log('Creating booking with data:', { transportId, passengers, userId });

        // Validate required fields
        if (!transportId) {
            console.error('Missing transportId in request');
            return res.status(400).json({ message: 'Transport ID is required' });
        }
        if (!passengers || passengers < 1) {
            console.error('Invalid passengers count:', passengers);
            return res.status(400).json({ message: 'Valid number of passengers is required' });
        }

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(transportId)) {
            console.error('Invalid transport ID format:', transportId);
            return res.status(400).json({ message: 'Invalid transport ID format' });
        }

        // Find the transport
        const transport = await Transport.findById(transportId);
        if (!transport) {
            console.error('Transport not found:', transportId);
            return res.status(404).json({ message: 'Transport not found' });
        }

        console.log('Found transport:', {
            id: transport._id,
            name: transport.name,
            availableSeats: transport.availableSeats
        });

        // Check if enough seats are available
        if (transport.availableSeats < passengers) {
            console.error('Not enough seats available:', { 
                available: transport.availableSeats, 
                requested: passengers 
            });
            return res.status(400).json({ message: 'Not enough seats available' });
        }

        // Create new booking
        const booking = new Booking({
            user: userId,
            transport: transportId,
            numberOfTickets: passengers,
            totalAmount: transport.price * passengers,
            status: 'confirmed',
            bookingDate: new Date()
        });

        console.log('Created booking object:', booking);

        // Update transport's available seats
        transport.availableSeats -= passengers;
        await transport.save();

        // Save the booking
        await booking.save();

        console.log('Booking created successfully:', {
            id: booking._id,
            userId: booking.user,
            transportId: booking.transport,
            numberOfTickets: booking.numberOfTickets,
            totalAmount: booking.totalAmount
        });

        res.status(201).json(booking);
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        console.log('Cancelling booking:', { id, userId });

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid booking ID format' });
        }

        // Find the booking
        const booking = await Booking.findOne({ _id: id, user: userId });
        if (!booking) {
            console.error('Booking not found:', id);
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Only allow cancellation of confirmed bookings
        if (booking.status !== 'confirmed') {
            console.error('Cannot cancel booking:', booking.status);
            return res.status(400).json({ message: 'Cannot cancel this booking' });
        }

        // Find the transport and update available seats
        const transport = await Transport.findById(booking.transport);
        if (transport) {
            transport.availableSeats += booking.numberOfTickets;
            await transport.save();
        }

        // Update booking status
        booking.status = 'cancelled';
        await booking.save();

        console.log('Booking cancelled successfully');
        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error('Cancellation error:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
    }
};

const getUserBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('Fetching bookings for user:', userId);
        
        const bookings = await Booking.find({ user: userId })
            .populate('transport', 'name type from to price')
            .sort({ bookingDate: -1 });
        
        console.log('Found bookings:', bookings.length);
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
    }
};

module.exports = {
    createBooking,
    cancelBooking,
    getUserBookings
}; 