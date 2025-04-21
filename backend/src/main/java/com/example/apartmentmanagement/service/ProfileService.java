package com.example.apartmentmanagement.service;

import com.example.apartmentmanagement.dto.ProfileDto;
import com.example.apartmentmanagement.model.Profile;
import com.example.apartmentmanagement.model.User;
import com.example.apartmentmanagement.repository.ProfileRepository;
import com.example.apartmentmanagement.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private UserRepository userRepository; // Needed to fetch user details like email

    @Transactional(readOnly = true)
    public ProfileDto getProfileByUserId(Long userId) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Profile not found for user ID: " + userId));
        // Eagerly fetch the user to avoid lazy loading issues if needed later,
        // or ensure the mapping method handles it.
        // User user = userRepository.findById(userId).orElseThrow(...); // Alternative fetch
        return mapToDto(profile);
    }

    @Transactional
    public ProfileDto updateProfile(Long userId, ProfileDto profileDto) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Profile not found for user ID: " + userId));

        // Update fields from DTO
        profile.setFullName(profileDto.getFullName());
        profile.setPhone(profileDto.getPhone());
        profile.setEmergencyContact(profileDto.getEmergencyContact());
        // Note: Email is typically not updated via profile service, managed via User entity

        Profile updatedProfile = profileRepository.save(profile);
        return mapToDto(updatedProfile);
    }

    // Helper method to map Entity to DTO
    public ProfileDto mapToDto(Profile profile) {
        User user = profile.getUser(); // Get associated user from the relationship
        if (user == null) {
             // This might happen if the relationship is not loaded correctly or if data is inconsistent
             // Handle appropriately, maybe fetch user separately or throw an error
             user = userRepository.findById(profile.getId())
                     .orElseThrow(() -> new EntityNotFoundException("User not found for profile ID: " + profile.getId()));
        }
        return ProfileDto.builder()
                .id(profile.getId())
                .userId(user.getId())
                .email(user.getEmail()) // Include email from User
                .fullName(profile.getFullName())
                .phone(profile.getPhone())
                .emergencyContact(profile.getEmergencyContact())
                .build();
    }

    // Consider adding a method to create a profile if needed,
    // perhaps during user registration or tenant creation.
    // public Profile createProfileForUser(User user, String fullName, String phone) { ... }
}
