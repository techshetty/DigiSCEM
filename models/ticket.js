const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    redeemed: { type: Boolean, default: false },
    item:{type: String, default: "Chicken Biriyani"}
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;