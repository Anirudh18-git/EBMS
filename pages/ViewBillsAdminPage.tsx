import React, { useState, useEffect } from 'react';
import { Bill, BillStatus, Payment } from '../types';
import * as storage from '../services/storageService';

const ViewBillsAdminPage: React.FC = () => {
    const [bills, setBills] = useState<Bill[]>([]);
    const [expandedBillId, setExpandedBillId] = useState<string | null>(null);

    useEffect(() => {
        loadBills();
    }, []);

    const loadBills = async () => {
        const allBills = await storage.getBills();
        setBills(allBills.sort((a,b) => new Date(b.generationDate).getTime() - new Date(a.generationDate).getTime()));
    };

    const handleToggleStatus = async (billId: string) => {
        const bill = bills.find(b => b.id === billId);
        if (!bill) return;

        const isNowPaid = bill.status === BillStatus.UNPAID;
        const newStatus = isNowPaid ? BillStatus.PAID : BillStatus.UNPAID;

        let newPayments: Payment[] = bill.payments || [];
        if (isNowPaid) {
            newPayments = [...newPayments, {
                id: `pay_${new Date().getTime()}`,
                date: new Date().toISOString(),
                amount: bill.amount,
            }];
        } else {
            newPayments = []; // Clear payments if marked as unpaid
        }

        try {
            await storage.updateBill(billId, { status: newStatus, payments: newPayments });
            loadBills();
        } catch (error) {
            console.error("Failed to update bill status", error);
        }
    };

    const toggleDetails = (billId: string) => {
        setExpandedBillId(expandedBillId === billId ? null : billId);
    };

    return (
        <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">All Customer Bills</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    <thead className="bg-slate-50 dark:bg-slate-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Meter No.</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Month</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                        {bills.length > 0 ? bills.flatMap(bill => [
                            <tr key={bill.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{bill.customerName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{bill.meterNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{bill.month}</td>
                                <td className="px-6 py-4 whitespace-nowrap">₹{bill.amount.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bill.status === BillStatus.PAID ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {bill.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                        <button onClick={() => toggleDetails(bill.id)} className="w-full sm:w-auto px-3 py-1 text-xs rounded bg-slate-500 hover:bg-slate-600 text-white">
                                            {expandedBillId === bill.id ? 'Hide' : 'Details'}
                                        </button>
                                        <button onClick={() => handleToggleStatus(bill.id)} className={`w-full sm:w-auto px-3 py-1 text-xs rounded ${bill.status === BillStatus.UNPAID ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white`}>
                                            Mark as {bill.status === BillStatus.UNPAID ? 'Paid' : 'Unpaid'}
                                        </button>
                                    </div>
                                </td>
                            </tr>,
                            expandedBillId === bill.id && (
                                <tr key={`${bill.id}-details`}>
                                    <td colSpan={6} className="p-4 bg-slate-50 dark:bg-slate-900">
                                        <h4 className="font-bold text-md mb-2">Payment History</h4>
                                        {bill.payments && bill.payments.length > 0 ? (
                                            <ul className="list-disc pl-5">
                                                {bill.payments.map(payment => (
                                                        <li key={payment.id} className="text-sm">
                                                        Paid ₹{payment.amount.toFixed(2)} on {new Date(payment.date).toLocaleString()}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-slate-500">No payment history found for this bill.</p>
                                        )}
                                    </td>
                                </tr>
                            )
                        ]) : (
                           <tr><td colSpan={6} className="text-center py-4">No bills found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewBillsAdminPage;