const Transport = require('../models/Transport');

const getTransports = async (req, res) => {
    try {
        const { type } = req.query;
        const query = type ? { type } : {};
        const transports = await Transport.find(query);
        res.json(transports);
    } catch (error) {
        console.error('Error fetching transports:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getTransports
}; 