import React, { useState, useEffect } from 'react';
import AdminService from '../../services/AdminService';
import AddTenantModal from './AddTenantModal'; // Import the modal component

export default function TenantManagement() {
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

    // Function to fetch tenants
    const fetchTenants = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await AdminService.getTenants();
            // Format data for the table
            const formattedTenants = response.data.map(dto => ({
                id: dto.id,
                name: dto.profile?.fullName || 'N/A',
                unit: dto.apartmentUnitNumber || 'N/A',
                leaseStatus: dto.status || 'UNKNOWN'
            }));
            setTenants(formattedTenants);
        } catch (err) {
            setError('Failed to fetch tenants. Please ensure you are logged in as Admin.');
            console.error("Fetch tenants error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch tenants on component mount
    useEffect(() => {
        fetchTenants();
    }, []);

    // Handle tenant deletion
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this tenant? This might affect associated leases and payments.')) {
            try {
                await AdminService.deleteTenant(id);
                // Refresh tenant list after deletion by filtering locally
                setTenants(prevTenants => prevTenants.filter(tenant => tenant.id !== id));
                alert('Tenant deleted successfully.');
            } catch (err) {
                setError('Failed to delete tenant.');
                console.error("Delete tenant error:", err);
            }
        }
    };

    // Handle adding a new tenant (called from modal)
    const handleTenantAdded = (newTenantDto) => {
        // Format the newly added tenant DTO for display
         const formattedNewTenant = {
             id: newTenantDto.id,
             name: newTenantDto.profile?.fullName || 'N/A',
             unit: newTenantDto.apartmentUnitNumber || 'N/A',
             leaseStatus: newTenantDto.status || 'UNKNOWN'
         };
        // Add the new tenant to the beginning of the list
        setTenants(prevTenants => [formattedNewTenant, ...prevTenants]);
        // Optionally, could refetch the entire list: fetchTenants();
    };

    // Helper for status styling
    const getStatusClass = (status) => {
        const statusText = String(status).toUpperCase(); // Ensure uppercase comparison
        if (statusText === 'ACTIVE') {
            return "px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 rounded-full text-sm";
        } else if (statusText === 'INACTIVE') {
            return "px-2 py-1 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 rounded-full text-sm";
        } else {
            return "px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full text-sm";
        }
    };

    // Render loading/error states
    if (loading) return <div className="text-center p-6 dark:text-white">Loading tenants...</div>;
    if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

    // Render main component
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 fade-in">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Tenant Management</h2>
            <div className="mb-4 text-right">
                <button
                    onClick={() => setIsModalOpen(true)} // Open modal
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                    + Add Tenant
                </button>
            </div>

            {/* Add Tenant Modal */}
            <AddTenantModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onTenantAdded={handleTenantAdded}
            />

            {/* Tenants Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unit</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {tenants.length > 0 ? tenants.map((tenant) => (
                            <tr key={tenant.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="p-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{tenant.name}</td>
                                <td className="p-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{tenant.unit}</td>
                                <td className="p-3 whitespace-nowrap">
                                    <span className={getStatusClass(tenant.leaseStatus)}>
                                        {tenant.leaseStatus}
                                    </span>
                                </td>
                                <td className="p-3 whitespace-nowrap text-sm font-medium">
                                    {/* Edit Button - Placeholder */}
                                    <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(tenant.id)}
                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="p-3 text-center text-gray-500 dark:text-gray-400">No tenants found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
