// src/components/TodoItem.tsx
import React, { useState } from 'react';
interface Todo { id: number; title: string; completed: boolean; }
interface TodoItemProps { todo: Todo; onToggleComplete: (id: number, completed: boolean) => void; onEditTodo: (id: number, newTitle: string) => void; onDeleteTodo: (id: number) => void; }

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onEditTodo, onDeleteTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedTitle.trim()) {
      onEditTodo(todo.id, editedTitle);
      setIsEditing(false);
    }
  };

  return (
    <li className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm mb-3">
      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="flex flex-grow gap-2">
          <input type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-800" />
          <button type="submit" className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">Lưu</button>
          <button type="button" onClick={() => setIsEditing(false)} className="px-3 py-1 bg-gray-400 text-white rounded-lg text-sm hover:bg-gray-500">Hủy</button>
        </form>
      ) : (
        <>
          <div className="flex items-center flex-grow">
            <input type="checkbox" checked={todo.completed} onChange={() => onToggleComplete(todo.id, todo.completed)} className="mr-3 h-5 w-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer" />
            <span className={`text-lg text-gray-800 ${todo.completed ? 'line-through text-gray-500' : ''}`}>{todo.title}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(true)} className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600" title="Chỉnh sửa">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
            <button onClick={() => onDeleteTodo(todo.id)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600" title="Xóa">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </>
      )}
    </li>
  );
};
export default TodoItem;