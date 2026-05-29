import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AppStateProvider, useAppState } from '../context/AppState';

function Consumer() {
  const { notes, setNoteContent } = useAppState();
  return (
    <div>
      <button onClick={() => setNoteContent(1, '<p>Updated</p>')}>update</button>
      <div data-testid="note-count">{notes.length}</div>
      <div data-testid="note-1-content">{notes.find(n => n.id === 1)?.content}</div>
    </div>
  );
}

describe('AppState basic', () => {
  it('updates note content', async () => {
    render(<AppStateProvider><Consumer /></AppStateProvider>);
    const btn = screen.getByText('update');
    await act(async () => btn.click());
    const content = screen.getByTestId('note-1-content');
    expect(content.textContent).toContain('Updated');
  });
});
