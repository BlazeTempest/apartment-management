package com.example.apartmentmanagement.service;

    import com.example.apartmentmanagement.dto.ApartmentDto;
    import com.example.apartmentmanagement.model.Apartment;
    import com.example.apartmentmanagement.repository.ApartmentRepository;
    import jakarta.persistence.EntityNotFoundException;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.stereotype.Service;
    import org.springframework.transaction.annotation.Transactional;

    import java.util.List;
    import java.util.stream.Collectors;

    @Service
    public class ApartmentService {

        @Autowired
        private ApartmentRepository apartmentRepository;

        @Transactional(readOnly = true)
        public List<ApartmentDto> getAllApartments() {
            return apartmentRepository.findAll().stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
        }

        @Transactional(readOnly = true)
        public ApartmentDto getApartmentById(Long id) {
            Apartment apartment = apartmentRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Apartment not found with ID: " + id));
            return mapToDto(apartment);
        }

        @Transactional
        public ApartmentDto createApartment(ApartmentDto apartmentDto) {
            // Optional: Check if unit number already exists
            if (apartmentRepository.existsByUnitNumber(apartmentDto.getUnitNumber())) {
                 throw new IllegalArgumentException("Error: Unit number '" + apartmentDto.getUnitNumber() + "' already exists.");
            }

            Apartment apartment = mapToEntity(apartmentDto);
            Apartment savedApartment = apartmentRepository.save(apartment);
            return mapToDto(savedApartment);
        }

        @Transactional
        public ApartmentDto updateApartment(Long id, ApartmentDto apartmentDto) {
            Apartment existingApartment = apartmentRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Apartment not found with ID: " + id));

            // Optional: Check if updated unit number conflicts with another apartment
            if (!existingApartment.getUnitNumber().equals(apartmentDto.getUnitNumber()) &&
                apartmentRepository.existsByUnitNumber(apartmentDto.getUnitNumber())) {
                 throw new IllegalArgumentException("Error: Unit number '" + apartmentDto.getUnitNumber() + "' already exists.");
            }

            // Update fields
            existingApartment.setUnitNumber(apartmentDto.getUnitNumber());
            existingApartment.setAddress(apartmentDto.getAddress());
            existingApartment.setFloor(apartmentDto.getFloor());
            existingApartment.setDescription(apartmentDto.getDescription());
            // Update other fields as needed

            Apartment updatedApartment = apartmentRepository.save(existingApartment);
            return mapToDto(updatedApartment);
        }

        @Transactional
        public void deleteApartment(Long id) {
            Apartment apartment = apartmentRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Apartment not found with ID: " + id));

            // TODO: Add checks here - cannot delete if apartment has active leases/tenants?
            // Example check (requires LeaseRepository injection):
            // if (leaseRepository.existsByApartmentIdAndStatus(id, LeaseStatus.ACTIVE)) {
            //     throw new IllegalStateException("Cannot delete apartment with active leases.");
            // }

            apartmentRepository.delete(apartment);
        }

        // --- Helper Mappers ---

        private ApartmentDto mapToDto(Apartment apartment) {
            return ApartmentDto.builder()
                    .id(apartment.getId())
                    .unitNumber(apartment.getUnitNumber())
                    .address(apartment.getAddress())
                    .floor(apartment.getFloor())
                    .description(apartment.getDescription())
                    .build();
        }

        private Apartment mapToEntity(ApartmentDto apartmentDto) {
            // Note: When mapping from DTO to Entity for creation/update,
            // we usually don't set the ID as it's generated or comes from the path variable.
            return Apartment.builder()
                    .unitNumber(apartmentDto.getUnitNumber())
                    .address(apartmentDto.getAddress())
                    .floor(apartmentDto.getFloor())
                    .description(apartmentDto.getDescription())
                    .build();
        }
    }
