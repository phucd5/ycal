import React, {useState, useRef} from "react";
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import NewEventModal from "./NewEventModal";
import axios from "axios";

const Calendar = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const calendarRef = useRef(null);

  const onEventAdded = event => {
    let calendarApi = calendarRef.current.getApi()
    calendarApi.addEvent(event);
  }
  
  async function handleEventAdd(data) {
    await axios.post('/api/calendar/create-event', data.event);
  }

  return (
    <section>
      <button onClick={() => setModalOpen(true)}>Add New Event</button>
        <div style={{position: "relative", zIndex: 0}}>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            eventAdd = {event => handleEventAdd(event)}
          />
        </div>
      <NewEventModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onEventAdded={event => onEventAdded(event)}/>
    </section>
  )
};

export default Calendar;
