package com.example.apartmentmanagement.repository;

import com.example.apartmentmanagement.model.Lease;
import com.example.apartmentmanagement.model.LeaseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeaseRepository extends JpaRepository<Lease, Long> {
    List<Lease> findByTenantId(Long tenantId);
    List<Lease> findByApartmentId(Long apartmentId);
    List<Lease> findByStatus(LeaseStatus status);
    Optional<Lease> findByTenantIdAndStatus(Long tenantId, LeaseStatus status);
    long countByStatus(LeaseStatus status);
}
