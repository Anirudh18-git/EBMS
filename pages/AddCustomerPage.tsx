
import React, { useState, FormEvent, useEffect } from 'react';
import { User, UserRole } from '../types';
import * as storage from '../services/storageService';

const AddCustomerPage: React.FC = () => {
    const [customers, setCustomers] = useState<User[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        meterNumber: '',
        email: '',
    });
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        const allUsers = await storage.getUsers();
        setCustomers(allUsers.filter(u => u.role === UserRole.CUSTOMER));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const newCustomer: User = {
            id: `user_${new Date().getTime()}`,
            ...formData,
            role: UserRole.CUSTOMER,
            password: 'password123' // Default password, user should change it
        };
        await storage.addUser(newCustomer);
        setSuccess(`Customer "${formData.name}" added successfully!`);
        setFormData({ name: '', address: '', meterNumber: '', email: '' });
        await loadCustomers();
        setTimeout(() => setSuccess(''), 3000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">Add New Customer</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {['name', 'address', 'meterNumber', 'email'].map(field => (
                             <div key={field}>
                                <label htmlFor={field} className="block text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                                <input id={field} name={field} type="text" required value={formData[field as keyof typeof formData]} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-700" />
                            </div>
                        ))}
                        <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Add Customer</button>
                    </form>
                    {success && <p className="mt-4 text-sm text-green-500 text-center">{success}</p>}
                </div>
            </div>
            <div className="lg:col-span-2">
                <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">Customer List</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                            <thead className="bg-slate-50 dark:bg-slate-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Meter No.</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Email</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Address</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                {customers.length > 0 ? customers.map(customer => (
                                    <tr key={customer.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{customer.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{customer.meterNumber}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{customer.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{customer.address}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={4} className="text-center py-4">No customers found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCustomerPage;
