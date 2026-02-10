import { ListCheckIcon } from 'lucide-react';
import { PinList, type PinListItem } from '@/components/pin-list';
import type { Todo } from '@/api';
import { Skeleton } from '@/components/ui/skeleton';

type TaskListProps = {
  tasks: Todo[];
  isLoading: boolean;
  error: string | null;
  onToggle: (id: number) => void;
};

export function TaskList({ tasks, isLoading, error, onToggle }: TaskListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-100 dark:bg-red-900/30 p-4 text-red-700 dark:text-red-300 text-sm">
        <p className="font-semibold">Failed to load tasks</p>
        <p>{error}</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-8">
        No tasks to show.
      </p>
    );
  }

  const pinListItems: PinListItem[] = tasks.map((task) => ({
    id: task.id,
    name: task.title,
    info: task.completed ? 'Completed' : 'Incomplete',
    icon: ListCheckIcon,
    pinned: task.completed,
  }));

  return (
    <PinList
      items={pinListItems}
      labels={{ pinned: 'Completed', unpinned: 'Incomplete' }}
      onItemToggle={onToggle}
    />
  );
}
