import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, onValue, remove, update } from 'firebase/database';

interface ExamResultData {
  id: string;
  studentName: string;
  subject: string;
  score: string;
}

export default function ExamResult() {
    const [formData, setFormData] = useState({
        studentName: '',
        subject: '',
        score: '',
    });
    const [results, setResults] = useState<ExamResultData[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof ExamResultData; direction: 'ascending' | 'descending' } | null>(null);

    useEffect(() => {
        const db = getDatabase();
        const resultsRef = ref(db, 'examsresult');
        onValue(resultsRef, (snapshot) => {
            const data = snapshot.val();
            const loadedResults: ExamResultData[] = [];
            for (const key in data) {
                loadedResults.push({
                    id: key,
                    ...data[key]
                });
            }
            setResults(loadedResults);
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const db = getDatabase();
        const examResultsRef = ref(db, 'examsresult');
        if (editingId) {
            update(ref(db, `examsresult/${editingId}`), formData)
                .then(() => {
                    alert('Exam result updated successfully!');
                    setEditingId(null);
                })
                .catch((error) => {
                    console.error('Error updating exam result: ', error);
                    alert('Failed to update exam result. Please try again.');
                });
        } else {
            push(examResultsRef, formData)
                .then(() => {
                    alert('Exam result submitted successfully!');
                })
                .catch((error) => {
                    console.error('Error submitting exam result: ', error);
                    alert('Failed to submit exam result. Please try again.');
                });
        }
        setFormData({ studentName: '', subject: '', score: '' });
    };

    const handleEdit = (result: ExamResultData) => {
        setFormData(result);
        setEditingId(result.id);
    };

    const handleDelete = (id: string) => {
        const db = getDatabase();
        remove(ref(db, `examsresult/${id}`))
            .then(() => {
                alert('Exam result deleted successfully!');
            })
            .catch((error) => {
                console.error('Error deleting exam result: ', error);
                alert('Failed to delete exam result. Please try again.');
            });
    };

    const handleDetail = (result: ExamResultData) => {
        alert(`Details for ${result.studentName}:\nSubject: ${result.subject}\nScore: ${result.score}`);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSort = (key: keyof ExamResultData) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const filteredResults = results.filter(result =>
        result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedResults = [...filteredResults].sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;
        if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
        return 0;
    });

    return (
        <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-blue-500 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-xl p-8 mb-8 transform hover:scale-105 transition-transform duration-300">
                    <h1 className="text-4xl font-bold mb-6 text-center text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Exam Result Manager</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="studentName" className="block text-sm font-medium text-gray-700">Student Name</label>
                            <input
                                type="text"
                                id="studentName"
                                name="studentName"
                                value={formData.studentName}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition duration-300"
                            />
                        </div>
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition duration-300"
                            />
                        </div>
                        <div>
                            <label htmlFor="score" className="block text-sm font-medium text-gray-700">Score</label>
                            <input
                                type="number"
                                id="score"
                                name="score"
                                value={formData.score}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition duration-300"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                        >
                            {editingId ? 'Update Result' : 'Submit Result'}
                        </button>
                    </form>
                </div>
                
                <div className="bg-white rounded-lg shadow-xl p-8 transform hover:scale-105 transition-transform duration-300">
                    <h2 className="text-3xl font-bold mb-4 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">Exam Results</h2>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search by name or subject"
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full px-3 py-2 placeholder-gray-400 border rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th onClick={() => handleSort('studentName')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">Student Name</th>
                                    <th onClick={() => handleSort('subject')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">Subject</th>
                                    <th onClick={() => handleSort('score')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">Score</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-dark divide-y divide-gray-200">
                                {sortedResults.map((result) => (
                                    <tr key={result.id} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap">{result.studentName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{result.subject}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{result.score}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button onClick={() => handleEdit(result)} className="text-indigo-600 hover:text-indigo-900 mr-2 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110">Edit</button>
                                            <button onClick={() => handleDelete(result.id)} className="text-red-600 hover:text-red-900 mr-2 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110">Delete</button>
                                            <button onClick={() => handleDetail(result)} className="text-green-600 hover:text-green-900 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110">Detail</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}