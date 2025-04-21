import React, { useState } from 'react';
    import AdminService from '../../services/AdminService';

    // Basic Modal Component Structure (can be replaced with ShadCN/UI later if needed)
    export default function AddTenantModal({ isOpen, onClose, onTenantAdded }) {
        const [formData, setFormData] = useState({
            fullName: '',
            email: '',
            phone: '',
            emergencyContact: '',
            apartmentId: '' // Assuming admin knows/selects the apartment ID
        });
        const [error, setError] = useState(null);
        const [isSubmitting, setIsSubmitting] = useState(false);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            setError(null);
            setIsSubmitting(true);

            // Construct the DTO structure expected by the backend
            const tenantDto = {
                profile: {
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    emergencyContact: formData.emergencyContact
                },
                apartmentId: parseInt(formData.apartmentId, 10), // Ensure apartmentId is a number
                // status will likely be set to ACTIVE by the backend default
            };

            try {
                const response = await AdminService.createTenant(tenantDto);
                onTenantAdded(response.data); // Pass the newly created tenant data back
                onClose(); // Close modal on success
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to add tenant.');
                console.error("Add tenant error:", err);
            } finally {
                setIsSubmitting(false);
            }
        };

        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4 dark:text-white">Add New Tenant</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Form Fields */}
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                            <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                            <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                        <div>
                            <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Emergency Contact</label>
                            <input type="tel" name="emergencyContact" id="emergencyContact" value={formData.emergencyContact} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                        <div>
                            <label htmlFor="apartmentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Apartment ID</label>
                            <input type="number" name="apartmentId" id="apartmentId" value={formData.apartmentId} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            {/* TODO: Replace with a dropdown/search to select existing apartments */}
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                                Cancel
                            </button>
                            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                                {isSubmitting ? 'Adding...' : 'Add Tenant'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
