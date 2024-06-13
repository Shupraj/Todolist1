import React, { useState, useEffect } from 'react';
function TodoList() {
  const [load, setload] = useState(false)
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch('https://todolist-39580-default-rtdb.firebaseio.com/todo.json')
        const data = await response.json()
        const objectData = {};
        Object.keys(data).forEach((key) => {
          objectData[key] = data[key];
        });
        
        setTasks(objectData);
      } catch (error) {
        console.log("Error", error);
      }
    }
    fetchTasks();
  }, [load]);
  console.log(tasks)
  const handleInputChange = (event) => {
    setNewTask(event.target.value);
  };
  const addTask = async () => {
    if (newTask.trim() === '') return;
    try {
      const response = await fetch('https://todolist-39580-default-rtdb.firebaseio.com/todo.json', {
        method: 'POST',
        body: JSON.stringify({
          title: newTask,
          status: 'incomplete'
        })
      })
      const result = await response.json()
      console.log(result)
      setload(!load)
    } catch (error) {
      console.log("Error", error)
    }
  };
  const moveTask = async (task_id, to) => {
    console.log(task_id,to)
    try{
      const response = await fetch(`https://todolist-39580-default-rtdb.firebaseio.com/todo/${task_id}.json`,{
        method:'PATCH',
        body:JSON.stringify({
          status:to
        })
      })
      const result = await response.json()
      console.log(result)
      setload(!load)
    } catch(error){
      console.log("Error", error)
    }
    
    // const updatedTasks = { ...tasks };
    // const taskToMove = updatedTasks[from][taskIndex];
    // updatedTasks[from] = updatedTasks[from].filter((_, index) => index !== taskIndex);
    // updatedTasks[to] = [...updatedTasks[to], taskToMove];
    // setTasks(updatedTasks);
  };
  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-around">
        <div className="w-1/3">
          <h2 className="text-lg font-bold mb-2">Incomplete</h2>
          <ul>
          {tasks && Object.values(tasks).map((task, index) => (
              task.status === "incomplete" && (
                <li key={index} className="flex items-center justify-between mb-2">
                  <span>{task.title}</span>
                  <button className="btn" onClick={() => moveTask(task.id, 'inProgress')}>
                    Start Progress
                  </button>
                </li>
              )
            ))}
          </ul>
        </div>
        <div className="w-1/3">
          <h2 className="text-lg font-bold mb-2">On Progress</h2>
          <ul>
          {tasks && Object.values(tasks).map((task, index) => (
              task.status === "inProgress" && (<li key={index} className="flex items-center justify-between mb-2">
                <span>{task.title}</span>
                <button className="btn" onClick={() => moveTask(task.id, 'completed')}>
                  Mark Completed
                </button>
                <button className="btn" onClick={() => moveTask(task.id, 'incomplete')}>
                  Revert
                </button>
              </li>)
            )
            )}
          </ul>
        </div>
        <div className="w-1/3">
          <h2 className="text-lg font-bold mb-2">Task Completed</h2>
          <ul>
          {tasks && Object.values(tasks).map((task, index) => (
              task.status==="completed" && (<li key={index} className="flex items-center justify-between mb-2">
                <span>{task.title}</span>
                <button className="btn" onClick={() => moveTask(task.id, 'inProgress')}>
                  Revert
                </button>
              </li>)
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <input
          type="text"
          value={newTask}
          onChange={handleInputChange}
          placeholder="Enter task..."
          className="rounded-l-lg px-4 py-2 border-2 border-r-0 border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <button onClick={addTask} className="btn bg-blue-500 hover:bg-blue-600 text-white rounded-r-lg px-4 py-2 border border-blue-500">
          Add Task
        </button>
      </div>
    </div>
  );
}
export default TodoList;
