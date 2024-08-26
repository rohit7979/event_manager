import React, { useState } from "react";
import Navbar from "../components/Navbar";
import EventList from "../components/EventList";

export const CreateEvent = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [startingDate, setStartingDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [maxPeoples, setMaxPeoples] = useState("");
  const [token, setToken] = useState(localStorage.getItem("access_token") || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCreateEvent = (e) => {
    e.preventDefault();

    if (!title || !location || !startingDate || !endDate || !maxPeoples) {
      setError("All fields are required.");
      return;
    }

    fetch("http://localhost:8080/events/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, location, startingdate: startingDate, enddate: endDate, maxpeoples: maxPeoples }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => Promise.reject(data));
        }
        return response.json();
      })
      .then((data) => {
        setSuccess(data.message);
        setTitle("");
        setLocation("");
        setStartingDate("");
        setEndDate("");
        setMaxPeoples("");
        setError("");
      })
      .catch((err) => setError(err.message || "Failed to create event."));
  };

  const handleDeleteEvent = () => {
    // This function can be used if needed to refresh event list or handle specific actions
  };

  return (
    <div>
      <Navbar />
      <h1>Create Event</h1>

      <form style={{ display: "flex", flexDirection: "column", gap: "10px" }} onSubmit={handleCreateEvent}>
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="date"
          placeholder="Starting Date"
          value={startingDate}
          onChange={(e) => setStartingDate(e.target.value)}
        />
        <input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max People"
          value={maxPeoples}
          onChange={(e) => setMaxPeoples(e.target.value)}
        />
        <button type="submit">Create Event</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      {/* Render the EventList component with handleDeleteEvent callback */}
      <EventList onDeleteEvent={handleDeleteEvent} />
    </div>
  );
};

export default CreateEvent;
