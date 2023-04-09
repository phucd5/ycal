import React, { useState } from "react";
import axios from "axios";
import "./Calendar.css";
import Button from "react-bootstrap/Button"
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'

const AddCourse = ({user, setEvents, friends}) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const handleAddCourse = async (event) => {
    event.preventDefault();

    // try {
    //   const response = await axios.get(
    //     `http://localhost:3002/users/${email}/email`
    //   );
    //   try {
    //     const response_2 = await axios.put(
    //       `http://localhost:3002/users/${user._id}/friends`,
    //       {
    //         friendId: response.data._id,
    //         action: "add",
    //       }
    //     );
    //     setFriends(response_2.data);
    //   } catch (error) {
    //     alert("Person is already in your friend's list!");
    //   }
    // } catch (error) {
    //   alert("Can't find friend", error);
    // }
  };

  return (
      <>
        <Button variant="primary" onClick={handleShow}>Add Course</Button>
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
            <Form onSubmit={handleAddCourse}>
              <Form.Group className="mb-3" controlId="formAddCourse">
                <Form.Label htmlFor="courseCode">Course Code: </Form.Label>
                <Form.Control
                  className="input-box"
                  type="courseCode"
                  id="courseCode"
                  placeholder="CPSC419"
                />
                <Button type="submit">Add Course</Button>
              </Form.Group>
            </Form>

            {/* <form onSubmit={handleAddFriend}>
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
            </form> */}

          </Modal.Body>
        </Modal>

      </>

    
  );
};

export default AddCourse;
