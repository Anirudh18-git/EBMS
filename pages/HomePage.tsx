import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="text-center">
      <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-8 max-w-2xl mx-auto mt-10 animate-scaleIn">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
          Welcome to EBMS
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
          Your one-stop solution for managing electricity bills efficiently. Whether you're a customer or an administrator, we've got you covered.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-fadeInUp" style={{ animationDelay: '300ms' }}>
          <Link 
            to="/login"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            Login
          </Link>
          <Link 
            to="/register"
            className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
