import React, { useState, useEffect } from 'react';

function TodoList() {
  const [tasks, setTasks] = useState({
    incomplete: [],
    inProgress: [],
    completed: []
  });
  const [newTask, setNewTask] = useState('');
  const apiUrl = ''; // Example API URL

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const incompleteTasks = data.filter(task => !task.completed);
        const completedTasks = data.filter(task => task.completed);
        setTasks({
          incomplete: incompleteTasks.map(task => task.title),
          inProgress: [],
          completed: completedTasks.map(task => task.title)
        });
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }

    fetchTasks();
  }, []);

  const handleInputChange = (event) => {
    setNewTask(event.target.value);
  };

  const addTask = () => {
    if (newTask.trim() === '') return;
    setTasks((prevTasks) => ({
      ...prevTasks,
      incomplete: [...prevTasks.incomplete, newTask.trim()]
    }));
    setNewTask('');
    console.log(tasks);
  };

  const moveTask = (taskIndex, from, to) => {
    const updatedTasks = { ...tasks };
    const taskToMove = updatedTasks[from][taskIndex];
    updatedTasks[from] = updatedTasks[from].filter((_, index) => index !== taskIndex);
    updatedTasks[to] = [...updatedTasks[to], taskToMove];
    setTasks(updatedTasks);
  };

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-around">
        <div className="w-1/3">
          <h2 className="text-lg font-bold mb-2">Incomplete</h2>
          <ul>
            {tasks.incomplete.map((task, index) => (
              <li key={index} className="flex items-center justify-between mb-2">
                <span>{task}</span>
                <button className="btn" onClick={() => moveTask(index, 'incomplete', 'inProgress')}>
                  Start Progress
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-1/3">
          <h2 className="text-lg font-bold mb-2">On Progress</h2>
          <ul>
            {tasks.inProgress.map((task, index) => (
              <li key={index} className="flex items-center justify-between mb-2">
                <span>{task}</span>
                <button className="btn" onClick={() => moveTask(index, 'inProgress', 'completed')}>
                  Mark Completed
                </button>
                <button className="btn" onClick={() => moveTask(index, 'inProgress', 'incomplete')}>
                  Revert
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-1/3">
          <h2 className="text-lg font-bold mb-2">Task Completed</h2>
          <ul>
            {tasks.completed.map((task, index) => (
              <li key={index} className="flex items-center justify-between mb-2">
                <span>{task}</span>
                <button className="btn" onClick={() => moveTask(index, 'completed', 'incomplete')}>
                  Revert
                </button>
              </li>
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
