const mongoose = require('mongoose');

const startupSaleSchema = new mongoose.Schema({
    startupName: { type: String, required: true },
    founderName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    description: { type: String, required: true },
    incorporationYear: { type: Number, required: true },
    location: { type: String, required: true },
    legallyRegistered: { type: String, enum: ['Yes', 'No'], required: true },
    registrationCertificate: { type: String }, // file path or URL
    monthlyRevenue: { type: Number, required: true },
    monthlyProfit: { type: Number, required: true },
    askingPrice: { type: Number, required: true },
    included: [{ type: String }], // array of included items
    website: { type: String },
    mediaFiles: [{ type: String }], // file paths or URLs
    pitchDeck: { type: String }, // file path or URL
    teamInfo: { type: String },
    reasonForSelling: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StartupSale', startupSaleSchema);