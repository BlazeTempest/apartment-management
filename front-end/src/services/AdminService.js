import axios from 'axios';
import { localStorageService } from './LocalStorageService'; // For getting the auth token

const API_URL = 'http://localhost:8080/api/admin/';

// Helper to get auth headers
const getAuthHeaders = () => {
    const token = localStorageService.getToken();
    return token ? { Authorization: 'Bearer ' + token } : {};
};

class AdminService {
    // --- Tenant Management ---
    getTenants() {
        console.log(getAuthHeaders());
        return axios.get(API_URL + 'tenants', { headers: getAuthHeaders() });
    }

    getTenantById(id) {
        return axios.get(API_URL + `tenants/${id}`, { headers: getAuthHeaders() });
    }

    createTenant(tenantData) {
        // tenantData should match TenantDto structure expected by backend
        return axios.post(API_URL + 'tenants', tenantData, { headers: getAuthHeaders() });
    }

    updateTenant(id, tenantData) {
        // tenantData should match TenantDto structure
        return axios.put(API_URL + `tenants/${id}`, tenantData, { headers: getAuthHeaders() });
    }

    deleteTenant(id) {
        return axios.delete(API_URL + `tenants/${id}`, { headers: getAuthHeaders() });
    }

    // --- TODO: Add methods for Lease, Maintenance, Payment Management ---

    // --- Apartment Management ---
    getApartments() {
        return axios.get(API_URL.replace('admin/', '') + 'apartments', { headers: getAuthHeaders() }); // Note: Endpoint is /api/apartments
    }

    getApartmentById(id) {
        return axios.get(API_URL.replace('admin/', '') + `apartments/${id}`, { headers: getAuthHeaders() });
    }

    createApartment(apartmentData) {
        // apartmentData should match ApartmentDto structure
        return axios.post(API_URL.replace('admin/', '') + 'apartments', apartmentData, { headers: getAuthHeaders() });
    }

    updateApartment(id, apartmentData) {
        // apartmentData should match ApartmentDto structure
        return axios.put(API_URL.replace('admin/', '') + `apartments/${id}`, apartmentData, { headers: getAuthHeaders() });
    }

    deleteApartment(id) {
        return axios.delete(API_URL.replace('admin/', '') + `apartments/${id}`, { headers: getAuthHeaders() });
    }

    // --- Lease Management ---
    getLeases() {
        return axios.get(API_URL + 'leases', { headers: getAuthHeaders() });
    }

    createLease(leaseData) {
        // leaseData should match LeaseDto structure
        return axios.post(API_URL + 'leases', leaseData, { headers: getAuthHeaders() });
    }

    // updateLease(id, leaseData) { // Full update might be complex
    //     return axios.put(API_URL + `leases/${id}`, leaseData, { headers: getAuthHeaders() });
    // }

    terminateLease(id) {
        // Specific endpoint for termination as per README
        return axios.put(API_URL + `leases/${id}/terminate`, {}, { headers: getAuthHeaders() });
    }
}

export default new AdminService();
