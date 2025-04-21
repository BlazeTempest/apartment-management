import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import TenantService from '../services/TenantService'; // Import TenantService

// --- Helper Functions ---
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        // Handle potential ISO string with time/timezone if needed
        const dateOnly = dateString.split('T')[0];
        // Use UTC to avoid timezone issues if dates are simple YYYY-MM-DD
        const date = new Date(dateOnly + 'T00:00:00Z');
        return date.toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
        });
    } catch (e) {
        console.error("Error formatting date:", dateString, e);
        return 'Invalid Date';
    }
};

const getStatusClass = (status) => {
    const statusText = String(status).toUpperCase();
    if (statusText === 'ACTIVE') {
        return "px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 rounded-full text-sm";
    } else if (['INACTIVE', 'EXPIRED', 'TERMINATED'].includes(statusText)) {
        return "px-2 py-1 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 rounded-full text-sm";
    } else { // PENDING_START, PENDING_RENEWAL, etc.
        return "px-2 py-1 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 rounded-full text-sm";
    }
};

const getMaintenanceStatusClass = (status) => {
    const statusText = String(status).toUpperCase();
    if (['COMPLETED', 'RESOLVED'].includes(statusText)) {
        return "px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 rounded-full text-sm";
    } else if (statusText === 'IN_PROGRESS') {
         return "px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-full text-sm";
    } else if (statusText === 'OPEN') {
         return "px-2 py-1 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 rounded-full text-sm";
    } else { // CANCELLED, REJECTED etc.
        return "px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full text-sm";
    }
};

const getPaymentStatusClass = (status) => {
    const statusText = String(status).toUpperCase();
     if (statusText === 'COMPLETED') {
        return "text-green-600 dark:text-green-400";
    } else if (statusText === 'PENDING') {
        return "text-yellow-600 dark:text-yellow-400";
    } else if (statusText === 'FAILED') {
         return "text-red-600 dark:text-red-400";
    } else {
        return "text-gray-600 dark:text-gray-400";
    }
};


// --- Section Components ---

const TenantDashboardSection = ({ setActiveSection }) => {
    const [leaseData, setLeaseData] = useState(null);
    const [maintenanceRequests, setMaintenanceRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [leaseRes, maintRes] = await Promise.all([
                    TenantService.getLeaseDetails().catch(err => {
                        if (err.response?.status === 404) return { data: null };
                        throw err;
                    }),
                    TenantService.getMaintenanceRequests()
                    // TODO: Add API call for account balance
                ]);

                setLeaseData(leaseRes.data);
                setMaintenanceRequests(maintRes.data.filter(req =>
                    ['OPEN', 'IN_PROGRESS'].includes(req.status?.toUpperCase())
                ));

            } catch (err) {
                console.error("Failed to fetch tenant dashboard data:", err);
                setError("Could not load dashboard information.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getNextPaymentDueDate = () => {
        if (!leaseData || leaseData.status !== 'ACTIVE') return 'N/A';
        // TODO: Implement proper calculation based on payment history and lease terms
        return formatDate(leaseData.endDate); // Placeholder
    };

    if (loading) return <div className="text-center p-6 dark:text-white">Loading Dashboard...</div>;

    return (
        <section id="dashboard" className="fade-in">
            {error && <div className="mb-4 text-center p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Quick Status Card */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">Current Status</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="dark:text-gray-300">Lease Status:</span>
                            <span className={getStatusClass(leaseData?.status)}>
                                {leaseData?.status || 'N/A'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="dark:text-gray-300">Account Balance:</span>
                            {/* TODO: Fetch real balance data */}
                            <span className="font-medium dark:text-white">$0.00</span> {/* Placeholder */}
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="dark:text-gray-300">Next Payment Due:</span>
                            <span className="dark:text-gray-300">{getNextPaymentDueDate()}</span>
                        </div>
                    </div>
                </div>

                {/* Maintenance Updates */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold dark:text-white">Active Requests</h2>
                        <button onClick={() => setActiveSection('maintenance')} className="text-blue-500 hover:text-blue-700">View All</button>
                    </div>
                    <div className="space-y-4">
                        {maintenanceRequests.length > 0 ? (
                            maintenanceRequests.slice(0, 2).map(req => (
                                <div key={req.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div>
                                        <p className="dark:text-gray-300 font-medium">{req.issueType || 'Request'}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Submitted: {formatDate(req.createdAt)}
                                        </p>
                                    </div>
                                    <span className={getMaintenanceStatusClass(req.status)}>
                                        {req.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">No active requests.</p>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setActiveSection('payments')} className="p-3 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-700 text-center">
                            💳 Make Payment
                        </button>
                        <button onClick={() => setActiveSection('maintenance')} className="p-3 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 rounded-lg hover:bg-green-200 dark:hover:bg-green-700 text-center">
                            🛠 New Request
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

const LeaseSection = () => {
    const [leaseData, setLeaseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLease = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await TenantService.getLeaseDetails();
                setLeaseData(response.data);
            } catch (err) {
                 console.error("Failed to fetch lease details:", err);
                 if (err.response?.status === 404) {
                    setError("No active lease found.");
                 } else {
                    setError("Could not load lease details.");
                 }
            } finally {
                setLoading(false);
            }
        };
        fetchLease();
    }, []);

    if (loading) return <div className="text-center p-6 dark:text-white">Loading Lease Details...</div>;

    return (
        <section id="lease" className="fade-in">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-6 dark:text-white">Lease Agreement</h2>
                {error && <div className="mb-4 text-center p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
                {leaseData ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <span className="dark:text-gray-300">Start Date:</span>
                                    <span className="dark:text-gray-300">{formatDate(leaseData.startDate)}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <span className="dark:text-gray-300">End Date:</span>
                                    <span className="dark:text-gray-300">{formatDate(leaseData.endDate)}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <span className="dark:text-gray-300">Status:</span>
                                    <span className={getStatusClass(leaseData.status)}>{leaseData.status}</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <span className="dark:text-gray-300">Monthly Rent:</span>
                                    <span className="font-medium dark:text-white">${leaseData.rent?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <span className="dark:text-gray-300">Security Deposit:</span>
                                    <span className="dark:text-gray-300">${leaseData.deposit?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <span className="dark:text-gray-300">Apartment:</span>
                                    <span className="dark:text-gray-300">Unit {leaseData.apartmentUnitNumber || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-800 rounded-lg">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                📄 Lease Document:
                                {leaseData.pdfUrl ? (
                                    <a href={leaseData.pdfUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 hover:text-blue-700 underline">
                                        Download PDF
                                    </a>
                                ) : (
                                    <span className="ml-2">Not Available</span>
                                )}
                            </p>
                        </div>
                    </>
                ) : (
                    !error && <p className="dark:text-gray-300">No lease details available.</p>
                )}
            </div>
        </section>
    );
};

const MaintenanceSection = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        issueType: 'Plumbing', description: '', preferredDate: '', urgency: 'Medium'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const fetchRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await TenantService.getMaintenanceRequests();
            setRequests(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (err) {
            console.error("Failed to fetch maintenance requests:", err);
            setError("Could not load maintenance requests.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            const requestDto = {
                issueType: formData.issueType.toUpperCase(),
                description: formData.description,
                preferredDate: formData.preferredDate || null,
                urgency: formData.urgency.toUpperCase()
            };
            const newRequest = await TenantService.createMaintenanceRequest(requestDto);
            setRequests(prev => [newRequest.data, ...prev]);
            setFormData({ issueType: 'Plumbing', description: '', preferredDate: '', urgency: 'Medium' });
            alert('Maintenance request submitted successfully!');
        } catch (err) {
             console.error("Failed to submit maintenance request:", err);
             setSubmitError(err.response?.data?.message || "Failed to submit request.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="maintenance" className="fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* New Request Form */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">New Maintenance Request</h2>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="issueType" className="block mb-2 dark:text-gray-300">Issue Type</label>
                            <select id="issueType" name="issueType" value={formData.issueType} onChange={handleFormChange} required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <option>Plumbing</option> <option>Electrical</option> <option>HVAC</option> <option>Appliance</option> <option>Structural</option> <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="description" className="block mb-2 dark:text-gray-300">Description</label>
                            <textarea id="description" name="description" value={formData.description} onChange={handleFormChange} required className="w-full p-2 border rounded-lg h-32 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Describe the issue..."></textarea>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="preferredDate" className="block mb-2 dark:text-gray-300">Preferred Date</label>
                                <input type="date" id="preferredDate" name="preferredDate" value={formData.preferredDate} onChange={handleFormChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div>
                                <label htmlFor="urgency" className="block mb-2 dark:text-gray-300">Urgency</label>
                                <select id="urgency" name="urgency" value={formData.urgency} onChange={handleFormChange} required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    <option>Low</option> <option>Medium</option> <option>High</option>
                                </select>
                            </div>
                        </div>
                        {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
                        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:opacity-50">
                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </form>
                </div>
                {/* Request History */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">Request History</h2>
                    {loading && <p className="dark:text-gray-400">Loading history...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!loading && !error && (
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {requests.length > 0 ? requests.map(req => (
                                <div key={req.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-medium dark:text-gray-300">{req.issueType || 'Request'}</h3>
                                        <span className={getMaintenanceStatusClass(req.status)}>{req.status}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{req.description}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">Submitted: {formatDate(req.createdAt)}</p>
                                    {req.resolvedAt && <p className="text-xs text-gray-500 dark:text-gray-500">Resolved: {formatDate(req.resolvedAt)}</p>}
                                    {req.technicianNotes && <p className="text-xs mt-1 italic text-gray-600 dark:text-gray-400">Notes: {req.technicianNotes}</p>}
                                </div>
                            )) : (
                               <p className="text-sm text-gray-500 dark:text-gray-400">No past requests.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

const PaymentsSection = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // TODO: Add state for payment form, due amount, lease details for payment context

    useEffect(() => {
        const fetchPayments = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await TenantService.getPaymentHistory();
                 // Sort payments by date, newest first
                setPayments(response.data.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)));
                // TODO: Fetch lease details to determine amount due
            } catch (err) {
                console.error("Failed to fetch payment history:", err);
                setError("Could not load payment history.");
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, []);

    // TODO: Implement handleMakePayment function

    // Placeholder for amount due - needs calculation based on lease and existing payments
    const amountDue = 0.00; // Replace with actual calculation

    return (
        <section id="payments" className="fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment Form */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">Make a Payment</h2>
                    {/* TODO: Implement actual payment form (e.g., Stripe Elements) */}
                    <div className="space-y-4">
                        <div className="bg-blue-100 dark:bg-blue-800 p-4 rounded-lg">
                            <p className="text-center text-2xl font-bold dark:text-blue-100">${amountDue.toFixed(2)} Due</p>
                            <p className="text-center text-sm text-gray-600 dark:text-blue-200">
                                {amountDue > 0 ? `Due by ${getNextPaymentDueDate()}` : 'No payment due'} {/* Use helper */}
                            </p>
                        </div>
                        <p className="text-sm text-center dark:text-gray-400">(Payment form placeholder - Integration needed)</p>
                        <button disabled={amountDue <= 0} className={`w-full text-white p-3 rounded-lg ${amountDue > 0 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}>
                            Pay ${amountDue.toFixed(2)}
                        </button>
                    </div>
                </div>

                {/* Payment History */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">Payment History</h2>
                     {loading && <p className="dark:text-gray-400">Loading history...</p>}
                     {error && <p className="text-red-500">{error}</p>}
                     {!loading && !error && (
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {payments.length > 0 ? payments.map(p => (
                                <div key={p.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div>
                                        <p className="dark:text-gray-300">Payment ({p.method})</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Paid on {formatDate(p.paymentDate)}</p>
                                        {p.transactionId && <p className="text-xs text-gray-400 dark:text-gray-500">Ref: {p.transactionId}</p>}
                                    </div>
                                    <span className={`${getPaymentStatusClass(p.status)} font-medium`}>
                                        ${p.amount.toFixed(2)} ({p.status})
                                    </span>
                                </div>
                            )) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">No payment history.</p>
                            )}
                        </div>
                     )}
                </div>
            </div>
        </section>
    );
};

const ProfileSection = () => {
    const { user } = useAuth(); // Get user email from auth context
    const [profile, setProfile] = useState({ fullName: '', email: '', phone: '', emergencyContact: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await TenantService.getProfile();
                setProfile({
                    fullName: response.data.fullName || '',
                    email: user?.email || response.data.email || '', // Use auth email as fallback
                    phone: response.data.phone || '',
                    emergencyContact: response.data.emergencyContact || ''
                });
            } catch (err) {
                console.error("Failed to fetch profile:", err);
                setError("Could not load profile information.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]); // Refetch if user context changes

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            // Prepare DTO - only send fields that can be updated
            const profileDto = {
                fullName: profile.fullName,
                // email is usually not updatable directly, handled via user management
                phone: profile.phone,
                emergencyContact: profile.emergencyContact
            };
            await TenantService.updateProfile(profileDto);
            alert('Profile updated successfully!');
        } catch (err) {
            console.error("Failed to update profile:", err);
            setSubmitError(err.response?.data?.message || "Failed to update profile.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="text-center p-6 dark:text-white">Loading Profile...</div>;

    return (
        <section id="profile" className="fade-in">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-6 dark:text-white">Profile Settings</h2>
                {error && <div className="mb-4 text-center p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="profile-fullName" className="block mb-2 dark:text-gray-300">Full Name</label>
                            <input type="text" id="profile-fullName" name="fullName" value={profile.fullName} onChange={handleChange} required
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                        </div>
                        <div>
                            <label htmlFor="profile-email" className="block mb-2 dark:text-gray-300">Email</label>
                            <input type="email" id="profile-email" name="email" value={profile.email} readOnly // Email usually not editable here
                                className="w-full p-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300 cursor-not-allowed"/>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="profile-phone" className="block mb-2 dark:text-gray-300">Phone Number</label>
                            <input type="tel" id="profile-phone" name="phone" value={profile.phone} onChange={handleChange} required placeholder="Enter phone"
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                        </div>
                        <div>
                            <label htmlFor="profile-emergencyContact" className="block mb-2 dark:text-gray-300">Emergency Contact</label>
                            <input type="text" id="profile-emergencyContact" name="emergencyContact" value={profile.emergencyContact} onChange={handleChange} required placeholder="Name & Phone"
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                        </div>
                    </div>
                    <div className="md:col-span-2 mt-6">
                         {submitError && <p className="text-red-500 text-sm mb-3">{submitError}</p>}
                        <button type="submit" disabled={isSubmitting} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50">
                             {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

// --- Main Tenant Dashboard Component ---
export default function TenantDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('dashboard');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [profileName, setProfileName] = useState(user?.name || "Tenant"); // State for profile name

    // Fetch profile name on mount or when user changes
     useEffect(() => {
        const fetchName = async () => {
            try {
                const response = await TenantService.getProfile();
                setProfileName(response.data.fullName || user?.name || "Tenant");
            } catch (error) {
                console.error("Could not fetch profile name for navbar:", error);
                // Keep default/auth context name if fetch fails
                setProfileName(user?.name || "Tenant");
            }
        };
        if (user) { // Only fetch if user is available
             fetchName();
        }
    }, [user]); // Depend on user context

    // Dark mode effect
    useEffect(() => {
        const darkModePreference = localStorage.getItem('darkMode') === 'true';
        setIsDarkMode(darkModePreference);
        if (darkModePreference) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleDarkMode = () => {
        const newDarkModeState = !isDarkMode;
        setIsDarkMode(newDarkModeState);
        localStorage.setItem('darkMode', String(newDarkModeState));
        if (newDarkModeState) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'dashboard': return <TenantDashboardSection setActiveSection={setActiveSection} />;
            case 'lease': return <LeaseSection />;
            case 'maintenance': return <MaintenanceSection />;
            case 'payments': return <PaymentsSection />;
            case 'profile': return <ProfileSection />;
            default: return <TenantDashboardSection setActiveSection={setActiveSection} />;
        }
    };

    const getNavLinkClass = (section) => {
        let baseClass = "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors";
        return activeSection === section
            ? `${baseClass} text-blue-600 dark:text-blue-300 font-medium`
            : `${baseClass} dark:text-white`;
    };

    const getUserInitials = () => {
        return profileName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Navbar */}
            <nav className="bg-white dark:bg-gray-800 shadow-lg fixed w-full z-50">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-8">
                        <h1 className="text-xl font-bold dark:text-white">🏠 Tenant Portal</h1>
                        <div className="hidden md:flex space-x-6">
                            <button onClick={() => setActiveSection('dashboard')} className={getNavLinkClass('dashboard')}>Dashboard</button>
                            <button onClick={() => setActiveSection('lease')} className={getNavLinkClass('lease')}>Lease</button>
                            <button onClick={() => setActiveSection('maintenance')} className={getNavLinkClass('maintenance')}>Maintenance</button>
                            <button onClick={() => setActiveSection('payments')} className={getNavLinkClass('payments')}>Payments</button>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                            <span>{isDarkMode ? '☀️' : '🌙'}</span>
                        </button>
                        <button onClick={() => setActiveSection('profile')} className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">
                                {getUserInitials()}
                            </div>
                            <span className="hidden md:inline dark:text-white">{profileName}</span>
                        </button>
                        <button onClick={handleLogout} className="text-red-500 hover:text-red-700">Logout</button>
                    </div>
                    {/* TODO: Mobile Nav */}
                </div>
            </nav>

            {/* Main Content */}
            <main className="container mx-auto pt-20 px-4 pb-8">
                {renderSection()}
            </main>
        </div>
    );
}
