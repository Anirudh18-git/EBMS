
import React, { useState, FormEvent, useEffect } from 'react';
import { User, UserRole, Bill, BillStatus } from '../types';
import * as storage from '../services/storageService';

const GenerateBillPage: React.FC = () => {
    const [customers, setCustomers] = useState<User[]>([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [month, setMonth] = useState('');
    const [units, setUnits] = useState('');
    const [generatedBill, setGeneratedBill] = useState<Bill | null>(null);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const allUsers = storage.getUsers();
        setCustomers(allUsers.filter(u => u.role === UserRole.CUSTOMER));
    }, []);

    const calculateBill = (unitsConsumed: number): number => {
        let amount = 0;
        if (unitsConsumed <= 100) {
            amount = unitsConsumed * 5;
        } else if (unitsConsumed <= 200) {
            amount = (100 * 5) + ((unitsConsumed - 100) * 7);
        } else {
            amount = (100 * 5) + (100 * 7) + ((unitsConsumed - 200) * 10);
        }
        return amount;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setSuccess('');
        const customer = customers.find(c => c.id === selectedCustomerId);
        if (!customer || !month || !units) {
            return;
        }

        const unitsConsumed = parseInt(units, 10);
        const amount = calculateBill(unitsConsumed);

        const newBill: Bill = {
            id: `bill_${new Date().getTime()}`,
            customerId: customer.id,
            customerName: customer.name,
            meterNumber: customer.meterNumber,
            month,
            unitsConsumed,
            amount,
            status: BillStatus.UNPAID,
            generationDate: new Date().toISOString()
        };
        
        storage.addBill(newBill);
        setGeneratedBill(newBill);
        setSuccess('Bill generated and saved successfully!');
        setSelectedCustomerId('');
        setMonth('');
        setUnits('');
        setTimeout(() => setSuccess(''), 4000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Generate Customer Bill</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="customer" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Customer</label>
                        <select id="customer" value={selectedCustomerId} onChange={e => setSelectedCustomerId(e.target.value)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-slate-700">
                            <option value="">Select a customer</option>
                            {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.meterNumber})</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="month" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Month</label>
                        <input type="month" id="month" value={month} onChange={e => setMonth(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-700"/>
                    </div>
                    <div>
                        <label htmlFor="units" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Units Consumed</label>
                        <input type="number" id="units" value={units} min="0" onChange={e => setUnits(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-700"/>
                    </div>
                    <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Calculate & Generate Bill</button>
                </form>
            </div>

            {generatedBill && (
                 <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">Bill Summary</h2>
                    <div className="space-y-3">
                        <p><strong>Customer:</strong> {generatedBill.customerName}</p>
                        <p><strong>Month:</strong> {generatedBill.month}</p>
                        <p><strong>Units Consumed:</strong> {generatedBill.unitsConsumed}</p>
                        <p className="text-2xl font-bold"><strong>Amount:</strong> ₹{generatedBill.amount.toFixed(2)}</p>
                        <p><strong>Status:</strong> <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{generatedBill.status}</span></p>
                    </div>
                    {success && <p className="mt-4 text-sm text-green-500 text-center">{success}</p>}
                </div>
            )}
        </div>
    );
};

export default GenerateBillPage;
