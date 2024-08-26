import React, { useEffect, useState } from 'react';

const EventList = ({ onDeleteEvent }) => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/events/list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
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
  }, []);

  const handleDeleteEvent = (id) => {
    fetch(`http://localhost:8080/events/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => Promise.reject(data));
        }
        return response.json();
      })
      .then((data) => {
        setEvents(events.filter(event => event._id !== id));
        onDeleteEvent(); // Callback to inform parent of the change
      })
      .catch((err) => setError(err.message || "Failed to delete event."));
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {events.length > 0 ? (
        events.map((event) => (
          <div key={event._id} style={{ display: "flex", flexDirection: "column", marginTop: "20px" }}>
            <div><strong>Title:</strong> {event.title}</div>
            <div><strong>Location:</strong> {event.location}</div>
            <div><strong>Starting Date:</strong> {new Date(event.startingdate).toLocaleDateString()}</div>
            <div><strong>End Date:</strong> {new Date(event.enddate).toLocaleDateString()}</div>
            <div><strong>Max People:</strong> {event.maxpeoples}</div>
            <button onClick={() => handleDeleteEvent(event._id)}>Delete</button> {/* Delete button */}
          </div>
        ))
      ) : (
        <div>No events found</div>
      )}
    </div>
  );
};

export default EventList;
