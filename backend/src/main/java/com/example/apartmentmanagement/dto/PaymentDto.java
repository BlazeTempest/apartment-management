package com.example.apartmentmanagement.dto;

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
public class PaymentDto {
    private Long id;
    private Long leaseId;
    private Long tenantId;
    private String tenantName; // Include tenant name
    private String apartmentUnitNumber; // Include unit number
    private BigDecimal amount;
    private LocalDate paymentDate;
    private String method;
    private String transactionId;
    private String status;
}
