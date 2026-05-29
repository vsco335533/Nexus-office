// components/pages/TodoPage.jsx
import { useState } from 'react';
import { useAppState } from '../../context/AppState';
import * as Icons from 'lucide-react';

export default function TodoPage() {
  const { notes, setNotes, createNewNote, setActive } = useAppState();

  // Use a dedicated "todo" category for notes
  const todos = notes.filter(n => n.category === 'todo' && !n.trashed);

  const [newText, setNewText] = useState('');
  const [filter, setFilter] = useState('all'); // all | active | completed

  const addTodo = () => {
    if (!newText.trim()) return;
    const id = Date.now();
    setNotes(prev => [{
      id, title: newText.trim(), content: newText.trim(),
      starred: false, shared: false, project: null, tags: [],
      archived: false, trashed: false, category: 'todo',
      completed: false, createdAt: new Date().toISOString()
    }, ...prev]);
    setNewText('');
  };

  const toggleDone = (id) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, completed: !n.completed } : n));
  };

  const deleteTodo = (id) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, trashed: true } : n));
  };

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const clearCompleted = () => {
    setNotes(prev => prev.map(n => (n.category === 'todo' && n.completed) ? { ...n, trashed: true } : n));
  };

  const doneCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-ash-900 dark:text-white">Todo Lists</h2>
          <p className="text-ash-500 dark:text-ash-400 text-sm mt-0.5">
            {doneCount} of {totalCount} tasks completed
          </p>
        </div>
        {doneCount > 0 && (
          <button onClick={clearCompleted}
            className="text-xs text-ash-500 hover:text-red-500 dark:text-ash-400 dark:hover:text-red-400 transition-colors">
            Clear completed
          </button>
        )}
      </div>

      {/* Progress bar */}
      {totalCount > 0 && (
        <div className="h-2 bg-ash-200 dark:bg-ash-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
            style={{ width: `${totalCount ? (doneCount / totalCount) * 100 : 0}%` }}
          />
        </div>
      )}

      {/* Input */}
      <div className="flex gap-3">
        <input
          value={newText}
          onChange={e => setNewText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="Add a new task… (press Enter)"
          className="flex-1 bg-white dark:bg-ash-800 border border-ash-200 dark:border-ash-700 rounded-xl px-4 py-3 text-ash-900 dark:text-white placeholder-ash-400 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
        />
        <button onClick={addTodo}
          className="px-5 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:scale-[1.02] transition-all shadow-lg">
          <Icons.Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {['all', 'active', 'completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-primary-500 text-white' : 'bg-ash-100 dark:bg-ash-700 text-ash-600 dark:text-ash-300 hover:bg-ash-200 dark:hover:bg-ash-600'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Todo list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-ash-400 dark:text-ash-600">
            <Icons.CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">{filter === 'completed' ? 'No completed tasks yet' : filter === 'active' ? 'All done! 🎉' : 'No tasks yet. Add one above!'}</p>
          </div>
        ) : (
          filtered.map(todo => (
            <div key={todo.id}
              className={`flex items-center gap-3 bg-white dark:bg-ash-800 border rounded-xl px-4 py-3.5 group transition-all ${todo.completed ? 'border-ash-100 dark:border-ash-700 opacity-60' : 'border-ash-200 dark:border-ash-700 hover:border-primary-300 dark:hover:border-primary-700'}`}>
              <button onClick={() => toggleDone(todo.id)}
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${todo.completed ? 'bg-primary-500 border-primary-500' : 'border-ash-300 dark:border-ash-500 hover:border-primary-400'}`}>
                {todo.completed && <Icons.Check className="w-3 h-3 text-white" />}
              </button>
              <span className={`flex-1 text-sm ${todo.completed ? 'line-through text-ash-400 dark:text-ash-500' : 'text-ash-900 dark:text-white'}`}>
                {todo.title}
              </span>
              <button onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-ash-400 hover:text-red-500 dark:text-ash-500 dark:hover:text-red-400">
                <Icons.Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
