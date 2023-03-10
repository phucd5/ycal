import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import NewEventModal from "./NewEventModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Calendar = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [authenticated, setauthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [eventAdd, setEventAdd] = useState(null);
  const [events, setEvents] = useState([]);
  const calendarRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("token");
    setUser(JSON.parse(localStorage.getItem("user")));
    console.log(user)
  
    if (loggedInUser) {
      console.log(loggedInUser);
      setauthenticated(true);
    } else {
      alert("Please login!");
      navigate("/login");
    }
  }, []);
  
  useEffect(() => {
    if (user && user._id) {
      async function fetchEvents() {
        try {
          const response = await axios.get(`http://localhost:3002/users/${user._id}/events`);
          setEvents(response.data);
        } catch (error) {
          console.error(error);
        }
      }
  
      fetchEvents();
    }
  }, [user]);

  const onEventAdded = (event) => {
    let calendarApi = calendarRef.current.getApi();
    calendarApi.addEvent(event);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login")
  };


  async function handleEventAdd(data) {
    console.log(data.event.title);

    try {
      const response = await axios.post(
        "http://localhost:3002/events/create",
        {
          name: data.event.title,
          date: data.event.startStr,
        }
      );
      
      try {
        const response_2 = await axios.put(
          `http://localhost:3002/users/${user._id}/events`,
          {
            eventId: response.data._id,
            add: true
          }
        );
        console.log(response);
      } catch (error) {
        console.log(error);
      }
      

    } catch (error) {
      console.log(error);
    }


  }

  if (authenticated) {
    return (
      <section>
        <button onClick={() => setModalOpen(true)}>Add New Event</button>
        <button onClick={handleLogout}>Logout</button>
        <div style={{ position: "relative", zIndex: 0 }}>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventAdd={(event) => handleEventAdd(event)}
          />
        </div>
        <NewEventModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onEventAdded={(event) => onEventAdded(event)}
        />
      </section>
    );
  }
};

export default Calendar;
