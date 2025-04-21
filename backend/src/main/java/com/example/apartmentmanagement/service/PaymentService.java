package com.example.apartmentmanagement.service;

import com.example.apartmentmanagement.dto.PaymentDto;
import com.example.apartmentmanagement.model.Lease;
import com.example.apartmentmanagement.model.Payment;
import com.example.apartmentmanagement.model.Tenant;
import com.example.apartmentmanagement.repository.LeaseRepository;
import com.example.apartmentmanagement.repository.PaymentRepository;
import com.example.apartmentmanagement.repository.TenantRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private LeaseRepository leaseRepository;

    @Transactional(readOnly = true)
    public List<PaymentDto> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(this::mapToDto)
                 .collect(Collectors.toList());
    }

     @Transactional(readOnly = true)
    public List<PaymentDto> getPaymentsByTenantUserId(Long userId) {
        // Find tenant by user ID first
        Tenant tenant = tenantRepository.findByProfileUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Tenant not found for user ID: " + userId));
        // Then find payments by tenant ID
        return getPaymentsByTenantId(tenant.getId());
    }

    @Transactional(readOnly = true)
    public PaymentDto getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Payment not found with ID: " + id));
        return mapToDto(payment);
    }

    @Transactional(readOnly = true)
    public List<PaymentDto> getPaymentsByTenantId(Long tenantId) {
        return paymentRepository.findByTenantId(tenantId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PaymentDto> getPaymentsByLeaseId(Long leaseId) {
        return paymentRepository.findByLeaseId(leaseId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PaymentDto> getPaymentsByStatus(String status) {
        return paymentRepository.findByStatus(status).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PaymentDto> getPaymentsByDateRange(LocalDate startDate, LocalDate endDate) {
        return paymentRepository.findByPaymentDateBetween(startDate, endDate).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BigDecimal getMonthlyRevenue(int year, int month) {
        BigDecimal revenue = paymentRepository.findTotalRevenueByMonthAndYear(year, month);
        return revenue != null ? revenue : BigDecimal.ZERO;
    }

    @Transactional
    public PaymentDto createPayment(PaymentDto paymentDto) {
        // Validate tenant exists
        Tenant tenant = tenantRepository.findById(paymentDto.getTenantId())
                .orElseThrow(() -> new EntityNotFoundException("Tenant not found with ID: " + paymentDto.getTenantId()));

        // Validate lease exists
        Lease lease = leaseRepository.findById(paymentDto.getLeaseId())
                .orElseThrow(() -> new EntityNotFoundException("Lease not found with ID: " + paymentDto.getLeaseId()));

        // Validate tenant and lease match
        if (!lease.getTenant().getId().equals(tenant.getId())) {
            throw new IllegalArgumentException("Lease ID " + paymentDto.getLeaseId() + 
                                              " does not belong to tenant ID " + paymentDto.getTenantId());
        }

        // Create new payment
        Payment newPayment = new Payment();
        newPayment.setTenant(tenant);
        newPayment.setLease(lease);
        newPayment.setAmount(paymentDto.getAmount());
        newPayment.setPaymentDate(paymentDto.getPaymentDate() != null ? 
                                 paymentDto.getPaymentDate() : LocalDate.now());
        newPayment.setMethod(paymentDto.getMethod());
        newPayment.setTransactionId(paymentDto.getTransactionId());
        newPayment.setStatus(paymentDto.getStatus() != null ? 
                            paymentDto.getStatus() : "Completed"); // Default to "Completed"

        Payment savedPayment = paymentRepository.save(newPayment);
        return mapToDto(savedPayment);
    }

    @Transactional
    public PaymentDto updatePaymentStatus(Long id, String status) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Payment not found with ID: " + id));

        payment.setStatus(status);
        Payment updatedPayment = paymentRepository.save(payment);
        return mapToDto(updatedPayment);
    }

    // Helper method to map Entity to DTO
    private PaymentDto mapToDto(Payment payment) {
        return PaymentDto.builder()
                .id(payment.getId())
                .leaseId(payment.getLease().getId())
                .tenantId(payment.getTenant().getId())
                .tenantName(payment.getTenant().getProfile().getFullName())
                .apartmentUnitNumber(payment.getLease().getApartment().getUnitNumber())
                .amount(payment.getAmount())
                .paymentDate(payment.getPaymentDate())
                .method(payment.getMethod())
                .transactionId(payment.getTransactionId())
                .status(payment.getStatus())
                .build();
    }
}
