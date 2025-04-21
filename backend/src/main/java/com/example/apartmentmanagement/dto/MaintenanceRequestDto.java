package com.example.apartmentmanagement.dto;

import com.example.apartmentmanagement.model.MaintenanceIssueType;
import com.example.apartmentmanagement.model.MaintenanceStatus;
import com.example.apartmentmanagement.model.MaintenanceUrgency;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceRequestDto {
    private Long id;
    private Long tenantId;
    private String tenantName; // Include tenant name
    private Long apartmentId;
    private String apartmentUnitNumber; // Include unit number
    private MaintenanceIssueType issueType;
    private String description;
    private LocalDate preferredDate;
    private MaintenanceUrgency urgency;
    private MaintenanceStatus status;
    private String technicianNotes;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}
