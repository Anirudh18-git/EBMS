
import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        email: '',
        meterNumber: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            await register({ ...formData });
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError('An error occurred during registration.');
        }
    };

    return (
        <div className="flex justify-center items-center">
            <div className="w-full max-w-lg bg-white dark:bg-slate-800 shadow-2xl rounded-xl p-8 space-y-6">
                <h2 className="text-center text-3xl font-extrabold text-slate-900 dark:text-white">Create your account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {['name', 'address', 'email', 'meterNumber', 'password', 'confirmPassword'].map((field) => (
                        <div key={field}>
                            <label htmlFor={field} className="block text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                            <input 
                                id={field} 
                                name={field} 
                                type={field.includes('password') ? 'password' : 'text'}
                                required 
                                value={formData[field as keyof typeof formData]} 
                                onChange={handleChange} 
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-700" 
                            />
                        </div>
                    ))}
                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                    {success && <p className="text-sm text-green-500 text-center">{success}</p>}
                    <div>
                        <button type="submit" disabled={!!success} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">
                            Register
                        </button>
                    </div>
                </form>
                 <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                    Already have an account? <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
