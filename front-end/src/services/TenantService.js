import axios from 'axios';
    import { localStorageService } from './LocalStorageService'; // For getting the auth token

    const API_URL = 'http://localhost:8080/api/tenant/';

    // Helper to get auth headers (same as AdminService)
    const getAuthHeaders = () => {
        const token = localStorageService.getToken();
        return token ? { Authorization: 'Bearer ' + token } : {};
    };

    class TenantService {
        // --- Dashboard ---
        getDashboardInfo() {
            return axios.get(API_URL + 'dashboard', { headers: getAuthHeaders() });
        }

        // --- Lease ---
        getLeaseDetails() {
            return axios.get(API_URL + 'lease', { headers: getAuthHeaders() });
        }

        // --- Maintenance ---
        getMaintenanceRequests() {
            return axios.get(API_URL + 'maintenance', { headers: getAuthHeaders() });
        }

        createMaintenanceRequest(requestData) {
            // requestData should match MaintenanceRequestDto structure expected by backend
            // (excluding tenantId/apartmentId as backend derives them)
            return axios.post(API_URL + 'maintenance', requestData, { headers: getAuthHeaders() });
        }

        // --- Payments ---
        getPaymentHistory() {
            return axios.get(API_URL + 'payments', { headers: getAuthHeaders() });
        }

        makePayment(paymentDetails) {
            // paymentDetails should match the expected structure for the backend endpoint
            return axios.post(API_URL + 'payments', paymentDetails, { headers: getAuthHeaders() });
        }

        // --- Profile ---
        getProfile() {
            return axios.get(API_URL + 'profile', { headers: getAuthHeaders() });
        }

        updateProfile(profileData) {
            // profileData should match ProfileDto structure
            return axios.put(API_URL + 'profile', profileData, { headers: getAuthHeaders() });
        }
    }

    export default new TenantService();
