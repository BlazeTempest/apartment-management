package com.example.apartmentmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileDto {
    private Long id;
    private Long userId;
    private String fullName;
    private String phone;
    private String emergencyContact;
    private String email; // Include email from associated User
}
