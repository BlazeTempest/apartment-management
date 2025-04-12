package com.example.apartmentmanagement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "apartments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Apartment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 20)
    @Column(name = "unit_number", unique = true) // Assuming unit numbers are unique within the property
    private String unitNumber;

    @Size(max = 255)
    private String address; // Could be part of a larger Property entity if managing multiple buildings

    @Column(name = "floor")
    private Integer floor; // Optional floor number

    @Lob // For potentially longer descriptions
    private String description;

    // Relationships
    @OneToMany(mappedBy = "apartment", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Tenant> tenants = new HashSet<>();

    @OneToMany(mappedBy = "apartment", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Lease> leases = new HashSet<>();

    @OneToMany(mappedBy = "apartment", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<MaintenanceRequest> maintenanceRequests = new HashSet<>();

}
