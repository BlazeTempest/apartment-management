import React, { useState, useEffect } from 'react';
    import AdminService from '../../services/AdminService';
    // TODO: Create AddLeaseModal component

    // Placeholder Modal
    const AddLeaseModal = ({ isOpen, onClose, onLeaseAdded }) => {
        if (!isOpen) return null;
        // Basic structure - needs form fields for tenantId, apartmentId, dates, rent, deposit, pdfUrl
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded dark:bg-gray-700 dark:text-white">
                    <h2 className="text-xl font-bold mb-4">Add New Lease (Placeholder)</h2>
                    {/* Form fields go here */}
                    <p>Form fields for Tenant ID, Apartment ID, Start/End Dates, Rent, Deposit, PDF URL needed.</p>
                    <div className="flex justify-end space-x-2 mt-4">
                         <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                         {/* <button onClick={() => { /* Call AdminService.createLease */ onClose(); }} className="px-4 py-2 bg-blue-500 text-white rounded">Add Lease</button> */}
                    </div>
                </div>
            </div>
        );
    };

    // Helper functions (can be moved to a utils file)
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const dateOnly = dateString.split('T')[0];
            const date = new Date(dateOnly + 'T00:00:00Z');
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
        } catch (e) { return 'Invalid Date'; }
    };

    const getStatusClass = (status) => {
        const statusText = String(status).toUpperCase();
        if (statusText === 'ACTIVE') return "px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 rounded-full text-xs";
        if (['EXPIRED', 'TERMINATED'].includes(statusText)) return "px-2 py-1 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 rounded-full text-xs";
        if (['PENDING_START', 'PENDING_RENEWAL'].includes(statusText)) return "px-2 py-1 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 rounded-full text-xs";
        return "px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full text-xs";
    };


    export default function LeaseManagement() {
        const [leases, setLeases] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const [isAddModalOpen, setIsAddModalOpen] = useState(false);

        const fetchLeases = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await AdminService.getLeases();
                setLeases(response.data);
            } catch (err) {
                setError('Failed to fetch leases.');
                console.error("Fetch leases error:", err);
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            fetchLeases();
        }, []);

        const handleTerminate = async (id) => {
            if (window.confirm('Are you sure you want to terminate this lease?')) {
                try {
                    const response = await AdminService.terminateLease(id);
                    // Update the specific lease in the list
                    setLeases(prev => prev.map(l => l.id === id ? response.data : l));
                    alert('Lease terminated successfully.');
                } catch (err) {
                    setError('Failed to terminate lease.');
                    console.error("Terminate lease error:", err);
                    alert('Error terminating lease: ' + (err.response?.data?.message || err.message));
                }
            }
        };

        const handleLeaseAdded = (newLease) => {
            setLeases(prev => [newLease, ...prev]); // Add to list or refetch
        };

        if (loading) return <div className="text-center p-6 dark:text-white">Loading leases...</div>;
        if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-6 dark:text-white">Lease Management</h2>
                <div className="mb-4 text-right">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                        + Add Lease
                    </button>
                </div>

                <AddLeaseModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onLeaseAdded={handleLeaseAdded}
                />

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tenant</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unit #</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Start Date</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">End Date</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rent</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {leases.length > 0 ? leases.map((lease) => (
                                <tr key={lease.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="p-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{lease.tenantName || `(ID: ${lease.tenantId})`}</td>
                                    <td className="p-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{lease.apartmentUnitNumber || `(ID: ${lease.apartmentId})`}</td>
                                    <td className="p-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatDate(lease.startDate)}</td>
                                    <td className="p-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatDate(lease.endDate)}</td>
                                    <td className="p-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${lease.rent?.toFixed(2)}</td>
                                    <td className="p-3 whitespace-nowrap">
                                        <span className={getStatusClass(lease.status)}>{lease.status}</span>
                                    </td>
                                    <td className="p-3 whitespace-nowrap text-sm font-medium">
                                        {/* TODO: Add Edit Button/Modal */}
                                        {/* <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">Edit</button> */}
                                        {lease.status === 'ACTIVE' && (
                                            <button
                                                onClick={() => handleTerminate(lease.id)}
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                Terminate
                                            </button>
                                        )}
                                         {/* Add View PDF link */}
                                         {lease.pdfUrl && (
                                            <a href={lease.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 ml-3">
                                                View PDF
                                            </a>
                                         )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="p-3 text-center text-gray-500 dark:text-gray-400">No leases found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
