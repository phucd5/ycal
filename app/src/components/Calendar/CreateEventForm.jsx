import axios from "axios";
import React, { useState } from "react";
import "./Calendar.css";

const CreateEventForm = ({ user, setEvents, friends }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [locationMarker, setLocationMarker] = useState("None");
  const [attendees, setAttendees] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3002/events/create", {
        organizer: user,
        title,
        description,
        start: startDate,
        end: endDate,
        location,
        userId: user._id,
        location_marker: locationMarker,
        attendees,
      });
      try {
        const response_2 = await axios.put(
          `http://localhost:3002/users/${user._id}/events`,
          {
            eventId: response.data._id,
            action: "add",
          }
        );
        setEvents((prevEvents) => {
          const updatedEvents = [...prevEvents, response.data];
          updatedEvents.sort((a, b) => {
            const startDateDiff =
              new Date(a.start_date) - new Date(b.start_date);
            if (startDateDiff !== 0) {
              return startDateDiff;
            } else {
              return new Date(a.end_date) - new Date(b.end_date);
            }
          });
          console.log("Updated");
          console.log(updatedEvents);
          return updatedEvents;
        });
        setTitle("");
        setDescription("");
        setStartDate("");
        setEndDate("");
        setLocation("");
        setAttendees([]);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a New Event:</h2>
      <div>
        <label>Name:</label>
        <input
          type="text"
          id="name"
          value={title}
          className="input-box"
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <br />
      <div>
        <label>Description:</label>
        <input
          type="text"
          value={description}
          className="input-box"
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <br />
      <div>
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          className="input-box"
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>
      <br />
      <div>
        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          className="input-box"
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>
      <br />

      <div>
        <label>Location:</label>
        <input
          type="text"
          value={location}
          className="input-box"
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>

      <br />
      <div>
        <label>Yale Location:</label>
        <br />
        <select
          value={locationMarker}
          onChange={(e) => setLocationMarker(e.target.value)}
        >
          <option value="">Select a Yale location</option>
          <option value="PWG">PWG</option>
          <option value="Silliman Buttery">Silliman Buttery</option>
          <option value="Bass Library">Bass Library</option>
        </select>
      </div>

      <div>
        <label>Attendees:</label>
        <br />
        <select
          multiple
          value={attendees}
          onChange={(e) =>
            setAttendees(
              Array.from(e.target.selectedOptions, (option) => option.value)
            )
          }
        >
          {friends.map((friend) => (
            <option key={friend._id} value={friend._id}>
              {friend.firstName} {friend.lastName}
            </option>
          ))}
        </select>
      </div>

      <br />
      <br />

      <button type="submit">Create Event</button>
    </form>
  );
};

export default CreateEventForm;
