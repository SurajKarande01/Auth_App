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

//apis
