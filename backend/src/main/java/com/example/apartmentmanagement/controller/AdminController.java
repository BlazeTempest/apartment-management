package com.example.apartmentmanagement.controller;

import com.example.apartmentmanagement.dto.LeaseDto; // Import LeaseDto
import com.example.apartmentmanagement.dto.TenantDto;
import com.example.apartmentmanagement.service.LeaseService; // Import LeaseService
import com.example.apartmentmanagement.service.TenantService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600) // Adjust for production
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')") // Secure all endpoints in this controller for ADMIN role
public class AdminController {

    @Autowired
    private TenantService tenantService;

    @Autowired
    private LeaseService leaseService; // Inject LeaseService

    // --- Tenant Management Endpoints ---

    @GetMapping("/tenants")
    public ResponseEntity<List<TenantDto>> getAllTenants() {
        List<TenantDto> tenants = tenantService.getAllTenants();
        System.out.println(tenants.size());
        return ResponseEntity.ok(tenants);
    }

    @GetMapping("/tenants/{id}")
    public ResponseEntity<TenantDto> getTenantById(@PathVariable Long id) {
        try {
            TenantDto tenant = tenantService.getTenantById(id);
            return ResponseEntity.ok(tenant);
        } catch (jakarta.persistence.EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/tenants")
    public ResponseEntity<?> createTenant(@Valid @RequestBody TenantDto tenantDto) {
        try {
            TenantDto createdTenant = tenantService.createTenant(tenantDto);
            return new ResponseEntity<>(createdTenant, HttpStatus.CREATED);
        } catch (IllegalArgumentException | jakarta.persistence.EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/tenants/{id}")
    public ResponseEntity<?> updateTenant(@PathVariable Long id, @Valid @RequestBody TenantDto tenantDto) {
        try {
            TenantDto updatedTenant = tenantService.updateTenant(id, tenantDto);
            return ResponseEntity.ok(updatedTenant);
        } catch (jakarta.persistence.EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/tenants/{id}")
    public ResponseEntity<Void> deleteTenant(@PathVariable Long id) {
        try {
            tenantService.deleteTenant(id);
            return ResponseEntity.noContent().build(); // Standard practice for successful DELETE
        } catch (jakarta.persistence.EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // --- Lease Management Endpoints ---

    @GetMapping("/leases")
    public ResponseEntity<List<LeaseDto>> getAllLeases() {
        List<LeaseDto> leases = leaseService.getAllLeases();
        return ResponseEntity.ok(leases);
    }

     @GetMapping("/leases/{id}")
    public ResponseEntity<LeaseDto> getLeaseById(@PathVariable Long id) {
        try {
            LeaseDto lease = leaseService.getLeaseById(id);
            return ResponseEntity.ok(lease);
        } catch (jakarta.persistence.EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/leases")
    public ResponseEntity<?> createLease(@Valid @RequestBody LeaseDto leaseDto) {
        try {
            LeaseDto createdLease = leaseService.createLease(leaseDto);
            return new ResponseEntity<>(createdLease, HttpStatus.CREATED);
        } catch (IllegalArgumentException | IllegalStateException | jakarta.persistence.EntityNotFoundException e) {
            // Catch potential errors like tenant not found, apartment not found, tenant already has active lease
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Endpoint specifically for terminating a lease
    @PutMapping("/leases/{id}/terminate")
    public ResponseEntity<?> terminateLease(@PathVariable Long id) {
         try {
            LeaseDto terminatedLease = leaseService.terminateLease(id);
            return ResponseEntity.ok(terminatedLease);
        } catch (jakarta.persistence.EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
             // Catch errors like trying to terminate a non-active lease
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // TODO: Add endpoints for Maintenance, Payment Management ---

}
