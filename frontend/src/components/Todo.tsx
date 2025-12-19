import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface TodoItem {
    id: number;
    title: string;
    description: string;
    is_active: boolean;
    time: string;
}

const Todo: React.FC = () => {
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [time, setTime] = useState('');
    const navigate = useNavigate();

    const fetchTodos = async () => {
        try {
            const response = await api.get('/todo');
            setTodos(response.data);
        } catch (error) {
            console.error(error);
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                navigate('/');
            }
        }
    };

    useEffect(() => {
        fetchTodos();
        const interval = setInterval(fetchTodos, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/todo', {
                title,
                description: desc,
                time: new Date(time).toISOString(),
                is_active: true
            });
            setTitle('');
            setDesc('');
            setTime('');
            fetchTodos();
        } catch (error) {
            alert('Failed to create todo');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/todo/${id}`);
            fetchTodos();
        } catch (error) {
            alert('Failed to delete todo');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Todo Management</h2>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-200"
                    >
                        Logout
                    </button>
                </div>

                <form onSubmit={handleCreate} className="bg-white p-6 rounded-lg shadow-sm mb-8 flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="datetime-local"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-md transition duration-200"
                    >
                        Add Todo
                    </button>
                </form>

                <ul className="space-y-4">
                    {todos.map((todo) => (
                        <li
                            key={todo.id}
                            className={`bg-white p-6 rounded-lg shadow-sm flex justify-between items-center border-l-4 ${todo.is_active ? 'border-green-500' : 'border-red-500'
                                }`}
                        >
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{todo.title}</h3>
                                <p className="text-gray-600">{todo.description}</p>
                                <div className="mt-2 text-sm">
                                    <span className={`font-semibold ${todo.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                        {todo.is_active ? 'Active' : 'Expired/Inactive'}
                                    </span>
                                    <span className="text-gray-400 mx-2">•</span>
                                    <span className="text-gray-500">Expires: {new Date(todo.time).toLocaleString()}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(todo.id)}
                                className="ml-4 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition duration-200"
                                title="Delete"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Todo;
