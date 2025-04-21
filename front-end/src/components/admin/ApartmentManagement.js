import React, { useState, useEffect } from 'react';
import AdminService from '../../services/AdminService';
import AddApartmentModal from './AddApartmentModal'; // Import the actual Add modal
import EditApartmentModal from './EditApartmentModal'; // Import the actual Edit modal


export default function ApartmentManagement() {
        const [apartments, setApartments] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const [isAddModalOpen, setIsAddModalOpen] = useState(false);
        const [isEditModalOpen, setIsEditModalOpen] = useState(false);
        const [selectedApartment, setSelectedApartment] = useState(null);

        // Fetch apartments
        const fetchApartments = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await AdminService.getApartments();
                setApartments(response.data);
            } catch (err) {
                setError('Failed to fetch apartments.');
                console.error("Fetch apartments error:", err);
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            fetchApartments();
        }, []);

        // Handle Delete
        const handleDelete = async (id) => {
            if (window.confirm('Are you sure you want to delete this apartment? This might affect associated tenants and leases.')) {
                try {
                    await AdminService.deleteApartment(id);
                    setApartments(prev => prev.filter(apt => apt.id !== id));
                    alert('Apartment deleted successfully.');
                } catch (err) {
                    setError('Failed to delete apartment.');
                    console.error("Delete apartment error:", err);
                    alert('Error deleting apartment: ' + (err.response?.data?.message || err.message));
                }
            }
        };

        // Handle Add
        const handleApartmentAdded = (newApartment) => {
            setApartments(prev => [newApartment, ...prev]);
            // Or refetch: fetchApartments();
        };

        // Handle Update
        const handleApartmentUpdated = (updatedApartment) => {
            setApartments(prev => prev.map(apt => apt.id === updatedApartment.id ? updatedApartment : apt));
            // Or refetch: fetchApartments();
        };

        // Open Edit Modal
        const openEditModal = (apartment) => {
            setSelectedApartment(apartment);
            setIsEditModalOpen(true);
        };

        if (loading) return <div className="text-center p-6 dark:text-white">Loading apartments...</div>;
        if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-6 dark:text-white">Apartment Management</h2>
                <div className="mb-4 text-right">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                        + Add Apartment
                    </button>
                </div>

                {/* Modals */}
                <AddApartmentModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onApartmentAdded={handleApartmentAdded}
                />
                <EditApartmentModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onApartmentUpdated={handleApartmentUpdated}
                    apartment={selectedApartment}
                />

                {/* Apartments Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unit #</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Address</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Floor</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {apartments.length > 0 ? apartments.map((apt) => (
                                <tr key={apt.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="p-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{apt.unitNumber}</td>
                                    <td className="p-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{apt.address}</td>
                                    <td className="p-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{apt.floor}</td>
                                    <td className="p-3 text-sm text-gray-500 dark:text-gray-300 truncate max-w-xs">{apt.description || '-'}</td>
                                    <td className="p-3 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => openEditModal(apt)}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(apt.id)}
                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="p-3 text-center text-gray-500 dark:text-gray-400">No apartments found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
