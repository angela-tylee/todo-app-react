import { useState, useEffect, useRef } from 'react';
import Filter from './components/Filter';

// FIXME: Drag n Drop fail
// FIXME: Cannot delete the last item from localStorage
// FIXME: Initial window is over 100vh

const App = () => {
  const [tasks, setTasks] = useState([]);
  // const [tempData, setTempData] = useState({
  //   task: '',
  //   isCompleted: false,
  //   id: 0,
  // });
  const [tempData, setTempData] = useState('');

  // switch theme
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.body.classList.add(`${theme}-theme`);
    return () => {
      document.body.classList.remove(`${theme}-theme`);
    };
  }, [theme]);

  const toggleTheme = () => {
    let newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // add task
  function handleAddTask(e) {
    e.preventDefault();
    if (!tempData.trim()) return;

    setTasks([
      ...tasks,
      { task: tempData, isCompleted: false, id: Date.now() },
    ]);
    setTempData('');
  }

  // store tasks to local storage
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, filter]);

  // loadTasks;
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // delete task
  function deleteTask(id) {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }

  // clear completed
  function deleteCompletedTasks() {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.isCompleted !== true)
    );
  }

  return (
    <div className="container wrapper">
      <header>
        <h1>Todo</h1>
        <div>
          <img
            className="theme-toggle"
            id="theme-toggle"
            src={`./images/icon-${theme === 'light' ? 'sun' : 'moon'}.svg`}
            onClick={toggleTheme}
            alt="theme-toggle"
          />
        </div>
      </header>
      <main>
        <form
          onSubmit={handleAddTask}
          className="input-field list-item"
          id="task-form"
        >
          <div className="input-container">
            <input type="checkbox" readOnly />
            <input
              type="text"
              placeholder="Create a new todo..."
              id="task-input"
              value={tempData}
              onChange={(e) => setTempData(e.target.value)}
            />
          </div>
        </form>
        <div className="list">
          <div className="list-items" id="list-items">
            {tasks.length > 0 &&
              tasks
                .filter(
                  (task) =>
                    filter === 'all' || task.isCompleted === (filter === 'true')
                )
                .map((task, index) => (
                  <div key={index}>
                    <div className="list-item" id="list-item">
                      <div className="input-container">
                        <input
                          type="checkbox"
                          id="checkbox"
                          checked={task.isCompleted}
                          onChange={(e) =>
                            setTasks(
                              tasks.map((item) =>
                                item.id === task.id
                                  ? { ...task, isCompleted: e.target.checked }
                                  : item
                              )
                            )
                          }
                        />
                        <p>{task.task}</p>
                      </div>
                      <div
                        className="delete-btn-container"
                        onClick={() => {
                          deleteTask(task.id);
                        }}
                      >
                        <img
                          className="delete-btn"
                          id="delete-btn"
                          src="./images/icon-cross.svg"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                ))}
          </div>
          <div className="list-total">
            <div>
              <span id="item-left">
                {tasks.filter((task) => task.isCompleted === false).length}
              </span>{' '}
              items left
            </div>
            <div className="filter">
              <Filter filter={filter} setFilter={setFilter} />
            </div>
            <div
              id="clear-completed"
              className="clear-completed"
              onClick={deleteCompletedTasks}
            >
              Clear Completed
            </div>
          </div>
        </div>
        <div className="mobile-filter">
          <Filter filter={filter} setFilter={setFilter} />
        </div>
      </main>

      <footer>
        <div className="attribution">
          Challenge by{' '}
          <a href="https://www.frontendmentor.io?ref=challenge" target="_blank">
            Frontend Mentor
          </a>
          . Coded by <a href="https://github.com/angela-tylee">angelalee</a>.
        </div>
      </footer>
    </div>
  );
};

export default App;
