import apiClient from "@/config/apiClient";
//register function
export const registerUser = async (signupData) => {
  // api  call to server to save data
  const response = await apiClient.post(`/auth/register`, signupData);
  return response.data;
};

//login

export const loginUser = async (loginData) => {
  const response = await apiClient.post("/auth/login", loginData);
  return response.data;
};

export const logoutUser = async () => {
  const response = await apiClient.post(`/auth/logout`);
  return response.data;
};

//get current login user
export const getCurrentUser = async (emailId) => {
  const response = await apiClient.get(`/users/email/${emailId}`);
  return response.data;
};

//refresh token

export const refreshToken = async () => {
  const response = await apiClient.post(`/auth/refresh`);
  return response.data;
};

// ===== Self-service APIs =====

// get current user's profile (via /me endpoint)
export const getMyProfile = async () => {
  const response = await apiClient.get(`/users/me`);
  return response.data;
};

// update current user's profile
export const updateMyProfile = async (userData) => {
  const response = await apiClient.put(`/users/me`, userData);
  return response.data;
};

// delete current user's account
export const deleteMyAccount = async () => {
  const response = await apiClient.delete(`/users/me`);
  return response.data;
};

// change password
export const changePassword = async (currentPassword, newPassword) => {
  const response = await apiClient.post(`/auth/change-password`, {
    currentPassword,
    newPassword,
  });
  return response.data;
};

// ===== Admin APIs =====

// get all users
export const getAllUsers = async () => {
  const response = await apiClient.get(`/users`);
  return response.data;
};

// delete any user
export const deleteUser = async (userId) => {
  const response = await apiClient.delete(`/users/${userId}`);
  return response.data;
};
