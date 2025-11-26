import { useState, useEffect } from 'react'

function App() {
  const [tasks, setTasks] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState('all')
  const [category, setCategory] = useState('personal')

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      const newTask = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
        category: category,
        createdAt: new Date().toISOString()
      }
      setTasks([...tasks, newTask])
      setInputValue('')
    }
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed))
  }

  const getFilteredTasks = () => {
    switch (filter) {
      case 'active':
        return tasks.filter(task => !task.completed)
      case 'completed':
        return tasks.filter(task => task.completed)
      default:
        return tasks
    }
  }

  const filteredTasks = getFilteredTasks()
  const stats = {
    total: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
    personal: tasks.filter(t => t.category === 'personal').length,
    work: tasks.filter(t => t.category === 'work').length,
    shopping: tasks.filter(t => t.category === 'shopping').length
  }

  const getCategoryIcon = (cat) => {
    const icons = {
      personal: '👤',
      work: '💼',
      shopping: '🛒'
    }
    return icons[cat] || '📝'
  }

  const getCategoryColor = (cat) => {
    const colors = {
      personal: '#667eea',
      work: '#f56565',
      shopping: '#48bb78'
    }
    return colors[cat] || '#718096'
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">✅ Task Manager</h1>
          <p className="subtitle">Organize your life, one task at a time</p>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-card active">
            <div className="stat-value">{stats.active}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-card completed">
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        <div className="add-task-section">
          <form onSubmit={addTask} className="task-form">
            <div className="category-selector">
              <button
                type="button"
                className={`category-btn ${category === 'personal' ? 'active' : ''}`}
                onClick={() => setCategory('personal')}
                style={{ borderColor: getCategoryColor('personal') }}
              >
                👤 Personal
              </button>
              <button
                type="button"
                className={`category-btn ${category === 'work' ? 'active' : ''}`}
                onClick={() => setCategory('work')}
                style={{ borderColor: getCategoryColor('work') }}
              >
                💼 Work
              </button>
              <button
                type="button"
                className={`category-btn ${category === 'shopping' ? 'active' : ''}`}
                onClick={() => setCategory('shopping')}
                style={{ borderColor: getCategoryColor('shopping') }}
              >
                🛒 Shopping
              </button>
            </div>
            <div className="input-group">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="What needs to be done?"
                className="task-input"
              />
              <button type="submit" className="add-btn">Add Task</button>
            </div>
          </form>
        </div>

        <div className="filter-section">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({tasks.length})
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active ({stats.active})
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({stats.completed})
          </button>
          {stats.completed > 0 && (
            <button className="clear-btn" onClick={clearCompleted}>
              Clear Completed
            </button>
          )}
        </div>

        <div className="tasks-container">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <p className="empty-text">
                {filter === 'completed'
                  ? 'No completed tasks yet'
                  : filter === 'active'
                  ? 'No active tasks. Great job!'
                  : 'No tasks yet. Add one above!'}
              </p>
            </div>
          ) : (
            <div className="task-list">
              {filteredTasks.map(task => (
                <div
                  key={task.id}
                  className={`task-item ${task.completed ? 'completed' : ''}`}
                >
                  <div className="task-content">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="task-checkbox"
                    />
                    <div className="task-details">
                      <span className="task-text">{task.text}</span>
                      <div className="task-meta">
                        <span
                          className="task-category"
                          style={{ color: getCategoryColor(task.category) }}
                        >
                          {getCategoryIcon(task.category)} {task.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="delete-btn"
                    aria-label="Delete task"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
