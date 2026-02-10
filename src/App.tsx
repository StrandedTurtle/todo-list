import { useTasks } from '@/hooks/use-tasks';
import { TaskList } from '@/components/task-list';
import { TaskFilter } from '@/components/task-filter';
import { AddTaskForm } from '@/components/add-task-form';
import { Button } from './components/ui/button';
import { AnimatedThemeToggler } from './components/ui/animated-theme-toggler';

export default function App() {
  const {
    tasks,
    filter,
    setFilter,
    toggleTask,
    addTask,
    resetTasks,
    isLoading,
    error,
  } = useTasks();

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Todo List</h1>
          <AnimatedThemeToggler />
        </div>
        <Button onClick={resetTasks} variant="destructive" size="sm">
          Reset Board
        </Button>
      </div>
      <AddTaskForm onAdd={addTask} />
      <TaskFilter current={filter} onChange={setFilter} />
      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        error={error}
        onToggle={toggleTask}
      />
    </div>
  );
}
