package com.example.apartmentmanagement.repository;

import com.example.apartmentmanagement.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByTenantId(Long tenantId);
    List<Payment> findByLeaseId(Long leaseId);
    List<Payment> findByStatus(String status);
    List<Payment> findByPaymentDateBetween(LocalDate startDate, LocalDate endDate);

    // Query to calculate total revenue for a given month and year
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE FUNCTION('YEAR', p.paymentDate) = :year AND FUNCTION('MONTH', p.paymentDate) = :month AND p.status = 'Completed'")
    BigDecimal findTotalRevenueByMonthAndYear(@Param("year") int year, @Param("month") int month);
}
