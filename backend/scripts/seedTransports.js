const mongoose = require('mongoose');
const Transport = require('../models/Transport');

const transports = [
    {
        name: 'Delhi to Mumbai Express',
        type: 'train',
        from: 'Delhi',
        to: 'Mumbai',
        price: 1500,
        availableSeats: 45,
        departureTime: new Date('2024-03-20T08:00:00Z'),
        arrivalTime: new Date('2024-03-20T20:00:00Z')
    },
    {
        name: 'Delhi to Jaipur Bus',
        type: 'bus',
        from: 'Delhi',
        to: 'Jaipur',
        price: 800,
        availableSeats: 25,
        departureTime: new Date('2024-03-21T07:00:00Z'),
        arrivalTime: new Date('2024-03-21T12:00:00Z')
    },
    {
        name: 'Delhi to Bangalore Flight',
        type: 'flight',
        from: 'Delhi',
        to: 'Bangalore',
        price: 4500,
        availableSeats: 100,
        departureTime: new Date('2024-03-22T10:00:00Z'),
        arrivalTime: new Date('2024-03-22T12:30:00Z')
    }
];

const seedTransports = async () => {
    try {
        const mongoURI = 'mongodb://127.0.0.1:27017/ticket-booking';
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');

        // Clear existing transports
        await Transport.deleteMany({});
        console.log('Cleared existing transports');

        // Insert new transports
        const result = await Transport.insertMany(transports);
        console.log('Added sample transports:', result);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding transports:', error);
        process.exit(1);
    }
};

seedTransports(); 