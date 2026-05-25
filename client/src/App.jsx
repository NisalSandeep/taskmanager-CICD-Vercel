import { useEffect, useState } from 'react';

const API = 'http://localhost:3001/api';

export default function App() {
  const [tasks, setTasks]   = useState([]);
  const [input, setInput]   = useState('');

  useEffect(() => {
    fetch(`${API}/tasks`).then(r => r.json()).then(setTasks);
  }, []);

  const addTask = async () => {
    if (!input.trim()) return;
    const res = await fetch(`${API}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: input }),
    });
    const task = await res.json();
    setTasks(prev => [...prev, task]);
    setInput('');
  };

  const toggle = async (id) => {
    const res = await fetch(`${API}/tasks/${id}`, { method: 'PATCH' });
    const updated = await res.json();
    setTasks(prev => prev.map(t => t.id === id ? updated : t));
  };

  return (
    <div style={{ maxWidth: 500, margin: '60px auto', fontFamily: 'sans-serif' }}>
      <h1>📝 Task Manager</h1>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          placeholder="New task..."
          style={{ flex: 1, padding: 8, fontSize: 16 }}
        />
        <button onClick={addTask} style={{ padding: '8px 16px' }}>Add</button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, marginTop: 24 }}>
        {tasks.map(t => (
          <li key={t.id}
            onClick={() => toggle(t.id)}
            style={{
              padding: 12, marginBottom: 8, borderRadius: 6,
              background: t.done ? '#d4edda' : '#f8f9fa',
              cursor: 'pointer', border: '1px solid #dee2e6',
              textDecoration: t.done ? 'line-through' : 'none',
              color: t.done ? '#555' : '#000'
            }}>
            {t.done ? '✅' : '⬜'} {t.title}
          </li>
        ))}
      </ul>
    </div>
  );
}