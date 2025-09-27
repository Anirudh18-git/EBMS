
import React, { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types';

const ProfilePage: React.FC = () => {
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<User>>({});
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                address: user.address,
                email: user.email
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        updateProfile(formData);
        setIsEditing(false);
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
    };

    if (!user) return <p>Loading profile...</p>;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">My Profile</h2>
                    {!isEditing && <button onClick={() => setIsEditing(true)} className="text-sm font-medium text-blue-600 hover:text-blue-500">Edit</button>}
                </div>

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
                            <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-700" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Address</label>
                            <input type="text" name="address" value={formData.address || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-700" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                            <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-700" />
                        </div>
                        <div className="flex justify-end space-x-2">
                           <button type="button" onClick={() => setIsEditing(false)} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
                           <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Save</button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        {success && <p className="text-sm text-green-500 text-center bg-green-50 dark:bg-green-900/50 p-3 rounded-md">{success}</p>}
                        <div className="border-b dark:border-slate-700 pb-2">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Name</p>
                            <p className="font-medium">{user.name}</p>
                        </div>
                         <div className="border-b dark:border-slate-700 pb-2">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Meter Number</p>
                            <p className="font-medium">{user.meterNumber}</p>
                        </div>
                         <div className="border-b dark:border-slate-700 pb-2">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Address</p>
                            <p className="font-medium">{user.address}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                            <p className="font-medium">{user.email}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
