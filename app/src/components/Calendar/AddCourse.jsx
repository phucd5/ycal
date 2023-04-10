import React, { useState } from "react";
import axios from "axios";
import "./Calendar.css";
import Button from "react-bootstrap/Button"
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'

const AddCourse = ({user, setEvents, events}) => {
  const [show, setShow] = useState(false);
  const [courseCode, setcourseCode] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCourseChange = (course) => {
    setcourseCode(course.target.value);
  }

  const handleAddCourse = async (event) => {
    event.preventDefault();

    try {
      //course
      console.log("COURSE CODDE")
      console.log("COURSE CODE", courseCode);
      const response = await axios.get(
        `http://localhost:3002/yclasses/${courseCode}/name`
        
      );
      console.log("Response pass 1", response.data);
      try {
     const response_2 = await axios.put(
          `http://localhost:3002/users/${user._id}/classes`,
          {
            classId: response.data._id,
            action: "add",
          }
          
        );
        // console.log("Response 2 pass", response_2.data);
        // try {
        //   //getting schedule
        //   const response_3 = await axios.put(
        //     `http://localhost:3002/yclasses/${response._id}/schedule`
        //   );

        //   const mergedEvents =  events.concat(response_3.data);
        //   setEvents(mergedEvents)
        //   console.log(mergedEvents)

        // } catch (err) {
        //   console.log(err)
        // }
        window.location.reload(true);
      } catch (error) {
        alert("Course is already in your list");
      }
    } catch (error) {
      alert("Can't find course", error);
    }
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
                  value={courseCode}
                  onChange={handleCourseChange}
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
