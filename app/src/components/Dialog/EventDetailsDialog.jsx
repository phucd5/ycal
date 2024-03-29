import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Modal.css";

const EventDetailsDialog = (props) => {
	const { user, event, fetchEvents, setEvents, show, handleClose } = props;

	/* Callback Functions */

	const handleCloseSuccess = (msg) => {
		toast.success(msg);
		handleClose();
	};

	const handleCloseError = (msg) => {
		toast.error(msg);
		handleClose();
	};

	const handleDelete = async (eventId) => {
		try {
			await axios.put(
				`${process.env.REACT_APP_SERVER_API_URL}users/${user._id}/events`,
				{
					eventId: eventId,
					action: "remove",
				}
			);
			setEvents((prevEvents) =>
				prevEvents.filter((event) => event._id !== eventId)
			);
		} catch (error) {
			handleCloseError("Failed to delete event");
		}
		handleCloseSuccess("Sucessfully deleted event");
	};

	const handleAttendDelete = async (event, attendeeId) => {
		try {
			await axios.put(
				`${process.env.REACT_APP_SERVER_API_URL}events/${event._id}`,
				{
					attendees: event.attendees.filter(
						(attendee) => attendee._id !== attendeeId
					),
				}
			);
			fetchEvents();
		} catch (error) {
			handleCloseError("Failed to delete attendee");
		}
		handleCloseSuccess("Sucessfully deleted attendee");
	};

	return (
		<div>
			<ToastContainer
				position="top-center"
				newestOnTop={true}
				autoClose={2000}
				closeOnClick
				rtl={false}
				pauseOnHover={false}
				theme="colored"
			/>
			<Modal
				size="lg"
				show={show}
				onHide={handleClose}
				keyboard={true}
				className="custom-modal"
			>
				<Modal.Header closeButton>
					<Modal.Title id="event-details-title">
						{event ? <p>{event.title}</p> : <p>N/A</p>}
					</Modal.Title>
				</Modal.Header>
				{event ? (
					<Modal.Body>
						<h3 className="modal-label">Description</h3>
						<p>{event.extendedProps.description}</p>
						<h3 className="modal-label">Start Date</h3>
						<p>{event.startStr.slice(0, 10)}</p>
						<h3 className="modal-label">End Date</h3>
						<p>{event.endStr.slice(0, 10)}</p>
						<h3 className="modal-label">Location</h3>
						<p>{event.extendedProps.location}</p>
						<h3 className="modal-label">Attendees</h3>
						<p>
							{event.extendedProps.attendees.length > 0 ? (
								event.extendedProps.attendees.map(
									(attendee) => (
										<div
											key={attendee._id}
											style={{
												textDecoration: "underline",
												cursor: "pointer",
											}}
											onClick={() =>
												handleAttendDelete(
													event.extendedProps,
													attendee._id
												)
											}
										>
											{attendee.firstName}{" "}
											{attendee.lastName}
										</div>
									)
								)
							) : (
								<div>None</div>
							)}
						</p>
						<Button
							onClick={() =>
								handleDelete(event.extendedProps._id)
							}
						>
							Delete Event
						</Button>
					</Modal.Body>
				) : (
					<Modal.Body></Modal.Body>
				)}
			</Modal>
		</div>
	);
};

export default EventDetailsDialog;
