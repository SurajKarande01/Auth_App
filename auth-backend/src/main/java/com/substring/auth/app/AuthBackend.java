package com.substring.auth.app;

import com.substring.auth.app.auth.config.AppConstants;
import com.substring.auth.app.auth.entities.Permission;
import com.substring.auth.app.auth.entities.Role;
import com.substring.auth.app.auth.repositories.PermissionRepository;
import com.substring.auth.app.auth.repositories.RoleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.*;

@SpringBootApplication
public class AuthBackend implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AuthBackend.class);

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PermissionRepository permissionRepository;

	public static void main(String[] args) {
		SpringApplication.run(AuthBackend.class, args);
	}

    @Override
    public void run(String... args) throws Exception {

        // ===== Seed Permissions =====
        Map<String, Permission> permMap = new HashMap<>();
        seedPermission(permMap, AppConstants.PERM_USER_READ, "USER", "READ", "View user profiles");
        seedPermission(permMap, AppConstants.PERM_USER_WRITE, "USER", "WRITE", "Create and update users");
        seedPermission(permMap, AppConstants.PERM_USER_DELETE, "USER", "DELETE", "Delete user accounts");
        seedPermission(permMap, AppConstants.PERM_ROLE_ASSIGN, "ROLE", "ASSIGN", "Assign and revoke roles");
        seedPermission(permMap, AppConstants.PERM_AUDIT_VIEW, "AUDIT", "READ", "View audit logs");
        seedPermission(permMap, AppConstants.PERM_REPORT_VIEW, "REPORT", "READ", "View reports and analytics");
        seedPermission(permMap, AppConstants.PERM_SYSTEM_CONFIG, "SYSTEM", "WRITE", "System configuration access");

        // ===== Seed Roles with Permission Assignments =====

        // SUPER_ADMIN → all permissions
        seedRole("ROLE_" + AppConstants.SUPER_ADMIN_ROLE,
                "Full system access — manage users, roles, permissions, and system config",
                permMap.values());

        // ADMIN → USER_READ, USER_WRITE, USER_DELETE, AUDIT_VIEW, REPORT_VIEW
        seedRole("ROLE_" + AppConstants.ADMIN_ROLE,
                "User management — create, update, delete users and view audit logs",
                List.of(
                        permMap.get(AppConstants.PERM_USER_READ),
                        permMap.get(AppConstants.PERM_USER_WRITE),
                        permMap.get(AppConstants.PERM_USER_DELETE),
                        permMap.get(AppConstants.PERM_AUDIT_VIEW),
                        permMap.get(AppConstants.PERM_REPORT_VIEW)
                ));

        // MODERATOR → USER_READ, REPORT_VIEW
        seedRole("ROLE_" + AppConstants.MODERATOR_ROLE,
                "Content moderation — view users and reports",
                List.of(
                        permMap.get(AppConstants.PERM_USER_READ),
                        permMap.get(AppConstants.PERM_REPORT_VIEW)
                ));

        // USER → standard authenticated access (no admin permissions)
        seedRole("ROLE_" + AppConstants.USER_ROLE,
                "Standard authenticated access — manage own profile and settings",
                List.of());

        // GUEST → read-only / restricted access
        seedRole("ROLE_" + AppConstants.GUEST_ROLE,
                "Read-only access — restricted account",
                List.of());

        log.info("RBAC seeding complete: {} roles, {} permissions",
                roleRepository.count(), permissionRepository.count());
    }

    private void seedPermission(Map<String, Permission> permMap, String name, String resource, String action, String description) {
        Permission perm = permissionRepository.findByName(name).orElseGet(() -> {
            Permission p = Permission.builder()
                    .id(UUID.randomUUID())
                    .name(name)
                    .resource(resource)
                    .action(action)
                    .description(description)
                    .build();
            permissionRepository.save(p);
            log.info("Created permission: {}", name);
            return p;
        });
        permMap.put(name, perm);
    }

    private void seedRole(String name, String description, Collection<Permission> perms) {
        roleRepository.findByName(name).ifPresentOrElse(role -> {
            // Update description and permissions if they've changed
            boolean updated = false;
            if (!Objects.equals(role.getDescription(), description)) {
                role.setDescription(description);
                updated = true;
            }
            Set<Permission> desired = new HashSet<>(perms);
            if (!role.getPermissions().equals(desired)) {
                role.setPermissions(desired);
                updated = true;
            }
            if (updated) {
                roleRepository.save(role);
                log.info("Updated role: {} (permissions: {})", name, perms.size());
            } else {
                log.info("Role already exists: {}", name);
            }
        }, () -> {
            Role role = Role.builder()
                    .id(UUID.randomUUID())
                    .name(name)
                    .description(description)
                    .permissions(new HashSet<>(perms))
                    .build();
            roleRepository.save(role);
            log.info("Created role: {} with {} permissions", name, perms.size());
        });
    }
}
