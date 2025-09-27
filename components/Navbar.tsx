import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import ThemeToggle from './ThemeToggle';

const NavLink: React.FC<{ to: string; children: React.ReactNode; onClick?: () => void; isMobile?: boolean }> = ({ to, children, onClick, isMobile }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={isMobile 
      ? "text-slate-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
      : "text-slate-200 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
    }
  >
    {children}
  </Link>
);

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };
  
  const closeMenu = () => setMobileMenuOpen(false);

  const renderNavLinks = (isMobile: boolean) => (
    <>
      {!isAuthenticated ? (
        <>
          <NavLink to="/" onClick={closeMenu} isMobile={isMobile}>Home</NavLink>
          <NavLink to="/login" onClick={closeMenu} isMobile={isMobile}>Login</NavLink>
          <NavLink to="/register" onClick={closeMenu} isMobile={isMobile}>Register</NavLink>
        </>
      ) : (
        <>
          {user?.role === UserRole.ADMIN && (
            <>
              <NavLink to="/admin/dashboard" onClick={closeMenu} isMobile={isMobile}>Dashboard</NavLink>
              <NavLink to="/admin/add-customer" onClick={closeMenu} isMobile={isMobile}>Add Customer</NavLink>
              <NavLink to="/admin/generate-bill" onClick={closeMenu} isMobile={isMobile}>Generate Bill</NavLink>
              <NavLink to="/admin/view-bills" onClick={closeMenu} isMobile={isMobile}>View Bills</NavLink>
            </>
          )}
          {user?.role === UserRole.CUSTOMER && (
            <>
              <NavLink to="/customer/dashboard" onClick={closeMenu} isMobile={isMobile}>Dashboard</NavLink>
              <NavLink to="/customer/my-bills" onClick={closeMenu} isMobile={isMobile}>My Bills</NavLink>
              <NavLink to="/customer/profile" onClick={closeMenu} isMobile={isMobile}>Profile</NavLink>
            </>
          )}
        </>
      )}
    </>
  );

  return (
    <nav className="bg-slate-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-white text-xl font-bold" onClick={closeMenu}>
              ⚡ EBMS
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {renderNavLinks(false)}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
              >
                Logout
              </button>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="flex items-center md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              {!isMobileMenuOpen && (
                 <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
              {/* Icon when menu is open */}
              {isMobileMenuOpen && (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {renderNavLinks(true)}
             {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="w-full text-left bg-red-500 hover:bg-red-600 text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
