import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import debounce from "lodash/debounce";
import "./Modal.css";

import { getTermString } from "../../utils/helpers";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddCourseDialog = (props) => {
	const { user, fetchClasses, show, setShow, handleShow } = props;

	const [courseCode, setcourseCode] = useState("");
	const [searchedCourses, setsearchedCourses] = useState([]);

	const handleClose = () => {
		setShow(false);
		setsearchedCourses([]);
		setcourseCode("");
	};

	const handleCloseSuccess = () => {
		toast.success("Sucessfully added course to calendar");
		setShow(false);
		setsearchedCourses([]);
		setcourseCode("");
	};

	const handleCloseError = () => {
		toast.error("Failed added course to calendar");
		setShow(false);
		setsearchedCourses([]);
		setcourseCode("");
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
			handleCloseError();
		}
		fetchClasses();
		handleCloseSuccess();
	};

	/* Helper Functions */

	return (
		<>
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
				show={show}
				onHide={handleClose}
				keyboard={true}
				size="lg"
				className="custom-modal"
			>
				<Modal.Header closeButton>
					<Modal.Title
						className="modal-title"
						id="add-course-modal-title"
					>
						Add Course
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<input
						type="text"
						value={courseCode}
						onChange={(event) => setcourseCode(event.target.value)}
						placeholder="Type Course Code or Title"
						style={{
							border: "1px solid #ccc",
							borderRadius: "4px",
							padding: "8px",
							fontWeight: "bold",
							fontStyle: "normal",
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
													class="btn btn-tertiary rounded-pill"
													style={{
														size: "sm",
														marginRight: "15px",
														marginLeft: "15px",
														backgroundColor:
															"#007bff",
														color: "white",
													}}
													onClick={() =>
														handleAddSelectedCourse(
															course._id
														)
													}
												>
													Add
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
