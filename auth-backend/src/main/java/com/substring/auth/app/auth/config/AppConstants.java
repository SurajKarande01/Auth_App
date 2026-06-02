package com.substring.auth.app.auth.config;

public class AppConstants {


    public static final String[] AUTH_PUBLIC_URLS = {
            "/api/v1/auth/**",
            "/v3/api-docs/**",
            "/swagger-ui.html",
            "/swagger-ui/**"
    };

    public static final String[] AUTH_ADMIN_URLS= {
            "/api/v1/users/**"
    };

    //self-service endpoints accessible by any authenticated user
    public static final String[] AUTH_SELF_SERVICE_URLS = {
            "/api/v1/users/me",
            "/api/v1/users/me/**"
    };

    public static final String[] AUTH_GUEST_URLS= {

    };

    public static final String ADMIN_ROLE = "ADMIN";
    public static final String GUEST_ROLE = "GUEST";

//    other project-related constants


}
