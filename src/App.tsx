import { PinList } from './components/pin-list';
import { ListCheckIcon } from 'lucide-react';

function App() {
  return (
    <PinList
      items={[
        {
          id: 1,
          name: 'Task 1',
          info: 'Info 1',
          icon: ListCheckIcon,
          pinned: false,
        },
        {
          id: 2,
          name: 'Task 2',
          info: 'Info 2',
          icon: ListCheckIcon,
          pinned: false,
        },
        {
          id: 3,
          name: 'Task 3',
          info: 'Info 3',
          icon: ListCheckIcon,
          pinned: false,
        },
      ]}
      className="p-4 max-w-2xl mx-auto"
    />
  );
}

export default App;
