package com.substring.auth.app.auth.services.impl;

import com.substring.auth.app.auth.config.AppConstants;
import com.substring.auth.app.auth.payload.UserDto;
import com.substring.auth.app.auth.entities.Provider;
import com.substring.auth.app.auth.entities.Role;
import com.substring.auth.app.auth.entities.User;
import com.substring.auth.app.exceptions.ResourceNotFoundException;
import com.substring.auth.app.auth.helpers.UserHelper;
import com.substring.auth.app.auth.repositories.RoleRepository;
import com.substring.auth.app.auth.repositories.UserRepository;
import com.substring.auth.app.auth.services.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final RoleRepository roleRepository;

    @Override
    @Transactional
    public UserDto createUser(UserDto userDto) {
        if (userDto.getEmail() == null || userDto.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new IllegalArgumentException("User with given email already exists");
        }
        User user = modelMapper.map(userDto, User.class);
        user.setProvider(userDto.getProvider() != null ? userDto.getProvider() : Provider.LOCAL);

        //assign the default role (ROLE_USER)
        Role role = roleRepository.findByName("ROLE_" + AppConstants.USER_ROLE).orElse(null);
        user.getRoles().add(role);

        User savedUser = userRepository.save(user);
        return modelMapper.map(savedUser, UserDto.class);
    }

    @Override
    public UserDto getUserByEmail(String email) {
        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with given email id "));
        return modelMapper.map(user, UserDto.class);
    }

    @Override
    public UserDto updateUser(UserDto userDto, String userId) {
        UUID uId = UserHelper.parseUUID(userId);
        User existingUser = userRepository
                .findById(uId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with given id"));
        //we are not going to change email id for this project.
        if (userDto.getName() != null) existingUser.setName(userDto.getName());
        if (userDto.getImage() != null) existingUser.setImage(userDto.getImage());
        if (userDto.getProvider() != null) existingUser.setProvider(userDto.getProvider());
        //TODO: change password updation logic...
        if (userDto.getPassword() != null) existingUser.setPassword(userDto.getPassword());
        existingUser.setEnable(userDto.isEnable());
        existingUser.setUpdatedAt(Instant.now());
        User updatedUser = userRepository.save(existingUser);
        return modelMapper.map(updatedUser, UserDto.class);
    }

    @Override
    public void deleteUser(String userId) {
        UUID uId = UserHelper.parseUUID(userId);
        User user = userRepository.findById(uId).orElseThrow(() -> new ResourceNotFoundException("User not found with given id"));
        userRepository.delete(user);
    }

    @Override
    public UserDto getUserById(String userId) {
        User user = userRepository.findById(UserHelper.parseUUID(userId)).orElseThrow(() -> new ResourceNotFoundException("User not found with given id"));
        return modelMapper.map(user, UserDto.class);
    }

    @Override
    @Transactional
    public Iterable<UserDto> getAllUsers() {
        return userRepository
                .findAll()
                .stream()
                .map(user -> modelMapper.map(user, UserDto.class))
                .toList();
    }

    // ===== Role Assignment =====

    @Override
    @Transactional
    public UserDto assignRole(String userId, String roleName) {
        UUID uId = UserHelper.parseUUID(userId);
        User user = userRepository.findById(uId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String fullRoleName = roleName.startsWith("ROLE_") ? roleName : "ROLE_" + roleName;
        Role role = roleRepository.findByName(fullRoleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + fullRoleName));

        user.getRoles().add(role);
        User updated = userRepository.save(user);
        return modelMapper.map(updated, UserDto.class);
    }

    @Override
    @Transactional
    public UserDto revokeRole(String userId, String roleName) {
        UUID uId = UserHelper.parseUUID(userId);
        User user = userRepository.findById(uId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String fullRoleName = roleName.startsWith("ROLE_") ? roleName : "ROLE_" + roleName;
        user.getRoles().removeIf(r -> r.getName().equals(fullRoleName));
        User updated = userRepository.save(user);
        return modelMapper.map(updated, UserDto.class);
    }
}
