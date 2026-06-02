package com.substring.auth.app.auth.controllers;

import com.substring.auth.app.auth.config.AppConstants;
import com.substring.auth.app.auth.entities.User;
import com.substring.auth.app.auth.payload.UserDto;
import com.substring.auth.app.auth.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    // ===== Self-service endpoints (any authenticated user) =====

    //get current authenticated user's profile
    @GetMapping("/me")
    public ResponseEntity<UserDto> getMyProfile() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(userService.getUserById(currentUser.getId().toString()));
    }

    //update current authenticated user's profile
    @PutMapping("/me")
    public ResponseEntity<UserDto> updateMyProfile(@RequestBody UserDto userDto) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(userService.updateUser(userDto, currentUser.getId().toString()));
    }

    //delete current authenticated user's account
    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteMyAccount() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        userService.deleteUser(currentUser.getId().toString());
        return ResponseEntity.noContent().build();
    }

    // ===== Admin endpoints =====

    //create user api
    @PostMapping
    public ResponseEntity<UserDto> createUser(@RequestBody UserDto userDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(userDto));
    }

    // get all user api
    @GetMapping
    public ResponseEntity<Iterable<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // get user by email
    @GetMapping("/email/{email}")
    public ResponseEntity<UserDto> getUserByEmail(@PathVariable("email") String email) {
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    //delete user
    //api/v1/users/{userId}
    @DeleteMapping("/{userId}")
    public void deleteUser(@PathVariable("userId") String userId) {
        userService.deleteUser(userId);
    }

    //update user
    //api/v1/users/{userId}
    @PutMapping("/{userId}")
    public ResponseEntity<UserDto> updateUser(@RequestBody UserDto userDto, @PathVariable("userId") String userId) {
        return ResponseEntity.ok(userService.updateUser(userDto, userId));
    }

    //get user by id
    //api/v1/users/{userId}
    @PreAuthorize("hasRole('"+ AppConstants.ADMIN_ROLE +"')")
    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUserById(@PathVariable("userId") String userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

}

