import apiClient from "@/config/apiClient";

// ===== Auth APIs =====

//register function
export const registerUser = async (signupData) => {
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

// ===== Admin User APIs =====

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

// assign role to user
export const assignRoleToUser = async (userId, roleName) => {
  const response = await apiClient.post(`/users/${userId}/roles/${roleName}`);
  return response.data;
};

// revoke role from user
export const revokeRoleFromUser = async (userId, roleName) => {
  const response = await apiClient.delete(`/users/${userId}/roles/${roleName}`);
  return response.data;
};

// ===== Role APIs =====

export const getAllRoles = async () => {
  const response = await apiClient.get(`/roles`);
  return response.data;
};

// ===== Permission APIs =====

export const getAllPermissions = async () => {
  const response = await apiClient.get(`/permissions`);
  return response.data;
};

// ===== Audit Log APIs =====

export const getAuditLogs = async (page = 0, size = 20) => {
  const response = await apiClient.get(`/audit-logs?page=${page}&size=${size}`);
  return response.data;
};

export const getAuditLogsByUser = async (userId, page = 0, size = 20) => {
  const response = await apiClient.get(`/audit-logs/user/${userId}?page=${page}&size=${size}`);
  return response.data;
};

// assign permission to role
export const assignPermission = async (roleId, permissionId) => {
  const response = await apiClient.post(`/roles/${roleId}/permissions/${permissionId}`);
  return response.data;
};

// remove permission from role
export const removePermission = async (roleId, permissionId) => {
  const response = await apiClient.delete(`/roles/${roleId}/permissions/${permissionId}`);
  return response.data;
};
