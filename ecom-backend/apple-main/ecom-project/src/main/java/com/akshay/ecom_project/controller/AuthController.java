package com.akshay.ecom_project.controller;

import com.akshay.ecom_project.dto.AuthRequest;
import com.akshay.ecom_project.dto.AuthResponse;
import com.akshay.ecom_project.dto.UserDTO;
import com.akshay.ecom_project.mapper.UserMapper;
import com.akshay.ecom_project.model.Role;
import com.akshay.ecom_project.model.User;
import com.akshay.ecom_project.repo.UserRepo;
import com.akshay.ecom_project.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserMapper userMapper;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
        );

        if (authentication.isAuthenticated()) {
            String token = jwtUtil.generateToken(authRequest.getEmail());
            User user = userRepo.findByEmail(authRequest.getEmail()).orElseThrow();
            UserDTO userDTO = userMapper.toDTO(user);

            return ResponseEntity.ok(new AuthResponse(token, userDTO));
        } else {
            throw new BadCredentialsException("Invalid credentials");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepo.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is already registered");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Defaults to USER role
        if (user.getRole() == null) {
            user.setRole(Role.USER);
        }

        User savedUser = userRepo.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(userMapper.toDTO(savedUser));
    }
}
