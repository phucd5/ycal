import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import debounce from "lodash/debounce";

import { getTermString } from "../../utils/helpers";

const AddCourseDialog = (props) => {
	const { user, fetchClasses } = props;

	const [show, setShow] = useState(false);
	const [courseCode, setcourseCode] = useState("");
	const [searchedCourses, setsearchedCourses] = useState([]);

	const handleShow = () => setShow(true);
	const handleClose = () => {
		setShow(false);
		setsearchedCourses([]);
	};

	useEffect(() => {
		if (courseCode) {
			handleCourseSearch();
		} else {
			setsearchedCourses([]);
		}
	}, [courseCode]);

	/* Callback Functions */

	const handleCourseSearch = debounce(async () => {
		try {
			const response = await axios.get(
				`http://localhost:3002/yclasses/${courseCode}/name`
			);
			setsearchedCourses(response.data);
		} catch (error) {}
	}, 100);

	const handleAddSelectedCourse = async (courseId) => {
		try {
			await axios.put(`http://localhost:3002/users/${user._id}/classes`, {
				courseId: courseId,
				action: "add",
			});
		} catch (err) {
			console.log("Error:", err);
		}
		fetchClasses();
		handleClose();
	};

	/* Helper Functions */

	return (
		<>
			<Button variant="primary" onClick={handleShow}>
				Add Course
			</Button>
			<Modal
				show={show}
				onHide={handleClose}
				backdrop="static"
				keyboard={false}
				size="lg"
			>
				<Modal.Header closeButton>
					<Modal.Title id="add-course-modal-title">
						Add Course
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<input
						type="text"
						value={courseCode}
						onChange={(event) => setcourseCode(event.target.value)}
						style={{
							border: "1px solid #ccc",
							borderRadius: "4px",
							padding: "8px",
						}}
					/>
					{searchedCourses.length === 0 ? (
						<div></div>
					) : (
						<div>
							<table style={{ marginTop: "10px" }}>
								<thead>
									<tr>
										<th>Course</th>
										<th>Course Title</th>
										<th>Period</th>
									</tr>
								</thead>
								<tbody>
									{searchedCourses.map((course) => (
										<tr key={course._id}>
											<td>{course.displayName}</td>
											<td>{course.classTitle}</td>
											<td>
												{getTermString(course.period)}
											</td>
											<td>
												<button
													style={{
														marginRight: "15px",
														marginLeft: "15px",
													}}
													onClick={() =>
														handleAddSelectedCourse(
															course._id
														)
													}
												>
													Add Courses
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</Modal.Body>
			</Modal>
		</>
	);
};

export default AddCourseDialog;
