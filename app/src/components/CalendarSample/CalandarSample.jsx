import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import FriendsCalandar from "./FriendsCalandar";
import CreateEventForm from "./CreateEventForm";
import FindFriend from "./FindFriend";

const CalendarSample = () => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [eventCreateData, setEventCreateData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    location: "",
  });

  async function removeFriend() {
    try {
      const response = await axios.put(
        `http://localhost:3002/users/${user._id}/friends`,
        {
          friendId: selectedFriendId,
          action: "remove",
        }
      );
      setFriends(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchEvents() {
    try {
      const response = await axios.get(
        `http://localhost:3002/users/${user._id}/events`
      );
      setEvents(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchFriends() {
    try {
      const response = await axios.get(
        `http://localhost:3002/users/${user._id}/friends`
      );
      setFriends(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const loggedInUser = localStorage.getItem("token");
    setUser(JSON.parse(localStorage.getItem("user")));
    console.log(user);

    if (loggedInUser) {
      console.log(loggedInUser);
      setAuthenticated(true);
    } else {
      alert("Please login!");
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (user && user._id) {
      fetchEvents();
      fetchFriends();
    }
  }, [user]);

  const handleViewFriendCal = (friendId) => {
    setSelectedFriendId(friendId);
  };

  const handleRemoveFriend = (friendId) => {
    setSelectedFriendId(friendId);
    removeFriend();
  };

  const handleDelete = async (eventId) => {
    try {
      const response = await axios.put(
        `http://localhost:3002/users/${user._id}/events`,
        {
          eventId: eventId,
          action: "remove",
        }
      );
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event._id !== eventId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleAttendDelete = async (event, attendeeId) => {
    try {
      const response = await axios.put(
        `http://localhost:3002/events/${event._id}`,
        {
          attendees: event.attendees.filter(
            (attendee) => attendee._id !== attendeeId
          ),
        }
      );
      fetchEvents();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Friends:</h2>

      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
          </tr>
        </thead>
        <tbody>
          {friends.map((friend) => (
            <tr key={friend._id}>
              <td>{friend.firstName}</td>
              <td>{friend.lastName}</td>
              <td>
                <button
                  style={{ marginRight: "15px" }}
                  onClick={() => handleRemoveFriend(friend._id)}
                >
                  Delete Friend
                </button>
                <button onClick={() => handleViewFriendCal(friend._id)}>
                  View Calandar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <br />
      <FindFriend user={user} setFriends={setFriends} />

      <h2>My Events:</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Location</th>
            <th>Yale Location</th>
            <th>Attendees</th>
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
              <td>{event.location_marker}</td>
              <td>
                {event.attendees.map((attendee) => (
                  <div
                    key={attendee._id}
                    style={{ textDecoration: "underline", cursor: "pointer" }}
                    onClick={() => handleAttendDelete(event, attendee._id)}
                  >
                    {attendee.firstName} {attendee.lastName}
                  </div>
                ))}
              </td>
              <td>
                <button onClick={() => handleDelete(event._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedFriendId && <FriendsCalandar friendId={selectedFriendId} />}
      <CreateEventForm user={user} setEvents={setEvents} friends={friends} />
    </div>
  );
};

export default CalendarSample;
