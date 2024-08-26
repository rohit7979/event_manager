const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const connectToDB = require("./configs/db");
const userRouter = require("./routes/userRoute");
const auth = require("./middlewares/auth");
const eventRouter = require("./routes/eventRoute");
const limiter = require("./middlewares/rateLimit");
const cors = require('cors');
const nodeCron = require('node-cron');  // Import node-cron for scheduling tasks
const { createLogger, transports, format } = require('winston'); // Import Winston for logging

require("dotenv").config();

const app = express();
const server = http.createServer(app);  // Create an HTTP server
const io = socketIo(server);  // Attach Socket.io to the server

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Set up Winston logging
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'combined.log' })
    ]
});

app.get("/", (req, res) => {
    res.send("This is a home route");
});

app.use(limiter);
app.use('/user', userRouter);
app.use('/events', auth, eventRouter);

// Set up cron jobs for automated tasks
nodeCron.schedule('0 0 * * *', () => {
    // Logic to send reminder emails or perform other automated tasks
    console.log('Running scheduled job to send reminder emails...');
});

// Socket.io integration
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle events and emit real-time updates
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server
const port = process.env.PORT || 9090;
const db_url = process.env.DB_URL;

server.listen(port, async () => {
    try {
        await connectToDB(db_url);
        console.log('Successfully connected to the database');
        console.log(`Server is running at http://localhost:${port}`);
    } catch (err) {
        console.error('Error while connecting to the database', err);
    }
});
