const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  creator: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  startingdate: { type: Date, required: true },
  enddate: { type: Date, required: true },
  maxpeoples: { type: Number, required: true },
});

module.exports = mongoose.model("events", eventSchema);
