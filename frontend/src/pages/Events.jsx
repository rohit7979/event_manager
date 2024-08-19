import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export const CreateEvent = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [startingDate, setStartingDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [maxPeoples, setMaxPeoples] = useState("");
  const [token, setToken] = useState(localStorage.getItem("access_token") || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8080/events/list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setEvents(data))
      .catch((err) => setError("Failed to fetch events."));
  }, [token]);

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
        setEvents([...events, { title, location, startingdate: startingDate, enddate: endDate, maxpeoples: maxPeoples }]);
        setTitle("");
        setLocation("");
        setStartingDate("");
        setEndDate("");
        setMaxPeoples("");
        setError("");
      })
      .catch((err) => setError(err.message || "Failed to create event."));
  };

  return (
    <div>
      <Navbar/>
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

      {events.length > 0 ? (
        events.map((event) => (
          <div key={event._id} style={{ display: "flex", flexDirection: "column", marginTop: "20px" }}>
            <div><strong>Title:</strong> {event.title}</div>
            <div><strong>Location:</strong> {event.location}</div>
            <div><strong>Starting Date:</strong> {new Date(event.startingdate).toLocaleDateString()}</div>
            <div><strong>End Date:</strong> {new Date(event.enddate).toLocaleDateString()}</div>
            <div><strong>Max People:</strong> {event.maxpeoples}</div>
          </div>
        ))
      ) : (
        <div>No events found</div>
      )}
    </div>
  );
};
