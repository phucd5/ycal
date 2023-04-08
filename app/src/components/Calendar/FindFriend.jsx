import React, { useState } from "react";
import axios from "axios";
import "./Calendar.css";

const FindFriend = ({ user, setFriends }) => {
  const [email, setEmail] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleAddFriend = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.get(
        `http://localhost:3002/users/${email}/email`
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
      } catch (error) {
        alert("Person is already in your friend's list!");
      }
    } catch (error) {
      alert("Can't find friend", error);
    }
  };

  return (
    <form onSubmit={handleAddFriend}>
      <div>
        <h1>Add Friend</h1>
        <label htmlFor="email">Email:</label>
        <input
          className="input-box"
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
        />
      </div>
      <br></br>
      <button type="submit">Add Friend</button>
    </form>
  );
};

export default FindFriend;
