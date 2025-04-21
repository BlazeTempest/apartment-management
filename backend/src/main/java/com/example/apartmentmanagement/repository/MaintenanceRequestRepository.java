package com.example.apartmentmanagement.repository;

import com.example.apartmentmanagement.model.MaintenanceRequest;
import com.example.apartmentmanagement.model.MaintenanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {
    List<MaintenanceRequest> findByTenantId(Long tenantId);
    List<MaintenanceRequest> findByApartmentId(Long apartmentId);
    List<MaintenanceRequest> findByStatus(MaintenanceStatus status);
    long countByStatus(MaintenanceStatus status);
    long countByStatusNot(MaintenanceStatus status); // To count open requests (not resolved/closed)
}
