import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
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
			await axios.put(
				`${process.env.REACT_APP_SERVER_API_URL}users/${user._id}/classes`,
				{
					courseId: courseId,
					action: "remove",
				}
			);
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
						<h3 className="modal-label">Course Code</h3>
						<p>{course.displayName}</p>
						<h3 className="modal-label">Title</h3>
						<p>{course.classTitle}</p>
						<h3 className="modal-label">Meeting Time</h3>
						<p>{course.meetingTime}</p>
						<h3 className="modal-label">Location</h3>
						<p>{course.location}</p>
						<h3 className="modal-label">Period</h3>
						<p>{getTermString(course.period)}</p>
						<p />
						<br />
						<Button
							class="btn btn-tertiary rounded-pill"
							style={{
								size: "sm",
								marginRight: "15px",
								marginLeft: "15px",
								backgroundColor: "#007bff",
								color: "white",
							}}
							onClick={() => handleDelete(course._id)}
						>
							Delete Course
						</Button>
					</Modal.Body>
				) : (
					<Modal.Body></Modal.Body>
				)}
			</Modal>
		</div>
	);
};

export default CourseDetailsDialog;
