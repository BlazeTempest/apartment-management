package com.example.apartmentmanagement.service;

import com.example.apartmentmanagement.dto.MaintenanceRequestDto;
import com.example.apartmentmanagement.model.*;
import com.example.apartmentmanagement.repository.ApartmentRepository;
import com.example.apartmentmanagement.repository.MaintenanceRequestRepository;
import com.example.apartmentmanagement.repository.TenantRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MaintenanceRequestService {

    @Autowired
    private MaintenanceRequestRepository maintenanceRequestRepository;

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private ApartmentRepository apartmentRepository;

    @Transactional(readOnly = true)
    public List<MaintenanceRequestDto> getAllMaintenanceRequests() {
        return maintenanceRequestRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MaintenanceRequestDto getMaintenanceRequestById(Long id) {
        MaintenanceRequest request = maintenanceRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Maintenance request not found with ID: " + id));
        return mapToDto(request);
    }

    @Transactional(readOnly = true)
    public List<MaintenanceRequestDto> getMaintenanceRequestsByTenantId(Long tenantId) {
        return maintenanceRequestRepository.findByTenantId(tenantId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MaintenanceRequestDto> getMaintenanceRequestsByStatus(MaintenanceStatus status) {
        return maintenanceRequestRepository.findByStatus(status).stream()
                .map(this::mapToDto)
                 .collect(Collectors.toList());
    }

     @Transactional(readOnly = true)
    public List<MaintenanceRequestDto> getMaintenanceRequestsByTenantUserId(Long userId) {
        // Find tenant by user ID first
        Tenant tenant = tenantRepository.findByProfileUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Tenant not found for user ID: " + userId));
        // Then find requests by tenant ID
        return getMaintenanceRequestsByTenantId(tenant.getId());
    }

    @Transactional
    public MaintenanceRequestDto createMaintenanceRequest(Long userId, MaintenanceRequestDto requestDto) {
        // Find tenant by user ID
        Tenant tenant = tenantRepository.findByProfileUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Tenant not found for user ID: " + userId));

        // Use tenant's apartment (assuming tenant is linked to one apartment)
        Apartment apartment = tenant.getApartment();
        if (apartment == null) {
             throw new IllegalStateException("Tenant is not associated with an apartment.");
        }

        // Create new maintenance request
        MaintenanceRequest newRequest = new MaintenanceRequest();
        newRequest.setTenant(tenant);
        newRequest.setApartment(apartment); // Set apartment from tenant
        newRequest.setIssueType(requestDto.getIssueType());
        newRequest.setDescription(requestDto.getDescription());
        newRequest.setPreferredDate(requestDto.getPreferredDate());
        newRequest.setUrgency(requestDto.getUrgency());
        newRequest.setStatus(MaintenanceStatus.OPEN); // Default to PENDING
        newRequest.setCreatedAt(LocalDateTime.now());
        // No technician notes or resolved date for new requests

        MaintenanceRequest savedRequest = maintenanceRequestRepository.save(newRequest);
        return mapToDto(savedRequest);
    }

    @Transactional
    public MaintenanceRequestDto updateMaintenanceRequest(Long id, MaintenanceRequestDto requestDto) {
        MaintenanceRequest request = maintenanceRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Maintenance request not found with ID: " + id));

        // Update fields
        request.setIssueType(requestDto.getIssueType());
        request.setDescription(requestDto.getDescription());
        request.setPreferredDate(requestDto.getPreferredDate());
        request.setUrgency(requestDto.getUrgency());
        request.setStatus(requestDto.getStatus());
        request.setTechnicianNotes(requestDto.getTechnicianNotes());

        // If status is changing to RESOLVED, set resolved date
        if (request.getStatus() != MaintenanceStatus.RESOLVED && requestDto.getStatus() == MaintenanceStatus.RESOLVED) {
            request.setResolvedAt(LocalDateTime.now());
        }

        MaintenanceRequest updatedRequest = maintenanceRequestRepository.save(request);
        return mapToDto(updatedRequest);
    }

    @Transactional
    public MaintenanceRequestDto updateMaintenanceRequestStatus(Long id, MaintenanceStatus status, String technicianNotes) {
        MaintenanceRequest request = maintenanceRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Maintenance request not found with ID: " + id));

        request.setStatus(status);
        
        if (technicianNotes != null && !technicianNotes.isEmpty()) {
            request.setTechnicianNotes(technicianNotes);
        }

        // If status is changing to RESOLVED, set resolved date
        if (status == MaintenanceStatus.RESOLVED) {
            request.setResolvedAt(LocalDateTime.now());
        }

        MaintenanceRequest updatedRequest = maintenanceRequestRepository.save(request);
        return mapToDto(updatedRequest);
    }

    // Helper method to map Entity to DTO
    private MaintenanceRequestDto mapToDto(MaintenanceRequest request) {
        return MaintenanceRequestDto.builder()
                .id(request.getId())
                .tenantId(request.getTenant().getId())
                .tenantName(request.getTenant().getProfile().getFullName())
                .apartmentId(request.getApartment().getId())
                .apartmentUnitNumber(request.getApartment().getUnitNumber())
                .issueType(request.getIssueType())
                .description(request.getDescription())
                .preferredDate(request.getPreferredDate())
                .urgency(request.getUrgency())
                .status(request.getStatus())
                .technicianNotes(request.getTechnicianNotes())
                .createdAt(request.getCreatedAt())
                .resolvedAt(request.getResolvedAt())
                .build();
    }
}
