import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import React, { useState, useEffect, useRef } from "react";

const CourseDetailsDialog = (props) => {
	const { user, event, fetchCourses, setCourses, show, handleClose } = props;

	const handleDelete = async (eventId) => {
		try {
			const response = await axios.put(
				`http://localhost:3002/users/${user._id}/events`,
				{
					eventId: eventId,
					action: "remove",
				}
			);
			setCourses((prevEvents) =>
				prevEvents.filter((event) => event._id !== eventId)
			);
		} catch (error) {
			console.log(error);
		}
		handleClose();
	};

	// const fetchCourseDetails = async () => {
	// 	// const classResponse = await axios.get(`http://localhost:3002/yclasses/${event.extendedProps.class}`);
	// 	console.log("class", event);
	//   }


	  

	return (
		<div>
			<Modal size="lg" show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title id="event-details-title">
						{event ? <p>{event.className}</p> : <p>Test</p>}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Table>
						<thead>
							<tr>
								<th>Course Code</th>
								<th>Title</th>
								<th>Time</th>
								<th>Location</th>
								<th>Period</th>								
							</tr>
						</thead>
						<tbody>
							{event ? (
								<tr>
									<td>{event.displayName}</td>
									<td>{event.classTitle}</td>
									<td>MW 9:00AM-11:00AM</td>
									<td>Yale</td>
									<td>{event.period}</td>
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

export default CourseDetailsDialog;
