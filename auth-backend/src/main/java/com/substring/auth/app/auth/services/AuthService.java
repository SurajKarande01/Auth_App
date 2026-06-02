package com.substring.auth.app.auth.services;

import com.substring.auth.app.auth.payload.UserDto;

public interface AuthService {
    UserDto registerUser(UserDto userDto);

    //change password
    void changePassword(String userId, String currentPassword, String newPassword);

    //login user

}
