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
  const calendarRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("token");

    if (loggedInUser) {
      // console.log(loggedInUser);
      setUser(JSON.parse(localStorage.getItem("user")));
      setauthenticated(true);
    } else {
      alert("Please login!");
      navigate("/login");
    }
  }, []);

  const onEventAdded = (event) => {
    let calendarApi = calendarRef.current.getApi();
    calendarApi.addEvent(event);
  };

  async function handleEventAdd(data) {
    console.log(data.event.title);

    try {
      const response = await axios.post(
        "http://172.27.112.217:3001/events/create",
        {
          name: data.event.title,
          date: data.event.startStr,
        }
      );
      console.log(response.data);
      setEventAdd(response.data);
    } catch (error) {
      console.log(error);
    }

    // console.log(user.id);
    // console.log(eventAdd.id);
    // console.log(response.ObjectId);
    // await axios.post("/api/calendar/create-event", data.event);
  }

  if (authenticated) {
    return (
      <section>
        <button onClick={() => setModalOpen(true)}>Add New Event</button>
        <div style={{ position: "relative", zIndex: 0 }}>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
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
