package com.substring.auth.app.auth.controllers;

import com.substring.auth.app.auth.config.AppConstants;
import com.substring.auth.app.auth.payload.PermissionDto;
import com.substring.auth.app.auth.repositories.PermissionRepository;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/permissions")
@AllArgsConstructor
public class PermissionController {

    private final PermissionRepository permissionRepository;
    private final ModelMapper modelMapper;

    @GetMapping
    @PreAuthorize("hasAuthority('" + AppConstants.PERM_USER_READ + "')")
    public ResponseEntity<List<PermissionDto>> getAllPermissions() {
        List<PermissionDto> perms = permissionRepository.findAll().stream()
                .map(p -> modelMapper.map(p, PermissionDto.class))
                .toList();
        return ResponseEntity.ok(perms);
    }
}
