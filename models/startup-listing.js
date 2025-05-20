// models/Startup.js

const mongoose = require('mongoose');

const StartupSchema = new mongoose.Schema({
    startupName: { type: String, required: true },
    founderName: { type: String },
    email: { type: String },
    phone: { type: String },
    website: { type: String },
    industry: { type: String },
    location: { type: String },
    fundingStage: {
        type: String,
        enum: ['Pre-Seed', 'Seed', 'Angel', 'Series A', 'Series B', 'Series C', 'Bootstrapped']
    },
    monthlyRevenue: { type: Number },
    profitability: {
        type: String,
        enum: ['Profitable', 'Breakeven', 'Not yet profitable', 'Early-stage burn']
    },
    askingPrice: { type: Number },
    reasonForSale: { type: String },
    description: { type: String },
    listedOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Startup', StartupSchema);
