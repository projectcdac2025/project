package com.bikerental.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bikerental.entities.Admin;
import com.bikerental.entities.Customer;
import com.bikerental.models.AuthResponse;
import com.bikerental.models.LoginDTO;
import com.bikerental.security.JwtUtil;
import com.bikerental.services.AdminService;
import com.bikerental.services.CustomerService;

@CrossOrigin
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private CustomerService customerService;
    @Autowired private AdminService adminService;
    @Autowired private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
        if (dto.getRole() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("role is required: CUSTOMER or ADMIN");
        }

        String userid = dto.getUserid();
        String role = dto.getRole().toUpperCase();

        if ("ADMIN".equals(role)) {
            Admin admin = adminService.validate(dto.getUserid(), dto.getPwd());
            if (admin == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }
        } else {
            Customer customer = customerService.validate(dto.getUserid(), dto.getPwd());
            if (customer == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        String token = jwtUtil.generateToken(userid, claims);
        return ResponseEntity.ok(new AuthResponse(token, userid, role));
    }
}

