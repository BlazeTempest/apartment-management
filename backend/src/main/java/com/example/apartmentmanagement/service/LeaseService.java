package com.example.apartmentmanagement.service;

import com.example.apartmentmanagement.dto.LeaseDto;
import com.example.apartmentmanagement.model.Apartment;
import com.example.apartmentmanagement.model.Lease;
import com.example.apartmentmanagement.model.LeaseStatus;
import com.example.apartmentmanagement.model.Tenant;
import com.example.apartmentmanagement.repository.ApartmentRepository;
import com.example.apartmentmanagement.repository.LeaseRepository;
import com.example.apartmentmanagement.repository.TenantRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaseService {

    @Autowired
    private LeaseRepository leaseRepository;

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private ApartmentRepository apartmentRepository;

    @Transactional(readOnly = true)
    public List<LeaseDto> getAllLeases() {
        return leaseRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LeaseDto> getLeasesByStatus(LeaseStatus status) {
        return leaseRepository.findByStatus(status).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public LeaseDto getLeaseById(Long id) {
        Lease lease = leaseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lease not found with ID: " + id));
        return mapToDto(lease);
    }

    @Transactional(readOnly = true)
    public List<LeaseDto> getLeasesByTenantId(Long tenantId) {
        return leaseRepository.findByTenantId(tenantId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public LeaseDto getActiveLease(Long tenantId) {
        return leaseRepository.findByTenantIdAndStatus(tenantId, LeaseStatus.ACTIVE)
                .map(this::mapToDto)
                 .orElseThrow(() -> new EntityNotFoundException("No active lease found for tenant ID: " + tenantId));
    }

    @Transactional(readOnly = true)
    public LeaseDto getActiveLeaseByTenantUserId(Long userId) {
        // Find tenant by user ID first
        Tenant tenant = tenantRepository.findByProfileUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Tenant not found for user ID: " + userId));
        // Then find the active lease for that tenant ID
        return getActiveLease(tenant.getId());
    }

    @Transactional
    public LeaseDto createLease(LeaseDto leaseDto) {
        // Validate tenant exists
        Tenant tenant = tenantRepository.findById(leaseDto.getTenantId())
                .orElseThrow(() -> new EntityNotFoundException("Tenant not found with ID: " + leaseDto.getTenantId()));

        // Validate apartment exists
        Apartment apartment = apartmentRepository.findById(leaseDto.getApartmentId())
                .orElseThrow(() -> new EntityNotFoundException("Apartment not found with ID: " + leaseDto.getApartmentId()));

        // Check if tenant already has an active lease
        if (leaseRepository.findByTenantIdAndStatus(tenant.getId(), LeaseStatus.ACTIVE).isPresent()) {
            throw new IllegalStateException("Tenant already has an active lease");
        }

        // Create new lease
        Lease newLease = new Lease();
        newLease.setTenant(tenant);
        newLease.setApartment(apartment);
        newLease.setStartDate(leaseDto.getStartDate());
        newLease.setEndDate(leaseDto.getEndDate());
        newLease.setRent(leaseDto.getRent());
        newLease.setDeposit(leaseDto.getDeposit());
        newLease.setStatus(LeaseStatus.ACTIVE); // Default to ACTIVE
        newLease.setPdfUrl(leaseDto.getPdfUrl());

        Lease savedLease = leaseRepository.save(newLease);
        return mapToDto(savedLease);
    }

    @Transactional
    public LeaseDto updateLease(Long id, LeaseDto leaseDto) {
        Lease lease = leaseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lease not found with ID: " + id));

        // Update fields
        lease.setStartDate(leaseDto.getStartDate());
        lease.setEndDate(leaseDto.getEndDate());
        lease.setRent(leaseDto.getRent());
        lease.setDeposit(leaseDto.getDeposit());
        lease.setStatus(leaseDto.getStatus());
        lease.setPdfUrl(leaseDto.getPdfUrl());

        // If apartment is changing, validate and update
        if (!lease.getApartment().getId().equals(leaseDto.getApartmentId())) {
            Apartment newApartment = apartmentRepository.findById(leaseDto.getApartmentId())
                    .orElseThrow(() -> new EntityNotFoundException("Apartment not found with ID: " + leaseDto.getApartmentId()));
            lease.setApartment(newApartment);
        }

        // If tenant is changing, validate and update
        if (!lease.getTenant().getId().equals(leaseDto.getTenantId())) {
            Tenant newTenant = tenantRepository.findById(leaseDto.getTenantId())
                    .orElseThrow(() -> new EntityNotFoundException("Tenant not found with ID: " + leaseDto.getTenantId()));
            lease.setTenant(newTenant);
        }

        Lease updatedLease = leaseRepository.save(lease);
        return mapToDto(updatedLease);
    }

    @Transactional
    public LeaseDto terminateLease(Long id) {
        Lease lease = leaseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lease not found with ID: " + id));

        // Only active leases can be terminated
        if (lease.getStatus() != LeaseStatus.ACTIVE) {
            throw new IllegalStateException("Only active leases can be terminated");
        }

        lease.setStatus(LeaseStatus.TERMINATED);
        lease.setEndDate(LocalDate.now()); // Set end date to today

        Lease terminatedLease = leaseRepository.save(lease);
        return mapToDto(terminatedLease);
    }

    // Helper method to map Entity to DTO
    private LeaseDto mapToDto(Lease lease) {
        return LeaseDto.builder()
                .id(lease.getId())
                .tenantId(lease.getTenant().getId())
                .tenantName(lease.getTenant().getProfile().getFullName())
                .apartmentId(lease.getApartment().getId())
                .apartmentUnitNumber(lease.getApartment().getUnitNumber())
                .startDate(lease.getStartDate())
                .endDate(lease.getEndDate())
                .rent(lease.getRent())
                .deposit(lease.getDeposit())
                .status(lease.getStatus())
                .pdfUrl(lease.getPdfUrl())
                .build();
    }
}
