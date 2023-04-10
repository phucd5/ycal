import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

const FriendsCalandar = ({ friendId }) => {
  const [events, setEvents] = useState([]);
  const [friend, setFriend] = useState([]);

  const fetchFriend = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3002/users/${friendId}`
      );
      setFriend(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3002/users/${friendId}/events`
      );
      setEvents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchFriend();
  }, [friendId]);

  if (events.length === 0) {
    return  (
      <div>
        <h2>{friend.firstName}'s Events</h2>
        <p>No events to display for this friend</p>
      </div>
    )
  }

  return (
    <div>
      <h2>{friend.firstName}'s Events</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Location</th>
            <th>Yale Location</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event._id}>
              <td>{event.name}</td>
              <td>{event.description}</td>
              <td>{event.start_date}</td>
              <td>{event.end_date}</td>
              <td>{event.location}</td>
              <td>{event.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FriendsCalandar;
