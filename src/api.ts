export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export const fetchTodos = async (): Promise<Todo[]> => {
  const res = await fetch(
    'https://jsonplaceholder.typicode.com/todos?_limit=15'
  );
  if (!res.ok) throw new Error('Failed to fetch');

  const response = await res.json();

  console.log(response);

  return response;
};
