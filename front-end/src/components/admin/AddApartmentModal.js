import React, { useState } from 'react';
    import AdminService from '../../services/AdminService';

    export default function AddApartmentModal({ isOpen, onClose, onApartmentAdded }) {
        const [formData, setFormData] = useState({
            unitNumber: '',
            address: '',
            floor: 0,
            description: ''
        });
        const [error, setError] = useState(null);
        const [isSubmitting, setIsSubmitting] = useState(false);

        const handleChange = (e) => {
            const { name, value, type } = e.target;
            setFormData(prev => ({
                ...prev,
                [name]: type === 'number' ? parseInt(value, 10) || 0 : value
            }));
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            setError(null);
            setIsSubmitting(true);

            try {
                const response = await AdminService.createApartment(formData);
                onApartmentAdded(response.data); // Pass the newly created apartment data back
                onClose(); // Close modal on success
                setFormData({ unitNumber: '', address: '', floor: 0, description: '' }); // Reset form
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to add apartment.');
                console.error("Add apartment error:", err);
            } finally {
                setIsSubmitting(false);
            }
        };

        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4 dark:text-white">Add New Apartment</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Form Fields */}
                        <div>
                            <label htmlFor="unitNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit Number</label>
                            <input type="text" name="unitNumber" id="unitNumber" value={formData.unitNumber} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                            <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                        <div>
                            <label htmlFor="floor" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Floor</label>
                            <input type="number" name="floor" id="floor" value={formData.floor} onChange={handleChange} required min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label>
                            <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                                Cancel
                            </button>
                            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                                {isSubmitting ? 'Adding...' : 'Add Apartment'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
