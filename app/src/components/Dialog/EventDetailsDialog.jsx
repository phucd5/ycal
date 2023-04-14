import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";

const EventDetailsDialog = (props) => {
	const { user, event, fetchEvents, setEvents, show, handleClose } = props;

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
		handleClose();
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
		handleClose();
	};

	return (
		<div>
			<Modal size="lg" show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title id="event-details-title">
						{event ? <p>{event.title}</p> : <p>Test</p>}
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
							{event ? (
								<tr>
									<td>{event.extendedProps.description}</td>
									<td>{event.startStr}</td>
									<td>{event.endStr}</td>
									<td>{event.extendedProps.location}</td>
									<td>
										{event.extendedProps.location_marker}
									</td>
									<td>
										{event.extendedProps.attendees.map(
											(attendee) => (
												<div
													key={attendee._id}
													style={{
														textDecoration:
															"underline",
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
										)}
									</td>
									<td>
										<Button
											onClick={() =>
												handleDelete(
													event.extendedProps._id
												)
											}
										>
											Delete
										</Button>
									</td>
								</tr>
							) : (
								<tr></tr>
							)}
						</tbody>
					</Table>
				</Modal.Body>
			</Modal>
		</div>
	);
};

export default EventDetailsDialog;
