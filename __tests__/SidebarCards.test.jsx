import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AppStateProvider, useAppState } from '../context/AppState';
import SidebarCards from '../components/SidebarCards';

function Status() {
  const { activeView, selectedNoteId } = useAppState();
  return (<div>
    <div data-testid="active">{activeView}</div>
    <div data-testid="selected">{selectedNoteId ?? 'none'}</div>
  </div>);
}

describe('SidebarCards interactions', () => {
  it('selects a recent note and sets active to editor', () => {
    render(<AppStateProvider><SidebarCards /><Status /></AppStateProvider>);
    const btn = screen.getAllByRole('button').find(b => b.textContent && b.textContent.includes('Project Ideas'));
    expect(btn).toBeTruthy();
    fireEvent.click(btn);
    expect(screen.getByTestId('active').textContent).toBe('editor');
    expect(screen.getByTestId('selected').textContent).not.toBe('none');
  });
});
