const express = require('express');
const { body, validationResult } = require('express-validator');
const Event = require('../models/eventModel');
const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const nodeCron = require('node-cron');
const io = require('socket.io')();
const role  = require('../middlewares/role');
const winston = require('winston');
const morgan = require('morgan');

const eventRouter = express.Router();

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

eventRouter.use(morgan('combined'));

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

eventRouter.get('/list', role(['admin', 'organizer', 'user']), async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        const query = user.role === 'user' ? { creator: user.email } : {};
        const events = await Event.find(query);

        res.status(200).json(events);

        io.emit('eventListUpdated', events);
    } catch (err) {
        logger.error('Error fetching events', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Create an event
eventRouter.post(
    '/create',
    role(['organizer', 'admin','user']),
    [
        body('title').notEmpty().withMessage('Title is required'),
        body('location').notEmpty().withMessage('Location is required'),
        body('startingdate').isISO8601().withMessage('Starting date must be a valid date'),
        body('enddate').isISO8601().withMessage('End date must be a valid date'),
        body('maxpeoples').isInt({ min: 1 }).withMessage('Max people must be a positive integer')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, location, startingdate, enddate, maxpeoples } = req.body;

        try {
            const newEvent = new Event({
                creator: req.user.email,
                title,
                location,
                startingdate,
                enddate,
                maxpeoples,
            });
            await newEvent.save();

            res.status(201).json({ message: 'Event created successfully' });

            io.emit('newEventCreated', newEvent);

            nodeCron.schedule(`0 0 ${new Date(startingdate).getDate() - 1} ${new Date(startingdate).getMonth()} *`, async () => {
                await sendEmail({
                    to: req.user.email,
                    subject: 'Event Reminder',
                    text: `Your event "${title}" is happening soon!`,
                });
            });

        } catch (err) {
            logger.error('Error creating event', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
);

// Update an event
eventRouter.put(
    '/update/:id',
    role(['organizer', 'admin']),
    [
        body('title').optional(),
        body('location').optional(),
        body('startingdate').optional().isISO8601(),
        body('enddate').optional().isISO8601(),
        body('maxpeoples').optional().isInt({ min: 1 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const event = await Event.findById(req.params.id);
            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }

            if (event.creator !== req.user.email && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'You are not authorized to update this event' });
            }

            Object.assign(event, req.body);
            await event.save();

            res.status(200).json({ message: 'Event updated successfully' });

            // Emit real-time updates
            io.emit('eventUpdated', event);
        } catch (err) {
            logger.error('Error updating event', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
);

// Delete an event
eventRouter.delete('/delete/:id', role(['admin','user','organizer']), async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ message: 'Event deleted successfully' });

        io.emit('eventDeleted', event);
    } catch (err) {
        logger.error('Error deleting event', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

async function sendEmail({ to, subject, text }) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your-email@gmail.com',
                pass: 'your-email-password',
            },
        });

        await transporter.sendMail({
            from: '"Event Management" <no-reply@eventmanagement.com>',
            to,
            subject,
            text,
        });

        logger.info(`Email sent to ${to}`);
    } catch (err) {
        logger.error('Error sending email', err);
    }
}

module.exports = eventRouter;
