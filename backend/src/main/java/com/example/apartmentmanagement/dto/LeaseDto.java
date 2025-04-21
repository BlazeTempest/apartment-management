package com.example.apartmentmanagement.dto;

import com.example.apartmentmanagement.model.LeaseStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaseDto {
    private Long id;
    private Long tenantId;
    private String tenantName; // Include tenant name
    private Long apartmentId;
    private String apartmentUnitNumber; // Include unit number
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal rent;
    private BigDecimal deposit;
    private LeaseStatus status;
    private String pdfUrl;
}
