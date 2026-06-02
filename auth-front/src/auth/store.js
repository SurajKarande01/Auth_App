import { loginUser, logoutUser } from "@/services/AuthService";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const LOCAL_KEY = "app_state";

//main logic for global state
const useAuth = create(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      permissions: [],
      authStatus: false,
      authLoading: false,

      changeLocalLoginData: (accessToken, user, authStatus) => {
        // Extract permissions from user roles if available
        const permissions = extractPermissions(user);
        set({
          accessToken,
          user,
          permissions,
          authStatus,
        });
      },
      login: async (loginData) => {
        console.log("started login...");
        set({ authLoading: true });
        try {
          const loginResponseData = await loginUser(loginData);
          console.log(loginResponseData);
          const permissions = extractPermissions(loginResponseData.user);
          set({
            accessToken: loginResponseData.accessToken,
            user: loginResponseData.user,
            permissions,
            authStatus: true,
          });
          return loginResponseData;
        } catch (error) {
          console.log(error);
          throw error;
        } finally {
          set({
            authLoading: false,
          });
        }
      },
      logout: async (silent = false) => {
        try {
          set({
            authLoading: true,
          });
          await logoutUser();
        } catch (error) {
        } finally {
          set({
            authLoading: false,
          });
        }
        set({
          accessToken: null,
          user: null,
          permissions: [],
          authLoading: false,
          authStatus: false,
        });
      },
      checkLogin: () => {
        if (get().accessToken && get().authStatus) return true;
        else return false;
      },
    }),

    { name: LOCAL_KEY }
  )
);

/**
 * Extract permissions from user's roles.
 * Works with both role objects {name, permissions: [{name}]} and simple strings.
 */
function extractPermissions(user) {
  if (!user?.roles || !Array.isArray(user.roles)) return [];
  const perms = new Set();
  user.roles.forEach((role) => {
    if (role.permissions && Array.isArray(role.permissions)) {
      role.permissions.forEach((p) => {
        const name = typeof p === "string" ? p : p.name;
        if (name) perms.add(name);
      });
    }
  });
  return Array.from(perms);
}

export default useAuth;
