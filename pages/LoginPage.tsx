import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';

const LoginPage: React.FC = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const user = await login(identifier, password, role);
            if (user) {
                if(user.role === UserRole.ADMIN) {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/customer/dashboard');
                }
            } else {
                setError('Invalid credentials. Please try again.');
            }
        } catch (err) {
            setError('An error occurred during login.');
        }
    };

    return (
        <div className="flex justify-center items-center">
            <div className="w-full max-w-md bg-white dark:bg-slate-800 shadow-2xl rounded-xl p-8 space-y-6 animate-scaleIn">
                <h2 className="text-center text-3xl font-extrabold text-slate-900 dark:text-white">Sign in to your account</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Login as</label>
                        <div className="flex rounded-md shadow-sm">
                            <button type="button" onClick={() => setRole(UserRole.CUSTOMER)} className={`flex-1 py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-l-md text-sm font-medium transition-colors ${role === UserRole.CUSTOMER ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-700'}`}>Customer</button>
                            <button type="button" onClick={() => setRole(UserRole.ADMIN)} className={`flex-1 py-2 px-4 border-t border-b border-r border-slate-300 dark:border-slate-600 rounded-r-md text-sm font-medium transition-colors ${role === UserRole.ADMIN ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-700'}`}>Admin</button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="identifier" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{role === UserRole.CUSTOMER ? 'Email / Meter No.' : 'Email'}</label>
                        <div className="mt-1">
                            <input id="identifier" name="identifier" type="text" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-700"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                        <div className="mt-1">
                            <input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-700"/>
                        </div>
                    </div>
                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                    <div>
                        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105">
                            Sign in
                        </button>
                    </div>
                </form>

                {role === UserRole.ADMIN && (
                    <div className="text-center text-xs text-slate-500 dark:text-slate-400 bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 p-3 rounded-lg">
                        <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-1">Admin Demo Access</h4>
                        <p>Email: <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-800 dark:text-slate-200">admin@system.com</code></p>
                        <p>Password: <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-800 dark:text-slate-200">admin</code></p>
                    </div>
                )}

                <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                    Not a member? <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;