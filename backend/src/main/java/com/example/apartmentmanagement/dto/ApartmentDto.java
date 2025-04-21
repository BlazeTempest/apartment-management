package com.example.apartmentmanagement.dto;

    import jakarta.validation.constraints.Min;
    import jakarta.validation.constraints.NotBlank;
    import lombok.AllArgsConstructor;
    import lombok.Builder;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public class ApartmentDto {

        private Long id;

        @NotBlank(message = "Unit number is required")
        private String unitNumber;

        @NotBlank(message = "Address is required")
        private String address;

        @Min(value = 0, message = "Floor must be a non-negative number")
        private int floor;

        private String description;

        // Add other relevant fields if needed, e.g., number of bedrooms, bathrooms, size
    }
