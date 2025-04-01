const express = require("express");
const router = express.Router();
const Station = require("../models/Station");

// Get all stations
router.get("/", async (req, res) => {
    try {
        const stations = await Station.find();
        res.json(stations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Find nearest stations
router.get("/nearest", async (req, res) => {
    try {
        const { latitude, longitude, radius = 5000 } = req.query;
        
        const stations = await Station.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: parseInt(radius)
                }
            }
        });
        
        res.json(stations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new EV station
router.post("/", async (req, res) => {
    try {
        const { name, latitude, longitude, address } = req.body;
        const newStation = new Station({ name, latitude, longitude, address });
        await newStation.save();
        res.status(201).json(newStation);
    } catch (error) {
        res.status(500).json({ message: "Error adding station" });
    }
});

module.exports = router;
