package com.example.apartmentmanagement.controller;

import com.example.apartmentmanagement.dto.JwtResponse;
import com.example.apartmentmanagement.dto.LoginRequest;
import com.example.apartmentmanagement.dto.RegisterRequest;
import com.example.apartmentmanagement.model.User;
import com.example.apartmentmanagement.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600) // Allow requests from any origin (adjust for production)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(jwtResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            User user = authService.registerUser(registerRequest);
            // Return a success message or the created user details (excluding password)
            // For simplicity, returning a success message.
            return ResponseEntity.ok("User registered successfully!");
        } catch (RuntimeException e) {
            // Handle specific exceptions like email already exists
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage()); // Send back the error message
        }
    }

    // Optional: Add an endpoint to get the current user's details (/api/auth/me)
    // This would typically involve getting the principal from SecurityContextHolder
    // and returning relevant user information (e.g., ID, email, roles).
    // Example:
    /*
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()") // Ensure user is logged in
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        // Return user details (DTO recommended to avoid exposing sensitive info)
        return ResponseEntity.ok(Map.of(
            "id", userDetails.getId(),
            "email", userDetails.getUsername(),
            "roles", userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList())
        ));
    }
    */
}
