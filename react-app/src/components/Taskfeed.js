import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import "./taskfeed.css";


function Taskfeed() {
  const [tasks, setTasks] = useState([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchData() {
        let url = `http://localhost:5050/data`;
        const response = await fetch(url);
        const data = await response.json();
        setTasks(data);
      }
          fetchData();
  }, []);

const handleDragEnd = (result) => {
  if (!result.destination) {
    return;
  }
  const newTasks = [...tasks];
  const [reorderedTask] = newTasks.splice(result.source.index, 1);
  newTasks.splice(result.destination.index, 0, reorderedTask);
  setTasks(newTasks);

  const updatedTasks = newTasks.map((task, index) => {
    task.position = index;
    return task;
  });

  const ids = updatedTasks.map((task) => task._id);

  fetch('http://localhost:5050/updatePositions', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
};

  const getStatusClass = (status) => {
    return status === 1 ? 'strikethrough' : '';
  };
  return (
    <div style={{marginTop:'30px'}}>
      <h2>Dashboard</h2>
      <center><hr style={{width:'250px', marginBottom:'30px 0'}}></hr></center>
    <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div className='main-taskfeed'>
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {tasks.map((task, index) => (
                  <Draggable key={task._id} draggableId={task._id} index={index}>
                    {(provided) => (
                      <li className={`task-data ${getStatusClass(task.status)}`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        draggable={true}
                      >
                        <div className={`${getStatusClass(task.status) !== 'strikethrough' ? '' : 'hide-delete'}`}>
                          <h4>{task.title}</h4>
                          <a href={task.link}>{task.link}</a>
                          <p>{task.details}</p>
                        </div>
                        <div className='right-keys'>
                          <input
                            type="checkbox"
                            defaultChecked={task.status !== 0}
                            onClick={() => {
                            const newTasks = [...tasks];
                            newTasks[index].status = newTasks[index].status === 0 ? 1 : 0;
                            setTasks(newTasks);
                            fetch(`http://localhost:5050/update/${task._id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ status: newTasks[index].status })
                            })
                              .then(response => response.json())
                              .then(data => console.log(data))
                              .catch(error => console.error(error))
                          }}
                        />
                        <div>
                            <button style={{background:'red'}}
                              onClick={() => {
                                const newTasks = [...tasks];
                                fetch(`http://localhost:5050/delete/${task._id}`,{
                                  method:'DELETE'
                                })
                                .then(response => {
                                  if (response.ok) {
                                    setSuccess(task);
                                    // Remove the deleted task from the state
                                    setTasks(newTasks.filter(t => t._id !== task._id));
                                  } else {
                                    throw new Error('Failed to delete task');
                                  }
                                })
                                .catch(error => console.error(error))
                              }}
                            >
                              Delete
                            </button>
                        </div>
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          </div>
        )}
      </Droppable>
    </DragDropContext>
    </div>
  );
}

export default Taskfeed;
