import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";

const CourseDetailsDialog = (props) => {
	const { user, course, fetchCourses, show, handleClose } = props;

	/* Callback Functions */
	
	const handleDelete = async (courseId) => {
		try {
			await axios.put(
				`http://localhost:3002/users/${user._id}/classes`,
				{
					courseId: courseId,
					action: "remove",
				}
			);
			fetchCourses();
		} catch (error) {
			console.log(error);
			handleClose();
			return;
		}
		handleClose();
	};

	return (
		<div>
			<Modal size="lg" show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title id="event-details-title">
						{course ? <p>{course.className}</p> : <p>N/A</p>}
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
							{course ? (
								<tr>
									<td>{course.displayName}</td>
									<td>{course.classTitle}</td>
									<td>MW 9:00AM-11:00AM</td>
									<td>Yale</td>
									<td>{course.period}</td>
									<td>
										<Button
											onClick={() =>
												handleDelete(
													course._id
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
