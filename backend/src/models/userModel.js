const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "admin", "organizer"],
    default: "user",
  },
  status: {
    type: String,
    enum: ["active", "disabled"],
    default: "active",
  },
  // Optional: Add a field to track registered events if needed
  // registeredEvents: [{ type: Schema.Types.ObjectId, ref: 'events' }]
});

const userModel = model("users", userSchema);

module.exports = userModel;
