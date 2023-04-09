import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef} from "react";
import Button from "react-bootstrap/Button"
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';

const EventDetails = (props) => {


    const {event, show, events, handleClose, handleDelete, handleAttendDelete, fetchEvents} = props;

    console.log(event)

    const handleDeleteHide = (id) => {
        handleClose()
        handleDelete(id)
    }

    const handleAttendDeleteHide = (event, attendeeId) => {
        handleAttendDelete(event, attendeeId)
        handleClose()        
    }

    return (       
        <div>
        <Modal
            size='lg'
            show={show}
            onHide={handleClose}
        >
            <Modal.Header closeButton>
                <Modal.Title id="event-details-title">
                    {event? <p>{event.title}</p> : <p>Test</p>}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Location</th>
                            <th>Yale Location</th>
                            <th>Attendees</th>
                        </tr>
                    </thead>
                    <tbody>
                        {event? 
                        <tr>
                            <td>{event.extendedProps.description}</td>
                            <td>{event.startStr}</td>
                            <td>{event.endStr}</td>
                            <td>{event.extendedProps.location}</td>
                            <td>{event.extendedProps.location_marker}</td>
                            <td>
                                {event.extendedProps.attendees.map((attendee) => (
                                <div
                                    key={attendee._id}
                                    style={{ textDecoration: "underline", cursor: "pointer" }}
                                    onClick={() => handleAttendDeleteHide(event.extendedProps, attendee._id)}
                                >
                                    {attendee.firstName} {attendee.lastName}
                                </div>
                                ))}
                            </td>
                            <td>
                                <Button onClick={() => handleDeleteHide(event.extendedProps._id)}>Delete</Button>
                            </td>
                        </tr>
                        : <tr></tr>}
                        
                    </tbody>
                </Table>                        
            </Modal.Body>   
        </Modal>
        </div> 
    );
};

export default EventDetails