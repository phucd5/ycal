import React, { useState } from "react";
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"


const ExampleModal = (props) => {
    // const [events, setEvents] = useState([]);
    const {event, show, handleClose} = props;
    // if (event == null) {
    //     event = {name: "", date: new Date()};
    // };


    return (             
        <Modal
            size='lg'
            backdrop="static"
            keyboard={false}
            show={show}
            onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title id="event-details-title">                        
                    {event? <p>{event.title}</p> : <p>Test</p>}
                </Modal.Title>
            </Modal.Header>
            <></>
        </Modal>
    )
}

export default ExampleModal