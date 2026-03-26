import { useState, useEffect } from 'react'

const TodoList = () => {
  
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const API_URL = 'http://localhost:5000/todos';

  // Fetch Todos (GET)
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);

  // Add Todo (POST)
  const addTodo = () => {
    if (!task.trim()) return;
    
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task, completed: false })
    })
      .then(res => res.json())
      .then(newTodo => setTodos([...todos, newTodo]));
    setTask("");
  };

  // Update Todo (PATCH)
  const updateTodo = (id) => {
    const newTask = prompt("Edit your todo:");
    if (!newTask) return;

    fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: newTask })
    })
      .then(res => res.json())
      .then(updatedTodo => {
        setTodos(prev => prev.map(t => (t.id === id ? updatedTodo : t)));
      })
  };

  // Delete Todo (DELETE)
  const deleteTodo = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this todo?");
    if (!confirmDelete) return;

    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(() => setTodos(todos.filter(t => t.id !== id )));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card p-4 shadow w-50">

        <h1 className="text-center mb-4">To-Do List</h1>
        <div className="input-group mb-3">
          <input 
            className="form-control"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={handleKeyDown} 
            placeholder="Enter a task..."
          />
          <button className="btn btn-primary" onClick={addTodo}>
            Add
          </button>
        </div>

        
        <ul className="list-group">
          {todos.map(t => (
            <li
              key={t.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {t.task} 
              <div className="d-flex gap-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => updateTodo(t.id)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => deleteTodo(t.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      
      </div>
    </div>
  );
}

export default TodoList;