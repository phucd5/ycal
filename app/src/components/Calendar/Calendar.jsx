import "./Calendar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import React, { useState, useEffect, useRef } from "react";
import FriendsCalandar from "./FriendsCalandar";
import CreateEventForm from "./CreateEventForm";
import AddFriend from "./AddFriend";
import EventDetails from "./EventDetails";
import AddCourse from "./AddCourse"

const Calendar = () => {
  const [modalShow, setModalShow] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleModalShow = () => setModalShow(true);
  const handleModalClose = () => setModalShow(false);
  const handleSelectedEvent = (event) => setSelectedEvent(event)

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
  const calendarRef = useRef(null);
  const calendar_fake = [
    {
      title: "Meeting with John",
      start: "2023-04-12T10:30:00",
      end: "2023-04-12T12:00:00",
      color: "#36c7d0",
    },
    {
      title: "Product launch",
      start: "2023-04-16T13:00:00",
      end: "2023-04-16T15:00:00",
      color: "#f77b7b",
    },
    {
      title: "Team building",
      start: "2023-04-20T09:00:00",
      end: "2023-04-20T17:00:00",
      color: "#2a9d8f",
    },
    {
      title: "Deadline for project X",
      start: "2023-04-23T12:00:00",
      end: "2023-04-23T16:00:00",
      color: "#fcbf49",
    },
    {
      title: "Conference call with partners",
      start: "2023-04-28T16:30:00",
      end: "2023-04-28T17:30:00",
      color: "#e76f51",
    },
  ];

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
      console.log(response.data);
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

  const handleEventClick = (info) => {      
      handleSelectedEvent(info.event)
      console.log(info.event);
      console.log("Test", );
      handleModalShow();
  };

  return (
    <div>
      <h1> YCal </h1>
    <div class="container">
      <div class="item friends-item">
        <h2>Friends:</h2>
        <AddFriend user={user} setFriends={setFriends} />
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
                  <FriendsCalandar friendId={friend._id}></FriendsCalandar>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div class="item courses-item">
        <h2>Courses:</h2>
          <AddCourse 
              user={user}
              setEvents={setEvents}
              friends={friends}></AddCourse>
      </div>
      <h2>My Calendar</h2>
      <div class="item events-item">
        <CreateEventForm user={user} setEvents={setEvents} friends={friends} />
      </div>
      <div class="item calendar-item">
        <div>
          <FullCalendar
            timeZone="UTC"
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            events={events}
            eventClick= {(info) => handleEventClick(info)}
          />
        </div>
        <EventDetails             
              event={selectedEvent}     
              events={events}       
              show={modalShow}
              handleClose={handleModalClose}
              handleDelete={handleDelete}
              handleAttendDelete={handleAttendDelete}
              fetchEvents={fetchEvents}
              >                
        </EventDetails>
      </div>
    </div>
    </div>
  );
};

export default Calendar;
