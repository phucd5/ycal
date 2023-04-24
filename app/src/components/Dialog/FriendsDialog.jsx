import axios from "axios";
import FriendsCalandar from "../Calendar/FriendsCalandar";
import AddFriendDialog from "./AddFriend"

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/button";
import Table from "react-bootstrap/Table";

const FriendsDialog = (props) => {
    const { user, friends, friendRequests, setFriends, setFriendRequests, show, handleShow, handleClose } = props;

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
				handleRemoveFriendRequest(friendId);
			} catch (error) {
				alert("Person is already in your friend's list!");
			}
		} catch (error) {
			alert("Can't find friend", error);
		}
	};

	const handleRemoveFriendRequest = async (friendId) => {
		try {
			const response = await axios.put(
				`http://localhost:3002/users/${user._id}/friendrequests`,
				{
					friendId: friendId,
					action: "remove",
				}
			);
			setFriendRequests(response.data);
		} catch (error) {
			console.log(error);
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
		} catch (error) {
			console.log(error);
		}
	};

    return (
        <>            
			<Button class="friends-button" variant="primary" onClick={handleShow} background-color="Transparent">
                Friends
			</Button>
            <Modal size="lg" show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title id="friends-title">
						{friends ? <p>My Friends</p> : <p>N/A</p>}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
                    <AddFriendDialog user={user}/>
                    <h2>Friend Requests</h2>
                    <Table style={{ marginTop: "10px" }}>
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
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
                                            style={{
                                                marginRight: "15px",
                                                marginLeft: "15px",
                                            }}
                                            onClick={() =>
                                                handleRemoveFriendRequest(
                                                    friend._id
                                                )
                                            }
                                        >
                                            Delete Request
                                        </button>
                                        <button
                                            style={{
                                                marginRight: "15px",
                                                marginLeft: "15px",
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
                    
                    <h2>My Friends</h2>
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
                                            style={{
                                                marginRight: "15px",
                                                marginLeft: "15px",
                                            }}
                                            onClick={() =>
                                                handleRemoveFriend(friend._id)
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
                </Modal.Body>
            </Modal>
        </>

            
    )
}

export default FriendsDialog;