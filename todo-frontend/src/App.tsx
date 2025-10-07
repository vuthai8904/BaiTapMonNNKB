// src/App.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import TodoItem from './components/TodoItem';
import AddTodoForm from './components/AddTodoForm';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const API_URL = 'http://localhost:4000/api/todos';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(API_URL);
      const fetchedTodos = res.data.data.map((todo: any) => ({
        ...todo,
        completed: Boolean(todo.completed)
      }));
      setTodos(fetchedTodos);
    } catch (error) {
      console.error("Lỗi khi tải todos:", error);
    }
  };

  const addTodo = async (title: string) => {
    try {
      const res = await axios.post(API_URL, { title });
      setTodos([res.data.data, ...todos]);
    } catch (error) {
      console.error("Lỗi khi thêm todo:", error);
    }
  };
  
  const toggleComplete = async (id: number, completed: boolean) => {
    try {
      await axios.put(`${API_URL}/${id}`, { completed: !completed });
      setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    } catch (error) {
      console.error("Lỗi khi cập nhật todo:", error);
    }
  };

  const editTodo = async (id: number, newTitle: string) => {
    try {
      await axios.put(`${API_URL}/${id}`, { title: newTitle });
      setTodos(todos.map(t => t.id === id ? { ...t, title: newTitle } : t));
    } catch (error) {
      console.error("Lỗi khi sửa todo:", error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter(t => t.id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa todo:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Todo App</h1>
        <AddTodoForm onAddTodo={addTodo} />
        <div className="mt-6">
          {todos.length === 0 ? (
            <p className="text-center text-gray-500">Chưa có công việc nào.</p>
          ) : (
            <ul>
              {todos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggleComplete={toggleComplete}
                  onEditTodo={editTodo}
                  onDeleteTodo={deleteTodo}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;