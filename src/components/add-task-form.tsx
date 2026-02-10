import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

type AddTaskFormProps = {
  onAdd: (task: string) => void;
};

export function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [task, setTask] = useState('');

  const handleSubmit = () => {
    const trimmed = task.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setTask('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Add a new task…"
      />
      <Button type="submit" disabled={!task.trim()}>
        <PlusIcon className="size-4" />
        Add
      </Button>
    </form>
  );
}
