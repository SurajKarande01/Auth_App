package com.substring.auth.app.auth.controllers;

import com.substring.auth.app.auth.config.AppConstants;
import com.substring.auth.app.auth.entities.Permission;
import com.substring.auth.app.auth.entities.Role;
import com.substring.auth.app.auth.payload.PermissionDto;
import com.substring.auth.app.auth.payload.RoleDto;
import com.substring.auth.app.auth.repositories.PermissionRepository;
import com.substring.auth.app.auth.repositories.RoleRepository;
import com.substring.auth.app.exceptions.ResourceNotFoundException;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/roles")
@AllArgsConstructor
public class RoleController {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final ModelMapper modelMapper;

    // List all roles
    @GetMapping
    @PreAuthorize("hasAuthority('" + AppConstants.PERM_USER_READ + "')")
    public ResponseEntity<List<RoleDto>> getAllRoles() {
        List<RoleDto> roles = roleRepository.findAll().stream()
                .map(r -> modelMapper.map(r, RoleDto.class))
                .toList();
        return ResponseEntity.ok(roles);
    }

    // Get a single role by ID
    @GetMapping("/{roleId}")
    @PreAuthorize("hasAuthority('" + AppConstants.PERM_USER_READ + "')")
    public ResponseEntity<RoleDto> getRoleById(@PathVariable UUID roleId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        return ResponseEntity.ok(modelMapper.map(role, RoleDto.class));
    }

    // Create a new role (SUPER_ADMIN only)
    @PostMapping
    @PreAuthorize("hasAuthority('" + AppConstants.PERM_SYSTEM_CONFIG + "')")
    public ResponseEntity<RoleDto> createRole(@RequestBody RoleDto roleDto) {
        if (roleDto.getName() == null || roleDto.getName().isBlank()) {
            throw new IllegalArgumentException("Role name is required");
        }
        String name = roleDto.getName().startsWith("ROLE_") ? roleDto.getName() : "ROLE_" + roleDto.getName();
        if (roleRepository.findByName(name).isPresent()) {
            throw new IllegalArgumentException("Role already exists: " + name);
        }
        Role role = Role.builder()
                .id(UUID.randomUUID())
                .name(name)
                .description(roleDto.getDescription())
                .build();
        Role saved = roleRepository.save(role);
        return ResponseEntity.status(HttpStatus.CREATED).body(modelMapper.map(saved, RoleDto.class));
    }

    // Delete a role (SUPER_ADMIN only)
    @DeleteMapping("/{roleId}")
    @PreAuthorize("hasAuthority('" + AppConstants.PERM_SYSTEM_CONFIG + "')")
    public ResponseEntity<Void> deleteRole(@PathVariable UUID roleId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        roleRepository.delete(role);
        return ResponseEntity.noContent().build();
    }

    // List permissions for a role
    @GetMapping("/{roleId}/permissions")
    @PreAuthorize("hasAuthority('" + AppConstants.PERM_USER_READ + "')")
    public ResponseEntity<List<PermissionDto>> getRolePermissions(@PathVariable UUID roleId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        List<PermissionDto> perms = role.getPermissions().stream()
                .map(p -> modelMapper.map(p, PermissionDto.class))
                .toList();
        return ResponseEntity.ok(perms);
    }

    // Assign a permission to a role (SUPER_ADMIN only)
    @PostMapping("/{roleId}/permissions/{permissionId}")
    @PreAuthorize("hasAuthority('" + AppConstants.PERM_SYSTEM_CONFIG + "')")
    public ResponseEntity<RoleDto> assignPermission(@PathVariable UUID roleId, @PathVariable UUID permissionId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found"));
        role.getPermissions().add(permission);
        Role saved = roleRepository.save(role);
        return ResponseEntity.ok(modelMapper.map(saved, RoleDto.class));
    }

    // Remove a permission from a role (SUPER_ADMIN only)
    @DeleteMapping("/{roleId}/permissions/{permissionId}")
    @PreAuthorize("hasAuthority('" + AppConstants.PERM_SYSTEM_CONFIG + "')")
    public ResponseEntity<RoleDto> removePermission(@PathVariable UUID roleId, @PathVariable UUID permissionId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        role.getPermissions().removeIf(p -> p.getId().equals(permissionId));
        Role saved = roleRepository.save(role);
        return ResponseEntity.ok(modelMapper.map(saved, RoleDto.class));
    }
}
