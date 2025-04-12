package com.example.apartmentmanagement.model;

public enum MaintenanceStatus {
    PENDING,        // Request submitted, awaiting review/assignment
    SCHEDULED,      // Technician assigned, appointment set
    IN_PROGRESS,    // Work has started
    ON_HOLD,        // Work paused (e.g., waiting for parts)
    COMPLETED,      // Work finished
    CANCELLED,      // Request cancelled by tenant or admin
    REJECTED        // Request rejected by admin
}
