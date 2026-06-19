import '@testing-library/jest-dom'; // Fixes "toBeInTheDocument" error
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import App from './App';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// jsdom doesn't implement these; Radix's AlertDialog calls them internally
// for pointer-capture and focus-scroll handling during open/close.
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = vi.fn(() => false);
}
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = vi.fn();
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = vi.fn();
}
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn();
}

describe('Todo App', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    // Mock Fetch API
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    } as Response);
  });

  it('loads and displays tasks saved in LocalStorage', () => {
    const savedTasks = [
      { id: 1, title: 'Buy milk', completed: false, userId: 1 },
      { id: 2, title: 'Walk dog', completed: true, userId: 1 },
    ];
    localStorage.setItem('task-board-tasks', JSON.stringify(savedTasks));

    render(<App />);

    expect(screen.getByText('Buy milk')).toBeInTheDocument();
    expect(screen.getByText('Walk dog')).toBeInTheDocument();
  });

  it('adds a new task to the list', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText('Add a new task…');
    const addButton = screen.getByRole('button', { name: /add/i });

    await user.type(input, 'New Feature');
    await user.click(addButton);

    expect(await screen.findByText('New Feature')).toBeInTheDocument();
  });

  it('filters tasks correctly', async () => {
    const tasks = [
      { id: 1, title: 'Active Task', completed: false, userId: 1 },
      { id: 2, title: 'Completed Task', completed: true, userId: 1 },
    ];
    localStorage.setItem('task-board-tasks', JSON.stringify(tasks));

    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Completed' }));
    expect(screen.getByText('Completed Task')).toBeInTheDocument();
    expect(screen.queryByText('Active Task')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Incomplete' }));
    expect(screen.getByText('Active Task')).toBeInTheDocument();
    expect(screen.queryByText('Completed Task')).not.toBeInTheDocument();
  });

  it('deletes a task after confirming in the alert dialog', async () => {
    const savedTasks = [
      { id: 1, title: 'Buy milk', completed: false, userId: 1 },
    ];
    localStorage.setItem('task-board-tasks', JSON.stringify(savedTasks));

    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText('Buy milk')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /delete buy milk/i }));
    expect(await screen.findByRole('alertdialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^delete$/i }));

    expect(screen.queryByText('Buy milk')).not.toBeInTheDocument();
  });

  it('keeps the task when canceling the delete confirmation', async () => {
    const savedTasks = [
      { id: 1, title: 'Buy milk', completed: false, userId: 1 },
    ];
    localStorage.setItem('task-board-tasks', JSON.stringify(savedTasks));

    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /delete buy milk/i }));
    expect(await screen.findByRole('alertdialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(screen.getByText('Buy milk')).toBeInTheDocument();
  });

  it('does not toggle task completion when opening or canceling the delete dialog', async () => {
    const savedTasks = [
      { id: 1, title: 'Buy milk', completed: false, userId: 1 },
    ];
    localStorage.setItem('task-board-tasks', JSON.stringify(savedTasks));

    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /delete buy milk/i }));
    await user.click(screen.getByRole('button', { name: /cancel/i }));

    // "Completed" only appears as the filter button when no task is completed;
    // a toggle bug would add the section label + the task's status text too.
    expect(screen.getAllByText('Completed')).toHaveLength(1);
    expect(screen.getByText('Buy milk')).toBeInTheDocument();
  });
});
