// import React, { useEffect, useState } from "react";

// export const EventList = () => {
//   const [events, setEvents] = useState([]);
//   const [token, setToken] = useState("");
//   const [role, setRole] = useState("");

//   useEffect(() => {
//     const token = localStorage.getItem("access_token");
//     const role = localStorage.getItem("user_role");
//     setToken(token);
//     setRole(role);

//     const fetchEvents = async () => {
//       try {
//         const response = await fetch("http://localhost:8080/events/list", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           if (role === "user") {
//             // Optionally, filter events if needed
//             // Example: Filter events based on some criteria
//           }
//           setEvents(data);
//         } else {
//           console.error("Failed to fetch events");
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchEvents();
//   }, [token, role]);

//   return (
//     <div>
//       <h1>Event List</h1>
//       {events.length > 0 ? (
//         events.map((event) => (
//           <div key={event._id} style={{ margin: "10px" }}>
//             <h2>{event.title}</h2>
//             <p>Location: {event.location}</p>
//             <p>Start: {event.startingdate}</p>
//             <p>End: {event.enddate}</p>
//             <p>Max People: {event.maxpeoples}</p>
//             {/* Add functionality based on role if needed */}
//           </div>
//         ))
//       ) : (
//         <div>No events found</div>
//       )}
//     </div>
//   );
// };
