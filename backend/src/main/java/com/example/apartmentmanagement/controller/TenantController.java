package com.example.apartmentmanagement.controller;

    import com.example.apartmentmanagement.dto.LeaseDto;
    import com.example.apartmentmanagement.dto.MaintenanceRequestDto;
    import com.example.apartmentmanagement.dto.PaymentDto;
    import com.example.apartmentmanagement.dto.ProfileDto;
    import com.example.apartmentmanagement.dto.TenantDto; // Assuming TenantDto contains enough dashboard info for now
    import com.example.apartmentmanagement.security.UserDetailsImpl;
    import com.example.apartmentmanagement.service.LeaseService;
    import com.example.apartmentmanagement.service.MaintenanceRequestService;
    import com.example.apartmentmanagement.service.PaymentService;
    import com.example.apartmentmanagement.service.ProfileService;
    import com.example.apartmentmanagement.service.TenantService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.access.prepost.PreAuthorize;
    import org.springframework.security.core.Authentication;
    import org.springframework.security.core.context.SecurityContextHolder;
    import org.springframework.web.bind.annotation.*;

    import jakarta.validation.Valid;
    import java.util.List;

    @RestController
    @RequestMapping("/api/tenant")
    @PreAuthorize("hasRole('TENANT')") // Secure all endpoints in this controller for tenants
    public class TenantController {

        @Autowired
        private TenantService tenantService;

        @Autowired
        private LeaseService leaseService;

        @Autowired
        private MaintenanceRequestService maintenanceRequestService;

        @Autowired
        private PaymentService paymentService;

        @Autowired
        private ProfileService profileService;

        // Helper to get current user ID
        private Long getCurrentUserId() {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            return userDetails.getId();
        }

        // --- Dashboard ---
        // TODO: Create a dedicated TenantDashboardDto later for more specific info
        @GetMapping("/dashboard")
        public ResponseEntity<TenantDto> getTenantDashboardInfo() {
            Long userId = getCurrentUserId();
            // For now, return the basic TenantDto associated with the user
            TenantDto tenantInfo = tenantService.getTenantByUserId(userId);
            // We'll need to enhance this DTO or add more specific data later
            return ResponseEntity.ok(tenantInfo);
        }

        // --- Lease ---
        @GetMapping("/lease")
        public ResponseEntity<LeaseDto> getTenantLease() {
            Long userId = getCurrentUserId();
            // Assuming a tenant has one primary active lease for simplicity
            LeaseDto lease = leaseService.getActiveLeaseByTenantUserId(userId);
            return ResponseEntity.ok(lease);
        }

        // --- Maintenance ---
        @GetMapping("/maintenance")
        public ResponseEntity<List<MaintenanceRequestDto>> getTenantMaintenanceRequests() {
            Long userId = getCurrentUserId();
            List<MaintenanceRequestDto> requests = maintenanceRequestService.getMaintenanceRequestsByTenantUserId(userId);
            return ResponseEntity.ok(requests);
        }

        @PostMapping("/maintenance")
        public ResponseEntity<MaintenanceRequestDto> createMaintenanceRequest(@Valid @RequestBody MaintenanceRequestDto requestDto) {
            Long userId = getCurrentUserId();
            // Ensure the requestDto is associated with the logged-in tenant
            // The service should handle linking the request to the correct tenant/apartment
            MaintenanceRequestDto createdRequest = maintenanceRequestService.createMaintenanceRequest(userId, requestDto);
            return ResponseEntity.ok(createdRequest);
        }

        // --- Payments ---
        @GetMapping("/payments")
        public ResponseEntity<List<PaymentDto>> getTenantPaymentHistory() {
            Long userId = getCurrentUserId();
            List<PaymentDto> payments = paymentService.getPaymentsByTenantUserId(userId);
            return ResponseEntity.ok(payments);
        }

        @PostMapping("/payments")
        public ResponseEntity<?> makePayment(@RequestBody Object paymentDetails) { // Replace Object with actual PaymentRequest DTO
            Long userId = getCurrentUserId();
            // TODO: Implement payment processing logic
            // paymentService.processPayment(userId, paymentDetails);
            return ResponseEntity.ok().body("Payment processing placeholder"); // Placeholder response
        }


        // --- Profile ---
        @GetMapping("/profile")
        public ResponseEntity<ProfileDto> getTenantProfile() {
            Long userId = getCurrentUserId();
            ProfileDto profile = profileService.getProfileByUserId(userId);
            return ResponseEntity.ok(profile);
        }

        @PutMapping("/profile")
        public ResponseEntity<ProfileDto> updateTenantProfile(@Valid @RequestBody ProfileDto profileDto) {
            Long userId = getCurrentUserId();
            // Ensure the update is for the logged-in user's profile
            ProfileDto updatedProfile = profileService.updateProfile(userId, profileDto);
            return ResponseEntity.ok(updatedProfile);
        }
    }
