import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    
    const cardData = [
        { to: "/admin/add-customer", title: "Manage Customers", description: "Add new customers and view existing ones.", icon: "👥" },
        { to: "/admin/generate-bill", title: "Generate Bill", description: "Calculate and create new electricity bills.", icon: "🧾" },
        { to: "/admin/view-bills", title: "View All Bills", description: "Browse, update, and manage all bills.", icon: "📊" },
    ];

    const Card: React.FC<{ to: string, title: string, description: string, icon: string, delay: number }> = ({ to, title, description, icon, delay }) => (
        <Link to={to} className="block bg-white dark:bg-slate-800 shadow-lg rounded-xl p-6 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl animate-fadeInUp" style={{ animationDelay: `${delay}ms` }}>
            <div className="flex items-center space-x-4">
                <div className="text-4xl">{icon}</div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">{description}</p>
                </div>
            </div>
        </Link>
    );

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-slate-500 dark:text-slate-400">Welcome, {user?.name || 'Admin'}!</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cardData.map((card, index) => (
                    <Card key={card.to} {...card} delay={index * 100} />
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;