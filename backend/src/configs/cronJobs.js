const cron = require("node-cron");
const transporter = require("./nodemailerConfig");
const eventModel = require("../models/eventModel");
const userModel = require("../models/userModel");

const sendReminderEmails = async () => {
  try {
    const now = new Date();
    const reminderDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); 

    const events = await eventModel.find({
      startingdate: { $gte: now, $lte: reminderDate }
    });

    for (const event of events) {
      const organizer = await userModel.findOne({ email: event.creator });
      if (organizer) {
        const mailOptions = {
          from: "no-reply@yourdomain.com",
          to: organizer.email,
          subject: `Reminder: Your event "${event.title}" is starting soon!`,
          text: `Hi ${organizer.name},\n\nJust a reminder that your event "${
            event.title
          }" is starting in less than 24 hours.\n\nDetails:\nLocation: ${event.location}\nStart Date: ${
            event.startingdate
          }\n\nBest regards,\nYour Event Management Team`
        };

        await transporter.sendMail(mailOptions);
      }
    }

    console.log("Reminder emails sent successfully.");
  } catch (error) {
    console.error("Error sending reminder emails:", error);
  }
};

const sendFeedbackEmails = async () => {
  try {
    const now = new Date();
    const feedbackDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

    const events = await eventModel.find({
      enddate: { $gte: feedbackDate, $lte: now }
    });

    for (const event of events) {
      for (const attendeeEmail of event.attendees || []) {
        const attendee = await userModel.findOne({ email: attendeeEmail });
        if (attendee) {
          const mailOptions = {
            from: "no-reply@yourdomain.com",
            to: attendee.email,
            subject: `Feedback Request: Share your experience of "${event.title}"`,
            text: `Hi ${attendee.name},\n\nWe hope you enjoyed the event "${event.title}" held on ${
              event.enddate
            }. We would appreciate it if you could take a moment to provide your feedback.\n\n[Feedback Form Link]\n\nThank you for your participation!\n\nBest regards,\nYour Event Management Team`
          };

          await transporter.sendMail(mailOptions);
        }
      }
    }

    console.log("Feedback emails sent successfully.");
  } catch (error) {
    console.error("Error sending feedback emails:", error);
  }
};

cron.schedule("0 0 * * *", async () => {
  await sendReminderEmails();
  await sendFeedbackEmails();
});

module.exports = { sendReminderEmails, sendFeedbackEmails };
