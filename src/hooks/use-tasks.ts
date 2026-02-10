import { useState, useEffect, useCallback } from 'react';
import { type Todo, fetchTodos } from '@/api';

const STORAGE_KEY = 'task-board-tasks';

function loadFromStorage(): Todo[] | undefined {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw) as Todo[];
}

function saveToStorage(tasks: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export type Filter = 'all' | 'completed' | 'incomplete';

export function useTasks() {
  const [cachedTasks] = useState(() => loadFromStorage());
  const [tasks, setTasks] = useState<Todo[]>(cachedTasks ?? []);
  const [filter, setFilter] = useState<Filter>('all');
  const [isLoading, setIsLoading] = useState(!cachedTasks?.length);
  const [error, setError] = useState<string | null>(null);

  // Fetch from API only if localStorage is empty
  useEffect(() => {
    if (cachedTasks?.length) {
      return;
    }

    fetchTodos()
      .then((data) => {
        setTasks(data);
        saveToStorage(data);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
      })
      .finally(() => setIsLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist to localStorage on every change
  useEffect(() => {
    saveToStorage(tasks);
  }, [tasks]);

  const toggleTask = useCallback((id: number) => {
    setTasks((currentTasks) => {
      return currentTasks.map((task) => {
        if (task.id === id) {
          return { ...task, completed: !task.completed };
        }
        return task;
      });
    });
  }, []);

  const addTask = useCallback((title: string) => {
    const newTask: Todo = {
      id: Date.now(),
      userId: 0,
      title,
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
  }, []);

  const resetTasks = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setTasks([]);
  }, []);

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'completed') return t.completed;
    if (filter === 'incomplete') return !t.completed;
    return true;
  });

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    filter,
    setFilter,
    toggleTask,
    addTask,
    resetTasks,
    isLoading,
    error,
  };
}
