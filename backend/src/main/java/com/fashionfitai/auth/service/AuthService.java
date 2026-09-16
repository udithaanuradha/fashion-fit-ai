package com.fashionfitai.auth.service;

import com.fashionfitai.auth.dto.AuthResponse;
import com.fashionfitai.auth.dto.LoginRequest;
import com.fashionfitai.auth.dto.RegisterRequest;
import com.fashionfitai.auth.entity.Role;
import com.fashionfitai.auth.entity.User;
import com.fashionfitai.auth.repository.UserRepository;
import com.fashionfitai.auth.security.JwtService;
import com.fashionfitai.common.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                        PasswordEncoder passwordEncoder,
                        JwtService jwtService,
                        AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ApiException(HttpStatus.CONFLICT, "An account with this email already exists");
        }

        User user = new User(
                request.email(),
                passwordEncoder.encode(request.password()),
                request.fullName(),
                Role.USER
        );
        userRepository.save(user);

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getUsername(), user.getFullName(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getUsername(), user.getFullName(), user.getRole().name());
    }
}
