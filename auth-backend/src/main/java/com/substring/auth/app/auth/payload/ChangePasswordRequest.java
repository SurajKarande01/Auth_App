package com.substring.auth.app.auth.payload;

public record ChangePasswordRequest(
        String currentPassword,
        String newPassword
) {
}
