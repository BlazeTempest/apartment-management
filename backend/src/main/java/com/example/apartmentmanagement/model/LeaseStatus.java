package com.example.apartmentmanagement.model;

public enum LeaseStatus {
    ACTIVE,
    EXPIRED,
    TERMINATED,
    PENDING_START, // Lease signed but not yet started
    PENDING_RENEWAL
}
