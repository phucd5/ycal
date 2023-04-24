import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import { getTermString } from "../../utils/helpers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Modal.css";

const CourseDetailsDialog = (props) => {
	const { user, course, fetchCourses, show, handleClose } = props;

	const handleCloseSuccess = (msg) => {
		toast.success(msg);
		handleClose();
	};

	const handleCloseError = (msg) => {
		toast.error(msg);
		handleClose();
	};

	/* Callback Functions */

	const handleDelete = async (courseId) => {
		try {
			await axios.put(`http://localhost:3002/users/${user._id}/classes`, {
				courseId: courseId,
				action: "remove",
			});
			fetchCourses();
		} catch (error) {
			console.log(error);
			handleCloseError("Failed to delete course");
			return;
		}
		handleCloseSuccess("Sucessfully deleted course");
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
						{course ? <p>{course.className}</p> : <p>N/A</p>}
					</Modal.Title>
				</Modal.Header>
				{course ? (
				<Modal.Body>
					<h2>Course Code</h2>
					<p>{course.displayName}</p>
					<h2>Title</h2>
					<td>{course.classTitle}</td>								
					<h2>Meeting Time</h2>
					<td>{course.meetingTime}</td>									
					<h2>Location</h2>
					<td>{course.location}</td>
					<h2>Period</h2>
					<td>{getTermString(course.period)}</td>		
					<p/>
					<Button
						class="btn btn-tertiary rounded-pill"
						style={{
							size: "sm",
							marginRight: "15px",
							marginLeft: "15px",
							backgroundColor: "#007bff",
							color: "white",
						}}
						onClick={() =>
							handleDelete(course._id)
						}
					>
						Delete Course
					</Button>								
				</Modal.Body>) : (<Modal.Body></Modal.Body>)}					
			</Modal>
		</div>
	);
};

export default CourseDetailsDialog;
