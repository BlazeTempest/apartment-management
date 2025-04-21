package com.example.apartmentmanagement.service;

import com.example.apartmentmanagement.dto.JwtResponse;
import com.example.apartmentmanagement.dto.LoginRequest;
import com.example.apartmentmanagement.dto.RegisterRequest; // Add import for RegisterRequest DTO
import com.example.apartmentmanagement.model.ERole;
import com.example.apartmentmanagement.model.User;
import com.example.apartmentmanagement.repository.UserRepository; // Add import for UserRepository
import com.example.apartmentmanagement.security.JwtUtils;
import com.example.apartmentmanagement.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder; // Add import for PasswordEncoder
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Optional: For transactional integrity

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    UserRepository userRepository; // Inject UserRepository

    @Autowired
    PasswordEncoder passwordEncoder; // Inject PasswordEncoder

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return new JwtResponse(jwt,
                               userDetails.getId(),
                               userDetails.getUsername(), // getUsername() returns email here
                               roles);
    }

    @Transactional // Optional: Ensure registration is atomic
    public User registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!"); // Or a custom exception
        }

        // Create new user's account
        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword())); // Use setPassword

        // Assign default role (e.g., TENANT) or based on request if applicable
        // For simplicity, assigning TENANT by default. Admin creation might be separate.
        user.setRole(ERole.ROLE_TENANT);

        return userRepository.save(user);

        // Note: Depending on the flow, you might also create a Profile here
        // using ProfileService, linking it to the newly created user.
        // For now, just creating the User entity.
    }
}
