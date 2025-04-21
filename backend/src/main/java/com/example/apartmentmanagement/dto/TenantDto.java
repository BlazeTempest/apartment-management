package com.example.apartmentmanagement.dto;

import com.example.apartmentmanagement.model.TenantStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TenantDto {
    private Long id;
    private ProfileDto profile; // Embed profile details
    private Long apartmentId;
    private String apartmentUnitNumber; // Include unit number for convenience
    private TenantStatus status;
}
