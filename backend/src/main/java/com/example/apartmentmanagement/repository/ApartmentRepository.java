package com.example.apartmentmanagement.repository;

import com.example.apartmentmanagement.model.Apartment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional; // Import Optional if needed for other methods

@Repository
public interface ApartmentRepository extends JpaRepository<Apartment, Long> {
    // Method to check if an apartment with a given unit number exists
    boolean existsByUnitNumber(String unitNumber);

    // Optional: Method to find by unit number if needed elsewhere
    // Optional<Apartment> findByUnitNumber(String unitNumber);
}
