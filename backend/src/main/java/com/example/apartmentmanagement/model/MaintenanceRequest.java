package com.example.apartmentmanagement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp; // Or use @LastModifiedDate with Auditing

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "maintenance_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "apartment_id", nullable = false)
    private Apartment apartment;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "issue_type", length = 50)
    private MaintenanceIssueType issueType; // e.g., PLUMBING, ELECTRICAL, HVAC

    @NotBlank
    @Lob // For potentially long descriptions
    private String description;

    @Column(name = "preferred_date")
    private LocalDate preferredDate; // Optional preferred date for service

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private MaintenanceUrgency urgency; // e.g., NORMAL, URGENT, EMERGENCY

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private MaintenanceStatus status; // e.g., PENDING, IN_PROGRESS, COMPLETED, CANCELLED

    @Lob
    @Column(name = "technician_notes")
    private String technicianNotes;

    @CreationTimestamp // Automatically set on creation
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt; // Set when status becomes COMPLETED

    // Consider adding assigned_technician_id if tracking specific technicians
}
