package com.example.apartmentmanagement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "leases")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lease {

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
    @Column(name = "start_date")
    private LocalDate startDate;

    @NotNull
    @Column(name = "end_date")
    private LocalDate endDate; // Consider validation: endDate > startDate

    @NotNull
    @PositiveOrZero
    private BigDecimal rent;

    @PositiveOrZero // Can be zero if no deposit
    private BigDecimal deposit;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private LeaseStatus status; // e.g., ACTIVE, EXPIRED, TERMINATED, PENDING

    @Column(name = "pdf_url")
    private String pdfUrl; // URL to the stored lease document

    // Relationships
    @OneToMany(mappedBy = "lease", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Payment> payments = new HashSet<>();

}
