package com.substring.auth.app.auth.config;

public class AppConstants {

    // ===== URL Zone Patterns =====

    public static final String[] AUTH_PUBLIC_URLS = {
            "/api/v1/auth/**",
            "/v3/api-docs/**",
            "/swagger-ui.html",
            "/swagger-ui/**"
    };

    public static final String[] AUTH_ADMIN_URLS = {
            "/api/v1/users/**",
            "/api/v1/roles/**",
            "/api/v1/permissions/**",
            "/api/v1/audit-logs/**"
    };

    //self-service endpoints accessible by any authenticated user
    public static final String[] AUTH_SELF_SERVICE_URLS = {
            "/api/v1/users/me",
            "/api/v1/users/me/**"
    };

    public static final String[] AUTH_GUEST_URLS = {

    };

    // ===== Role Constants =====

    public static final String SUPER_ADMIN_ROLE = "SUPER_ADMIN";
    public static final String ADMIN_ROLE = "ADMIN";
    public static final String MODERATOR_ROLE = "MODERATOR";
    public static final String USER_ROLE = "USER";
    public static final String GUEST_ROLE = "GUEST";

    // ===== Permission Constants =====

    public static final String PERM_USER_READ = "USER_READ";
    public static final String PERM_USER_WRITE = "USER_WRITE";
    public static final String PERM_USER_DELETE = "USER_DELETE";
    public static final String PERM_ROLE_ASSIGN = "ROLE_ASSIGN";
    public static final String PERM_AUDIT_VIEW = "AUDIT_VIEW";
    public static final String PERM_REPORT_VIEW = "REPORT_VIEW";
    public static final String PERM_SYSTEM_CONFIG = "SYSTEM_CONFIG";

//    other project-related constants

}
