import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface TodoItem {
    id: number;
    title: string;
    description: string;
    isActive: boolean;
    time: string;
    filePath?: string;
}

const Todo: React.FC = () => {
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [time, setTime] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchTodos = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/todo?page=${page}&limit=5`);
            if (response.data && Array.isArray(response.data.data)) {
                setTodos(response.data.data);
                setTotalPages(Math.ceil(response.data.total / 5));
            } else {
                setTodos([]);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    navigate('/');
                } else {
                    setError(error.message || 'Failed to fetch todos');
                }
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, [page]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', desc);
            formData.append('time', new Date(time).toISOString());
            formData.append('isActive', 'true');
            if (file) {
                formData.append('file', file);
            }

            await api.post('/todo', formData);
            setTitle('');
            setDesc('');
            setTime('');
            setFile(null);
            fetchTodos();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || 'Failed to create todo');
            } else {
                setError('Failed to create todo');
            }
        }
    };

    const handleDelete = async (id: number) => {
        setError(null);
        try {
            await api.delete(`/todo/${id}`);
            fetchTodos();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || 'Failed to delete todo');
            } else {
                setError('Failed to delete todo');
            }
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

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Error! </strong>
                        <span className="block sm:inline">{error}</span>
                        <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
                            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                        </span>
                    </div>
                )}

                <form onSubmit={handleCreate} className="bg-white p-6 rounded-lg shadow-sm mb-8 flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4">
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
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="datetime-local"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-md transition duration-200"
                        >
                            Add Todo
                        </button>
                    </div>
                </form>

                {loading && <p className="text-center text-gray-500">Loading todos...</p>}

                <ul className="space-y-4 mb-8">
                    {Array.isArray(todos) && todos.map((todo) => (
                        <li
                            key={todo.id}
                            className={`bg-white p-6 rounded-lg shadow-sm flex justify-between items-start border-l-4 ${todo.isActive ? 'border-green-500' : 'border-red-500'
                                }`}
                        >
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{todo.title}</h3>
                                <p className="text-gray-600">{todo.description}</p>
                                {todo.filePath && (
                                    <div className="mt-2">
                                        <a
                                            href={`${import.meta.env.VITE_API_URL}/${todo.filePath}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline text-sm flex items-center gap-1"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                            </svg>
                                            View Attachment
                                        </a>
                                    </div>
                                )}
                                <div className="mt-2 text-sm">
                                    <span className={`font-semibold ${todo.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                        {todo.isActive ? 'Active' : 'Expired/Inactive'}
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

                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2">Page {page} of {totalPages}</span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Todo;
