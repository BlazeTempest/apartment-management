package com.example.apartmentmanagement.service;

import com.example.apartmentmanagement.dto.ProfileDto;
import com.example.apartmentmanagement.dto.TenantDto;
import com.example.apartmentmanagement.model.*;
import com.example.apartmentmanagement.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TenantService {

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private ApartmentRepository apartmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Needed for creating new users

    @Autowired
    private ProfileService profileService; // Reuse profile mapping logic

    @Transactional(readOnly = true)
    public List<TenantDto> getAllTenants() {
        return tenantRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TenantDto getTenantById(Long id) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tenant not found with ID: " + id));
        return mapToDto(tenant);
    }

     @Transactional(readOnly = true)
    public TenantDto getTenantByUserId(Long userId) {
        Tenant tenant = tenantRepository.findByProfileUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Tenant not found for user ID: " + userId));
        return mapToDto(tenant);
    }

    @Transactional
    public TenantDto createTenant(TenantDto tenantDto) {
        // 1. Validate Apartment exists
        Apartment apartment = apartmentRepository.findById(tenantDto.getApartmentId())
                .orElseThrow(() -> new EntityNotFoundException("Apartment not found with ID: " + tenantDto.getApartmentId()));

        // 2. Check if email already exists
        if (userRepository.existsByEmail(tenantDto.getProfile().getEmail())) {
            throw new IllegalArgumentException("Error: Email is already in use!");
        }

        // 3. Create User
        User newUser = new User();
        newUser.setEmail(tenantDto.getProfile().getEmail());
        // TODO: Handle password generation/setting securely. For now, using email as placeholder.
        // A better approach would be to generate a random password and email it,
        // or have a separate registration flow.
        newUser.setPassword(passwordEncoder.encode(tenantDto.getProfile().getEmail() + "_tempPass"));
        newUser.setRole(ERole.ROLE_TENANT);
        User savedUser = userRepository.save(newUser);

        // 4. Create Profile
        Profile newProfile = new Profile();
        newProfile.setUser(savedUser);
        newProfile.setId(savedUser.getId()); // Set userId explicitly
        newProfile.setFullName(tenantDto.getProfile().getFullName());
        newProfile.setPhone(tenantDto.getProfile().getPhone());
        newProfile.setEmergencyContact(tenantDto.getProfile().getEmergencyContact());
        Profile savedProfile = profileRepository.save(newProfile);

        // 5. Create Tenant
        Tenant newTenant = new Tenant();
        newTenant.setProfile(savedProfile);
        newTenant.setApartment(apartment);
        newTenant.setStatus(TenantStatus.ACTIVE); // Default to ACTIVE
        Tenant savedTenant = tenantRepository.save(newTenant);

        return mapToDto(savedTenant);
    }

    @Transactional
    public TenantDto updateTenant(Long id, TenantDto tenantDto) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tenant not found with ID: " + id));

        // Update Profile details via ProfileService
        profileService.updateProfile(tenant.getProfile().getId(), tenantDto.getProfile());

        // Update Apartment if changed
        if (!tenant.getApartment().getId().equals(tenantDto.getApartmentId())) {
            Apartment newApartment = apartmentRepository.findById(tenantDto.getApartmentId())
                    .orElseThrow(() -> new EntityNotFoundException("Apartment not found with ID: " + tenantDto.getApartmentId()));
            tenant.setApartment(newApartment);
        }

        // Update Tenant status
        tenant.setStatus(tenantDto.getStatus());

        Tenant updatedTenant = tenantRepository.save(tenant);
        // Refresh profile details after potential update
        Profile updatedProfile = profileRepository.findById(tenant.getProfile().getId()).orElseThrow();
        updatedTenant.setProfile(updatedProfile); // Ensure tenant object has latest profile

        return mapToDto(updatedTenant);
    }

    @Transactional
    public void deleteTenant(Long id) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tenant not found with ID: " + id));

        // Consider implications: delete user/profile? Mark as inactive?
        // For now, just delete the tenant record. Add cascading deletes or manual cleanup if needed.
        // Be cautious about deleting associated User/Profile if they might be reused or needed for logs.
        // A safer approach might be to set TenantStatus to INACTIVE.
        // Let's assume deletion means removing the tenant association.
        // We might need to handle related Leases, Payments, Maintenance Requests first.

        // Simple deletion for now:
        tenantRepository.delete(tenant);
        // Optionally delete profile and user if they are exclusively tied to this tenant role
        // profileRepository.delete(tenant.getProfile());
        // userRepository.delete(tenant.getProfile().getUser());
    }


    // Helper method to map Entity to DTO
    private TenantDto mapToDto(Tenant tenant) {
        ProfileDto profileDto = profileService.mapToDto(tenant.getProfile()); // Use ProfileService mapper
        return TenantDto.builder()
                .id(tenant.getId())
                .profile(profileDto)
                .apartmentId(tenant.getApartment() != null ? tenant.getApartment().getId() : null)
                .apartmentUnitNumber(tenant.getApartment() != null ? tenant.getApartment().getUnitNumber() : "N/A")
                .status(tenant.getStatus())
                .build();
    }
}
