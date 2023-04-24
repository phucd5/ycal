import axios from "axios";
import FriendsCalandar from "../Calendar/FriendsCalandar";
import AddFriendDialog from "./AddFriend";

import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Modal.css";

const FriendsDialog = (props) => {
	const {
		user,
		friends,
		friendRequests,
		setFriends,
		setFriendRequests,
		show,
		handleClose,
	} = props;

	const handleAddFriend = async (friendId, friendEmail) => {
		try {
			const response = await axios.get(
				`http://localhost:3002/users/${friendEmail}/email`
			);
			try {
				const response_2 = await axios.put(
					`http://localhost:3002/users/${user._id}/friends`,
					{
						friendId: response.data._id,
						action: "add",
					}
				);
				setFriends(response_2.data);
				handleRemoveFriendRequest(friendId, "Sucessfully added friend");
			} catch (error) {
				toast.error("Failed to removed friend request");
			}
		} catch (error) {
			toast.error("Can't find friend");
		}
	};

	const handleRemoveFriendRequest = async (friendId, msg) => {
		try {
			const response = await axios.put(
				`http://localhost:3002/users/${user._id}/friendrequests`,
				{
					friendId: friendId,
					action: "remove",
				}
			);
			setFriendRequests(response.data);
			if (msg !== "") {
				toast.success(msg);
			}
		} catch (error) {
			console.log(error);
			toast.error("Failed to removed friend request");
		}
	};

	const handleRemoveFriend = async (friendId) => {
		try {
			const response = await axios.put(
				`http://localhost:3002/users/${user._id}/friends`,
				{
					friendId: friendId,
					action: "remove",
				}
			);
			setFriends(response.data);
			toast.success("Sucessfully removed friend");
		} catch (error) {
			console.log(error);
			toast.error("Failed to removed friend");
		}
	};

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
			{/* <Button variant="primary" onClick={handleShow}>
				Friends
			</Button> */}
			<Modal
				size="lg"
				show={show}
				onHide={handleClose}
				keyboard={true}
				className="custom-modal"
			>
				<Modal.Header closeButton>
					<Modal.Title className="modal-title">
						{friends ? <p>My Friends</p> : <p>N/A</p>}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<AddFriendDialog user={user} />
					<h2 className = "modal-label">Friend Requests</h2>
					{friendRequests.length > 0 ? (
						<Table style={{ marginTop: "10px" }}>
							<thead>
								<tr>
									<th>First</th>
									<th>Last</th>
									<th>Email</th>
								</tr>
							</thead>
							<tbody>
								{friendRequests.map((friend) => (
									<tr key={friend._id}>
										<td>{friend.firstName}</td>
										<td>{friend.lastName}</td>
										<td>{friend.email}</td>
										<td>
											<button
												class="btn btn-tertiary rounded-pill"
												style={{
													size: "sm",
													marginRight: "15px",
													marginLeft: "15px",
													backgroundColor: "#007bff",
													color: "white",
												}}
												onClick={() =>
													handleRemoveFriendRequest(
														friend._id,
														"Deleted friend request"
													)
												}
											>
												Delete Request
											</button>
											<button
												class="btn btn-tertiary rounded-pill"
												style={{
													size: "sm",
													marginRight: "15px",
													marginLeft: "15px",
													backgroundColor: "#007bff",
													color: "white"
												}}
												onClick={() =>
													handleAddFriend(
														friend._id,
														friend.email
													)
												}
											>
												Add Friend
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</Table>
					) : (
						<p>No friends requests!</p>
					)}

					<h2 className = "modal-label">My Friends</h2>
					{friends.length > 0 ? (
						<Table style={{ marginTop: "10px" }}>
							<thead>
								<tr>
									<th>First Name</th>
									<th>Last Name</th>
									<th>Email</th>
								</tr>
							</thead>
							<tbody>
								{friends.map((friend) => (
									<tr key={friend._id}>
										<td>{friend.firstName}</td>
										<td>{friend.lastName}</td>
										<td>{friend.email}</td>
										<td>
											<button
												class="btn btn-tertiary rounded-pill"
												style={{
													size: "sm",
													marginRight: "15px",
													marginLeft: "15px",
													backgroundColor: "#007bff",
													color: "white",
												}}
												onClick={() =>
													handleRemoveFriend(
														friend._id
													)
												}
											>
												Delete Friend
											</button>
											<FriendsCalandar
												friendId={friend._id}
											></FriendsCalandar>
										</td>
									</tr>
								))}
							</tbody>
						</Table>
					) : (
						<p>No friends!</p>
					)}
				</Modal.Body>
			</Modal>
		</>
	);
};

export default FriendsDialog;
