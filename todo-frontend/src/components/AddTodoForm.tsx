// src/components/AddTodoForm.tsx
import React, { useState } from 'react';
interface AddTodoFormProps { onAddTodo: (title: string) => void; }

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAddTodo }) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoTitle.trim()) {
      onAddTodo(newTodoTitle);
      setNewTodoTitle('');
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input type="text" className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800" placeholder="Thêm công việc mới..." value={newTodoTitle} onChange={(e) => setNewTodoTitle(e.target.value)} />
      <button type="submit" className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">Thêm</button>
    </form>
  );
};
export default AddTodoForm;