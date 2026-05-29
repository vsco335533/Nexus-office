// components/pages/KanbanPage.jsx
import { useState } from 'react';
import * as Icons from 'lucide-react';

const COLS = [
  { id: 'todo', label: 'To Do', color: 'border-t-zinc-500', badge: 'bg-zinc-500/10 text-zinc-400' },
  { id: 'inprogress', label: 'In Progress', color: 'border-t-blue-500', badge: 'bg-blue-500/10 text-blue-400' },
  { id: 'review', label: 'Review', color: 'border-t-yellow-500', badge: 'bg-yellow-500/10 text-yellow-400' },
  { id: 'done', label: 'Done', color: 'border-t-green-500', badge: 'bg-green-500/10 text-green-400' },
];

const SAMPLE_CARDS = [
  { id: 1, col: 'todo', title: 'Research market competitors', tags: ['research'], priority: 'high' },
  { id: 2, col: 'todo', title: 'Design landing page mockup', tags: ['design'], priority: 'medium' },
  { id: 3, col: 'inprogress', title: 'Build authentication system', tags: ['dev'], priority: 'high' },
  { id: 4, col: 'inprogress', title: 'Write API documentation', tags: ['docs'], priority: 'low' },
  { id: 5, col: 'review', title: 'User testing feedback review', tags: ['ux'], priority: 'medium' },
  { id: 6, col: 'done', title: 'Setup project repository', tags: ['dev'], priority: 'low' },
];

const PRIORITY_COLORS = {
  high: 'bg-red-500/10 text-red-400 border border-red-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  low: 'bg-green-500/10 text-green-400 border border-green-500/20',
};

export default function KanbanPage() {
  const [cards, setCards] = useState(SAMPLE_CARDS);
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [addingTo, setAddingTo] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const onDragStart = (e, card) => {
    setDragging(card);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = (e, colId) => {
    e.preventDefault();
    if (!dragging || dragging.col === colId) { setDragging(null); setDragOver(null); return; }
    setCards(prev => prev.map(c => c.id === dragging.id ? { ...c, col: colId } : c));
    setDragging(null);
    setDragOver(null);
  };

  const addCard = (colId) => {
    if (!newTitle.trim()) return;
    setCards(prev => [...prev, {
      id: Date.now(), col: colId,
      title: newTitle.trim(), tags: [], priority: newPriority
    }]);
    setNewTitle('');
    setNewPriority('medium');
    setAddingTo(null);
  };

  const deleteCard = (id) => setCards(prev => prev.filter(c => c.id !== id));

  const startEdit = (card) => { setEditingId(card.id); setEditTitle(card.title); };
  const saveEdit = (id) => {
    if (editTitle.trim()) setCards(prev => prev.map(c => c.id === id ? { ...c, title: editTitle.trim() } : c));
    setEditingId(null);
  };

  const moveCard = (card, direction) => {
    const colIds = COLS.map(c => c.id);
    const idx = colIds.indexOf(card.col);
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= colIds.length) return;
    setCards(prev => prev.map(c => c.id === card.id ? { ...c, col: colIds[newIdx] } : c));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-ash-900 dark:text-white">Kanban Board</h2>
        <p className="text-ash-500 dark:text-ash-400 text-sm mt-0.5">Visualize your workflow. Drag cards between columns.</p>
      </div>

      {/* Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {COLS.map(col => {
          const colCards = cards.filter(c => c.col === col.id);
          return (
            <div
              key={col.id}
              onDragOver={e => { e.preventDefault(); setDragOver(col.id); }}
              onDrop={e => onDrop(e, col.id)}
              className={`rounded-2xl border border-ash-200 dark:border-ash-700 border-t-4 ${col.color} bg-ash-50 dark:bg-ash-800/60 min-h-[200px] transition-all ${dragOver === col.id ? 'ring-2 ring-primary-400 bg-primary-50/20 dark:bg-primary-900/10' : ''}`}
            >
              {/* Column header */}
              <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                <span className="font-semibold text-ash-800 dark:text-white text-sm">{col.label}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.badge}`}>{colCards.length}</span>
              </div>

              {/* Cards */}
              <div className="px-3 pb-2 space-y-2">
                {colCards.map(card => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={e => onDragStart(e, card)}
                    onDragEnd={() => setDragging(null)}
                    className={`bg-white dark:bg-ash-800 rounded-xl border border-ash-200 dark:border-ash-700 p-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-all group ${dragging?.id === card.id ? 'opacity-40 scale-95' : 'hover:-translate-y-0.5'}`}
                  >
                    {editingId === card.id ? (
                      <div className="space-y-2">
                        <textarea value={editTitle} onChange={e => setEditTitle(e.target.value)}
                          className="w-full bg-ash-50 dark:bg-ash-700 rounded-lg px-2 py-1.5 text-sm text-ash-900 dark:text-white outline-none resize-none border border-primary-300 dark:border-primary-600"
                          rows={2} autoFocus />
                        <div className="flex gap-2">
                          <button onClick={() => saveEdit(card.id)} className="text-xs bg-primary-500 text-white px-2 py-1 rounded-lg">Save</button>
                          <button onClick={() => setEditingId(null)} className="text-xs bg-ash-200 dark:bg-ash-600 text-ash-700 dark:text-ash-300 px-2 py-1 rounded-lg">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-ash-900 dark:text-white font-medium leading-snug">{card.title}</p>
                        <div className="flex items-center justify-between mt-2.5">
                          <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${PRIORITY_COLORS[card.priority]}`}>
                            {card.priority}
                          </span>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => moveCard(card, -1)} title="Move left" className="p-1 hover:bg-ash-100 dark:hover:bg-ash-600 rounded-lg transition-colors">
                              <Icons.ChevronLeft className="w-3.5 h-3.5 text-ash-400" />
                            </button>
                            <button onClick={() => moveCard(card, 1)} title="Move right" className="p-1 hover:bg-ash-100 dark:hover:bg-ash-600 rounded-lg transition-colors">
                              <Icons.ChevronRight className="w-3.5 h-3.5 text-ash-400" />
                            </button>
                            <button onClick={() => startEdit(card)} className="p-1 hover:bg-ash-100 dark:hover:bg-ash-600 rounded-lg transition-colors">
                              <Icons.Pencil className="w-3.5 h-3.5 text-ash-400" />
                            </button>
                            <button onClick={() => deleteCard(card.id)} className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                              <Icons.Trash2 className="w-3.5 h-3.5 text-red-400" />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Add card */}
              {addingTo === col.id ? (
                <div className="px-3 pb-3 space-y-2">
                  <textarea value={newTitle} onChange={e => setNewTitle(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addCard(col.id); } if (e.key === 'Escape') { setAddingTo(null); setNewTitle(''); } }}
                    placeholder="Card title… (Enter to add)"
                    className="w-full bg-white dark:bg-ash-700 rounded-xl border border-ash-200 dark:border-ash-600 px-3 py-2 text-sm text-ash-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    rows={2} autoFocus />
                  <select value={newPriority} onChange={e => setNewPriority(e.target.value)}
                    className="w-full bg-white dark:bg-ash-700 border border-ash-200 dark:border-ash-600 rounded-lg px-2 py-1 text-xs text-ash-700 dark:text-ash-300 outline-none">
                    <option value="high">🔴 High Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="low">🟢 Low Priority</option>
                  </select>
                  <div className="flex gap-2">
                    <button onClick={() => addCard(col.id)} className="flex-1 text-xs bg-primary-500 hover:bg-primary-600 text-white py-1.5 rounded-lg font-semibold transition-colors">Add Card</button>
                    <button onClick={() => { setAddingTo(null); setNewTitle(''); }} className="text-xs bg-ash-200 dark:bg-ash-600 hover:bg-ash-300 dark:hover:bg-ash-500 text-ash-700 dark:text-ash-300 px-3 py-1.5 rounded-lg transition-colors">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="px-3 pb-3">
                  <button onClick={() => setAddingTo(col.id)}
                    className="w-full flex items-center gap-2 text-ash-400 dark:text-ash-500 hover:text-ash-700 dark:hover:text-ash-300 py-2 px-3 rounded-xl hover:bg-white dark:hover:bg-ash-700 transition-all text-sm">
                    <Icons.Plus className="w-4 h-4" />
                    Add a card
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
