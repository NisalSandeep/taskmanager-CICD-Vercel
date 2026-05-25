import { useEffect, useState } from 'react';
import './TaskManager.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch(`${API}/tasks`)
      .then(r => r.json())
      .then(data => mounted && setTasks(data))
      .catch(() => mounted && setTasks([]))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  const addTask = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const title = input.trim();
    if (!title) return;
    try {
      const res = await fetch(`${API}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      const task = await res.json();
      setTasks(prev => [...prev, task]);
      setInput('');
    } catch (err) {
      console.error('Add task failed', err);
    }
  };

  const toggle = async (id) => {
    try {
      const res = await fetch(`${API}/tasks/${id}`, { method: 'PATCH' });
      const updated = await res.json();
      setTasks(prev => prev.map(t => (t.id === id ? updated : t)));
    } catch (err) {
      console.error('Toggle failed', err);
    }
  };

  return (
    <div className="tm-root">
      <header className="tm-header">
        <h1 className="tm-title">Task Manager</h1>
        <p className="tm-sub">Small, fast, and accessible</p>
      </header>

      <main className="tm-main">
        <form className="tm-form" onSubmit={addTask} aria-label="Add task">
          <label htmlFor="new-task" className="visually-hidden">New task</label>
          <input
            id="new-task"
            className="tm-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="What needs to be done?"
            aria-label="New task"
          />
          <button type="submit" className="tm-btn">Add</button>
        </form>

        {loading ? (
          <p className="tm-empty">Loading tasks…</p>
        ) : (
          <ul className="tm-list" role="list">
            {tasks.length === 0 && <li className="tm-empty">No tasks yet — add one above.</li>}
            {tasks.map(t => (
              <li key={t.id} className="tm-item">
                <button
                  className={`tm-toggle ${t.done ? 'done' : ''}`}
                  onClick={() => toggle(t.id)}
                  aria-pressed={t.done}
                >
                  <span className="tm-check" aria-hidden>{t.done ? '✅' : '◻️'}</span>
                  <span className="tm-title-text">{t.title}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}