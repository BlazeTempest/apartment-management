package com.example.apartmentmanagement.model;

public enum MaintenanceStatus {
    OPEN,        // Request submitted, awaiting review/assignment
    IN_PROGRESS,    // Work has started
    COMPLETED,      // Work finished
    CANCELLED,      // Request cancelled by tenant or admin
    REJECTED,        // Request rejected by admin
    RESOLVED
}
