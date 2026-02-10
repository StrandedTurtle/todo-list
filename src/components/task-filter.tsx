import { Button } from '@/components/ui/button';
import type { Filter } from '@/hooks/use-tasks';

type TaskFilterProps = {
  current: Filter;
  onChange: (filter: Filter) => void;
};

const filters: { label: string; value: Filter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Completed', value: 'completed' },
  { label: 'Incomplete', value: 'incomplete' },
];

export function TaskFilter({ current, onChange }: TaskFilterProps) {
  return (
    <div className="flex gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={current === filter.value ? 'default' : 'outline'}
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}
