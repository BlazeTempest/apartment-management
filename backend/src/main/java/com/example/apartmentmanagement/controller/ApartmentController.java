package com.example.apartmentmanagement.controller;

import com.example.apartmentmanagement.dto.ApartmentDto;
import com.example.apartmentmanagement.service.ApartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/apartments")
public class ApartmentController {

    @Autowired
    private ApartmentService apartmentService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ApartmentDto>> getAllApartments() {
        List<ApartmentDto> apartments = apartmentService.getAllApartments();
        return ResponseEntity.ok(apartments);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApartmentDto> getApartmentById(@PathVariable Long id) {
        ApartmentDto apartment = apartmentService.getApartmentById(id);
        return ResponseEntity.ok(apartment);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApartmentDto> createApartment(@Valid @RequestBody ApartmentDto apartmentDto) {
        ApartmentDto createdApartment = apartmentService.createApartment(apartmentDto);
        return ResponseEntity.ok(createdApartment);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApartmentDto> updateApartment(@PathVariable Long id, @Valid @RequestBody ApartmentDto apartmentDto) {
        ApartmentDto updatedApartment = apartmentService.updateApartment(id, apartmentDto);
        return ResponseEntity.ok(updatedApartment);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteApartment(@PathVariable Long id) {
        apartmentService.deleteApartment(id);
        return ResponseEntity.noContent().build();
    }
}
