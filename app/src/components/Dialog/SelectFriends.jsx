import React, { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import AISchedule from "../Calendar/AISchedule"


const SelectFriend = (props) => {
	const { user, friends } = props;
	const [attendees, setAttendees] = useState([]);
	const [meetingTime, setMeetingTime] = useState("30 minutes");
	const [show, setShow] = useState(false);
	const [disabledCheck, setDisabled] = useState(false);

	const handleMeetingTimeChange = (event) => {
		setMeetingTime(event.target.value);
	};

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
                                onChange={(e) => {
                                    handleCheck(e.target.checked, friend._id);
                                }}
                                />
                            ))}
							<Form.Control
								className="input-box"
								type="email"
								id="email"
								value={meetingTime}
								onChange={handleMeetingTimeChange}
							/>
                            <Button disabled={disabledCheck} onClick={handleSubmitForm}>Schedule Meeting</Button>
                        </Form.Group>
					</Form>
					{disabledCheck ? <AISchedule user={user} friends={attendees} meetingTime={meetingTime}/> : <div></div>}
				</Modal.Body>
			</Modal>
		</>
	);
};

export default SelectFriend;