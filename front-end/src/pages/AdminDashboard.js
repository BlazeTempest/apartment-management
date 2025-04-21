import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import TenantManagement from '../components/admin/TenantManagement';
import ApartmentManagement from '../components/admin/ApartmentManagement'; // Import ApartmentManagement
// Import other section components later:
// import LeaseManagement from '../components/admin/LeaseManagement';
// import MaintenanceManagement from '../components/admin/MaintenanceManagement';
// import PaymentManagement from '../components/admin/PaymentManagement';

// Placeholder components until they are created
const LeaseManagement = () => <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow"><h2 className="text-2xl font-bold mb-6 dark:text-white">Lease Management (Placeholder)</h2></div>;
const MaintenanceManagement = () => <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow"><h2 className="text-2xl font-bold mb-6 dark:text-white">Maintenance Management (Placeholder)</h2></div>;
const PaymentManagement = () => <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow"><h2 className="text-2xl font-bold mb-6 dark:text-white">Payment Management (Placeholder)</h2></div>;


export default function AdminDashboard() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('tenants'); // Default section
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Check local storage for theme preference on mount
    useEffect(() => {
        const darkModePreference = localStorage.getItem('darkMode') === 'true';
        setIsDarkMode(darkModePreference);
        if (darkModePreference) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleDarkMode = () => {
        const newDarkModeState = !isDarkMode;
        setIsDarkMode(newDarkModeState);
        localStorage.setItem('darkMode', newDarkModeState);
        if (newDarkModeState) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'tenants':
                return <TenantManagement />;
            case 'apartments': // Add case for apartments
                return <ApartmentManagement />;
            case 'leases':
                return <LeaseManagement />;
            case 'maintenance':
                return <MaintenanceManagement />;
            case 'payments':
                return <PaymentManagement />;
            default:
                return <TenantManagement />;
        }
    };

    const getNavLinkClass = (section) => {
        let baseClass = "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors";
        if (activeSection === section) {
            return `${baseClass} bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200`;
        }
        return `${baseClass} dark:text-white`; // Added dark:text-white for inactive links
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Navbar */}
            <nav className="bg-white dark:bg-gray-800 shadow-lg fixed w-full z-50">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-8">
                        <h1 className="text-xl font-bold dark:text-white">🏠 Admin Portal</h1>
                        <div className="hidden md:flex space-x-6">
                            <button onClick={() => setActiveSection('tenants')} className={getNavLinkClass('tenants')}>👥 Tenants</button> {/* Changed icon */}
                            <button onClick={() => setActiveSection('apartments')} className={getNavLinkClass('apartments')}>🏢 Apartments</button> {/* Add Apartments link */}
                            <button onClick={() => setActiveSection('leases')} className={getNavLinkClass('leases')}>📄 Leases</button>
                            <button onClick={() => setActiveSection('maintenance')} className={getNavLinkClass('maintenance')}>🔧 Maintenance</button>
                            <button onClick={() => setActiveSection('payments')} className={getNavLinkClass('payments')}>💵 Payments</button>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                            <span>{isDarkMode ? '☀️' : '🌙'}</span>
                        </button>
                        <button className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">AD</div>
                            <span className="hidden md:inline dark:text-white">Admin</span>
                        </button>
                        <button onClick={handleLogout} className="text-red-500 hover:text-red-700">Logout</button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="container mx-auto pt-20 px-4 pb-8">
                {renderSection()}
            </main>
        </div>
    );
}
