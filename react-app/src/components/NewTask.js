import React, { useState } from 'react';
import './newtask.css'


function NewTask() {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [link, setLink] = useState('');
  const [success, setSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDetailsChange = (event) => {
    setDetails(event.target.value);
  };

  const handleLinkChange = (event) => {
    setLink(event.target.value);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (title === '' || details === '') {
      setAlertMessage('Please fill necessary details!!');
      return;
    }
    const data = { title, details, link };
    try {
      const response = await fetch('http://localhost:5050/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      console.log(jsonData);
      setSuccess(true); // set success state to true if POST request is successful
      setTitle('');
      setDetails('');
      setLink('');
    } catch (error) {
      console.error('There was an error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Add new Task</h1>
      <div className="addTask">
        <input type="text" id="taskTitle" value={title} onChange={handleTitleChange} placeholder="Enter task title" />
        <input type="text" id="taskLink" value={link} onChange={handleLinkChange} placeholder="Enter task link (Optional)" />
        <input type="text" id="taskDetails" value={details} onChange={handleDetailsChange} placeholder="Enter task details" />
        <button type="submit" id="addTaskBtn">Add task</button>
      </div>
      {alertMessage && <p style={{color:'red', fontWeight:'bold'}}>{alertMessage}</p>}
      {success && <div style={{color:'green', fontWeight:'bold'}}>Success! Task has been added.</div>}
    </form>
  );
}

export default NewTask;
