const { Router } = require("express");
const eventModel = require("../models/eventModel");
const userModel = require("../models/userModel");
const role = require("../middlewares/role");
const { body, validationResult } = require('express-validator');

const eventRouter = Router();

// List events with pagination, sorting, and role-based access
eventRouter.get("/list", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sort = parseInt(req.query.sort) || 1; // 1 for ascending, -1 for descending
    const query = {};

    if (req.query.title) {
        query.title = req.query.title;
    }

    try {
        const user = await userModel.findOne({ email: req.user.email });
        let events;

        if (user.role === 'admin' || user.role === 'organizer') {
            // Admin and Organizer can see all events
            events = await eventModel.find(query).skip(skip).limit(limit).sort({ startingdate: sort }).populate("creator");
        } else if (user.role === 'user') {
            // Users can only see their own created events
            events = await eventModel.find({ ...query, creator: user.email }).skip(skip).limit(limit).sort({ startingdate: sort }).populate("creator");
        } else {
            return res.status(403).json({ message: "You are not authorized to view this list" });
        }

        res.status(200).json(events);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: "Internal server error" });
    }
});

// Create an event (Organizer only)
eventRouter.post(
    "/create",
    role(['organizer', 'admin']),
    [
        body('title').isString().notEmpty().withMessage('Title is required'),
        body('location').isString().notEmpty().withMessage('Location is required'),
        body('startingdate').isISO8601().withMessage('Starting date must be a valid date'),
        body('enddate').isISO8601().withMessage('End date must be a valid date'),
        body('maxpeoples').isInt({ min: 1 }).withMessage('Max peoples must be a positive integer'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, location, startingdate, enddate, maxpeoples } = req.body;
        const creator = req.user.email;

        try {
            const event = new eventModel({
                creator,
                title,
                location,
                startingdate,
                enddate,
                maxpeoples
            });

            await event.save();
            res.status(201).json({ message: "Event created successfully" });
        } catch (err) {
            console.error(err); // Log the error for debugging
            res.status(500).json({ message: "Internal server error" });
        }
    }
);

// Update an event (Organizer or Admin)
eventRouter.put(
    "/update/:id",
    role(['organizer', 'admin']),
    [
        body('title').optional().isString(),
        body('location').optional().isString(),
        body('startingdate').optional().isISO8601(),
        body('enddate').optional().isISO8601(),
        body('maxpeoples').optional().isInt({ min: 1 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { title, location, startingdate, enddate, maxpeoples } = req.body;
        const user_email = req.user.email;

        try {
            const event = await eventModel.findById(id);

            if (!event) {
                return res.status(404).json({ message: "Event not found" });
            }

            if (event.creator !== user_email && req.user.role !== 'admin') {
                return res.status(403).json({ message: "You are not authorized to update this event" });
            }

            if (title) event.title = title;
            if (location) event.location = location;
            if (startingdate) event.startingdate = startingdate;
            if (enddate) event.enddate = enddate;
            if (maxpeoples) event.maxpeoples = maxpeoples;

            await event.save();
            res.status(200).json({ message: "Event updated successfully" });
        } catch (err) {
            console.error(err); // Log the error for debugging
            res.status(500).json({ message: "Internal server error" });
        }
    }
);

// Delete an event (Admin only)
eventRouter.delete("/delete/:id", role(['admin']), async (req, res) => {
    const { id } = req.params;

    try {
        const event = await eventModel.findByIdAndDelete(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = eventRouter;
