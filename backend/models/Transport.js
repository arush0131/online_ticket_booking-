const mongoose = require('mongoose');

const transportSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['bus', 'train', 'flight']
    },
    from: {
        type: String,
        required: true,
        trim: true
    },
    to: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    availableSeats: {
        type: Number,
        required: true,
        min: 0
    },
    departureTime: {
        type: Date,
        required: false
    },
    arrivalTime: {
        type: Date,
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Transport', transportSchema); 