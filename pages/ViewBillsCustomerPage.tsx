import React, { useState, useEffect, Fragment } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Bill, BillStatus, Payment } from '../types';
import * as storage from '../services/storageService';

const ViewBillsCustomerPage: React.FC = () => {
    const { user } = useAuth();
    const [bills, setBills] = useState<Bill[]>([]);
    const [expandedBillId, setExpandedBillId] = useState<string | null>(null);
    const [paymentModalBill, setPaymentModalBill] = useState<Bill | null>(null);

    useEffect(() => {
        loadBills();
    }, [user]);

    const loadBills = async () => {
        if (user) {
            const allBills = await storage.getBills();
            setBills(allBills.filter(bill => bill.customerId === user.id)
                .sort((a, b) => new Date(b.generationDate).getTime() - new Date(a.generationDate).getTime()));
        }
    };

    const handlePayNow = async (billId: string) => {
        const bill = bills.find(b => b.id === billId);
        if (!bill) return;

        const newPayment: Payment = {
            id: `pay_${new Date().getTime()}`,
            date: new Date().toISOString(),
            amount: bill.amount
        };

        try {
            await storage.updateBill(billId, {
                status: BillStatus.PAID,
                payments: [...(bill.payments || []), newPayment]
            });
            loadBills();
            setPaymentModalBill(null); // Close modal after payment
        } catch (error) {
            console.error("Failed to process payment", error);
        }
    };
    
    const handlePrintBill = (billToPrint: Bill) => {
        if (!user) {
            alert("Could not retrieve user details for printing.");
            return;
        }

        const printWindow = window.open('', '_blank', 'height=800,width=800');

        if (printWindow) {
            const ratePerUnit = billToPrint.unitsConsumed > 0 
                ? (billToPrint.amount / billToPrint.unitsConsumed).toFixed(2) 
                : '0.00';
            
            const dueDate = new Date(billToPrint.generationDate);
            dueDate.setDate(dueDate.getDate() + 15); // Example: Due 15 days from generation

            const invoiceHtml = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Invoice - ${billToPrint.month}</title>
                    <style>
                        body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; margin: 0; padding: 20px; background-color: #f9fafb; color: #111827; }
                        .invoice-box { max-width: 800px; margin: auto; padding: 30px; background: #ffffff; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
                        .header { display: flex; justify-content: space-between; align-items: start; padding-bottom: 20px; border-bottom: 2px solid #f3f4f6; }
                        .header h1 { font-size: 1.8rem; font-weight: 700; color: #1f2937; margin: 0; }
                        .invoice-details { text-align: right; font-size: 0.9rem; color: #4b5563; }
                        .customer-details { padding: 30px 0; }
                        .customer-details h3 { margin-top: 0; font-size: 1rem; color: #6b7280; font-weight: 600; }
                        .bill-table { width: 100%; border-collapse: collapse; }
                        .bill-table th, .bill-table td { padding: 12px 15px; border-bottom: 1px solid #e5e7eb; }
                        .bill-table thead th { background-color: #f9fafb; text-align: left; font-weight: 600; color: #374151; }
                        .bill-table tbody tr:last-child td { border-bottom: none; }
                        .summary { margin-top: 30px; text-align: right; }
                        .summary p { margin: 5px 0; font-size: 1.1rem; }
                        .summary .total { font-weight: 700; font-size: 1.5rem; color: #111827; }
                        .footer { text-align: center; margin-top: 40px; font-size: 0.8rem; color: #6b7280; }
                        @media print {
                            body { background-color: #fff; padding: 0; }
                            .invoice-box { box-shadow: none; border: none; margin: 0; padding: 0; }
                        }
                    </style>
                </head>
                <body>
                    <div class="invoice-box">
                        <div class="header">
                            <h1>Electricity Bill Management System (EBMS)</h1>
                            <div class="invoice-details">
                                <strong>Invoice #:</strong> ${billToPrint.id}<br>
                                <strong>Generated:</strong> ${new Date(billToPrint.generationDate).toLocaleDateString()}<br>
                                <strong>Due By:</strong> ${dueDate.toLocaleDateString()}
                            </div>
                        </div>
                        <div class="customer-details">
                            <h3>BILL TO</h3>
                            <p>
                                <strong>${user.name}</strong><br>
                                ${user.address}<br>
                                ${user.email}<br>
                                Meter Number: ${billToPrint.meterNumber}
                            </p>
                        </div>
                        <table class="bill-table">
                            <thead>
                                <tr>
                                    <th>Billing Period</th>
                                    <th>Units Consumed</th>
                                    <th>Rate (per unit)</th>
                                    <th style="text-align: right;">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>${billToPrint.month}</td>
                                    <td>${billToPrint.unitsConsumed}</td>
                                    <td>₹${ratePerUnit}</td>
                                    <td style="text-align: right;">₹${billToPrint.amount.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="summary">
                            <p>Subtotal: ₹${billToPrint.amount.toFixed(2)}</p>
                            <p class="total">Total Due: ₹${billToPrint.amount.toFixed(2)}</p>
                            <p>Status: <strong>${billToPrint.status}</strong></p>
                        </div>
                        <div class="footer">
                            <p>Thank you for your timely payment.</p>
                        </div>
                    </div>
                </body>
                </html>
            `;
            printWindow.document.write(invoiceHtml);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => printWindow.print(), 500); // Timeout helps ensure styles are loaded
        } else {
            alert("Could not open a new window. Please disable your pop-up blocker.");
        }
    };

    const toggleDetails = (billId: string) => {
        setExpandedBillId(expandedBillId === billId ? null : billId);
    };

    return (
         <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">My Bills</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    <thead className="bg-slate-50 dark:bg-slate-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Month</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                        {bills.length > 0 ? bills.map(bill => (
                            <Fragment key={bill.id}>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap">{bill.month}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">₹{bill.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bill.status === BillStatus.PAID ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {bill.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                            <button onClick={() => toggleDetails(bill.id)} className="w-full sm:w-auto px-3 py-1 text-xs rounded bg-slate-500 hover:bg-slate-600 text-white transition-transform transform hover:scale-105">
                                                {expandedBillId === bill.id ? 'Hide' : 'Details'}
                                            </button>
                                            {bill.status === BillStatus.UNPAID && (
                                                <button onClick={() => setPaymentModalBill(bill)} className="w-full sm:w-auto px-3 py-1 text-xs rounded bg-blue-600 hover:bg-blue-700 text-white transition-transform transform hover:scale-105">Pay Now</button>
                                            )}
                                            <button onClick={() => handlePrintBill(bill)} className="w-full sm:w-auto px-3 py-1 text-xs rounded bg-gray-500 hover:bg-gray-600 text-white transition-transform transform hover:scale-105">Print</button>
                                        </div>
                                    </td>
                                </tr>
                                {expandedBillId === bill.id && (
                                    <tr>
                                        <td colSpan={4} className="p-4 bg-slate-50 dark:bg-slate-900">
                                            <div className="animate-fadeIn">
                                                <h4 className="font-bold text-md mb-2">Bill Details</h4>
                                                <div className="text-sm space-y-1">
                                                    <p><strong>Units Consumed:</strong> {bill.unitsConsumed}</p>
                                                    <p><strong>Generated On:</strong> {new Date(bill.generationDate).toLocaleDateString()}</p>
                                                </div>
                                                <h4 className="font-bold text-md mt-4 mb-2">Payment History</h4>
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
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        )) : (
                            <tr><td colSpan={4} className="text-center py-4">You have no bills.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Payment Confirmation Modal */}
            {paymentModalBill && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fadeIn" aria-modal="true" role="dialog">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-md m-4 animate-scaleIn">
                        <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Confirm Your Payment</h3>
                        <div className="space-y-3 text-slate-700 dark:text-slate-300 border-t border-b border-slate-200 dark:border-slate-700 py-4">
                            <p className="flex justify-between"><span>Month:</span> <span className="font-medium">{paymentModalBill.month}</span></p>
                            <p className="flex justify-between"><span>Units Consumed:</span> <span className="font-medium">{paymentModalBill.unitsConsumed}</span></p>
                             <p className="flex justify-between"><span>Rate per Unit:</span> <span className="font-medium">₹{
                                paymentModalBill.unitsConsumed > 0 
                                ? (paymentModalBill.amount / paymentModalBill.unitsConsumed).toFixed(2)
                                : '0.00'
                             }</span></p>
                            <p className="flex justify-between text-xl font-semibold text-slate-900 dark:text-white mt-2 pt-2 border-t border-slate-200 dark:border-slate-700"><span>Total Amount:</span> <span>₹{paymentModalBill.amount.toFixed(2)}</span></p>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button onClick={() => setPaymentModalBill(null)} className="px-4 py-2 rounded-md bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 text-slate-800 dark:text-slate-200 font-medium transition-colors">
                                Cancel
                            </button>
                            <button onClick={() => handlePayNow(paymentModalBill.id)} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition-transform transform hover:scale-105">
                                Confirm & Pay
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewBillsCustomerPage;