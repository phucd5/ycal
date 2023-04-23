import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import AIScheduleDialog from "./AIScheduleDialog";
import { validateWithinOneWeek } from "../../utils/valdiation";

const SelectFriend = (props) => {
	const { user, friends, show, setShow, handleShow } = props;

	const handleClose = () => {
		setDisabled(false);
		setShow(false);
	};

	const [disabledCheck, setDisabled] = useState(false);

	const [attendees, setAttendees] = useState([]);
	const [meetingDate, setMeetingDate] = useState("");
	const [meetingLength, setMeetingLength] = useState("");

	/* Callback Functions */

	const handleCheck = (targetCheck, friendId) => {
		const isChecked = targetCheck;
		if (isChecked) {
			setAttendees((prevAttendees) => [...prevAttendees, friendId]);
		} else {
			setAttendees((prevAttendees) =>
				prevAttendees.filter((id) => id !== friendId)
			);
		}
	};

	const handleSubmitForm = async (e) => {
		const validateDateInput = validateWithinOneWeek(new Date(meetingDate));
		if (!validateDateInput.valid) {
			alert(validateDateInput.err);
			return;
		}
		setDisabled(true);
		handleShow();
	};

	return (
		<>
			<Modal
				show={show}
				onHide={handleClose}
				backdrop="static"
				keyboard={false}
			>
				<Modal.Header closeButton>
					<Modal.Title id="add-friend-modal-title">
						Schedule Meeting
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group>
							<Form.Label>Friends to Select:</Form.Label>
							{friends.map((friend) => (
								<Form.Check
									disabled={disabledCheck}
									key={friend._id}
									type="checkbox"
									id={friend._id}
									label={`${friend.firstName} ${friend.lastName}`}
									checked={attendees.includes(friend._id)}
									onChange={(e) => {
										handleCheck(
											e.target.checked,
											friend._id
										);
									}}
								/>
							))}
							<Form.Group>
								<Form.Label>
									Meeting Date (One Week in Advanced):
								</Form.Label>
								<br />
								<Form.Control
									disabled={disabledCheck}
									type="date"
									value={meetingDate}
									className="input-box"
									onChange={(e) =>
										setMeetingDate(e.target.value)
									}
									required
								/>
							</Form.Group>
							<Form.Group>
								<Form.Label>Meeting Length:</Form.Label>
								<br />
								<Form.Select
									disabled={disabledCheck}
									value={meetingLength}
									onChange={(e) =>
										setMeetingLength(e.target.value)
									}
									required
								>
									<option value="30 minutes">
										30 minutes
									</option>
									<option value="45 minutes">
										45 minutes
									</option>
									<option value="1 hour">1 Hour</option>
									<option value="2+ hours">2+ hours</option>
								</Form.Select>
								<br />
							</Form.Group>
							<Button
								disabled={disabledCheck}
								onClick={handleSubmitForm}
							>
								Schedule Meeting
							</Button>
						</Form.Group>
					</Form>
					{disabledCheck ? (
						<AIScheduleDialog
							user={user}
							friends={attendees}
							meetingDate={meetingDate}
							meetingLength={meetingLength}
						/>
					) : (
						<div></div>
					)}
				</Modal.Body>
			</Modal>
		</>
	);
};

export default SelectFriend;
