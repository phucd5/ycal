import React, { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import AISchedule from "../Calendar/AISchedule"


const SelectFriend = (props) => {
	const { user, friends } = props;
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");
	const [location, setLocation] = useState("");
	const [locationMarker, setLocationMarker] = useState("None");
	const [attendees, setAttendees] = useState([]);
	const [email, setEmail] = useState("");
	const [show, setShow] = useState(false);
	const [disabledCheck, setDisabled] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
    const handleCheck = (targetCheck, friendId) => {
        const isChecked = targetCheck;
        if (isChecked) {
          setAttendees((prevAttendees) => [
            ...prevAttendees,
            friendId,
          ]);
        }
        else {
          setAttendees((prevAttendees) =>
            prevAttendees.filter((id) => id !== friendId)
          );
        }
      };
      const handleSubmitForm = async (e) => {
		setDisabled(true);
		handleShow();
      }

	return (
		<>
			<Button variant="primary" onClick={handleShow}>
				Schedule Meeting
			</Button>
			<Modal
				show={show}
				onHide={handleClose}
				backdrop="static"
				keyboard={false}
			>
				<Modal.Header closeButton>
					<Modal.Title id="add-friend-modal-title">
						Add Friend
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
                    <Form.Group>
                            <Form.Label>Friends to Select:</Form.Label>
                            {/* maps a checkbox to every friend*/}
                            {friends.map((friend) => (
                                <Form.Check
								disabled={disabledCheck}
                                key={friend._id}
                                type="checkbox"
                                id={friend._id}
                                label={`${friend.firstName} ${friend.lastName}`}
                                checked={attendees.includes(friend._id)}
                                // on change,
                                // if checked, include previous attendees and current attended checked
                                // if unchecked, filter out the checked friend id
                                onChange={(e) => {
                                    handleCheck(e.target.checked, friend._id);
                                }}
                                />
                            ))}
							{disabledCheck ? <AISchedule user={user} friends={attendees}/> : <div></div>}
                            <Button disabled={disabledCheck} onClick={handleSubmitForm}>Schedule Meeting</Button>
                        </Form.Group>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
};

export default SelectFriend;