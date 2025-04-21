package com.example.apartmentmanagement.repository;

import com.example.apartmentmanagement.model.Tenant;
import com.example.apartmentmanagement.model.TenantStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, Long> {
    Optional<Tenant> findByProfileUserId(Long userId);
    List<Tenant> findByStatus(TenantStatus status);
    long countByStatus(TenantStatus status);
}
