import useAuth from "@/auth/store";
import { Navigate } from "react-router";
import { ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router";

/**
 * Check if a user object has a specific role.
 * Handles both {name: "ROLE_ADMIN"} objects and plain "ROLE_ADMIN" strings.
 */
export function userHasRole(user, roleName) {
  if (!user?.roles || !Array.isArray(user.roles)) return false;
  const fullRole = roleName.startsWith("ROLE_") ? roleName : `ROLE_${roleName}`;
  return user.roles.some(
    (r) => r.name === fullRole || r === fullRole
  );
}

/**
 * Check if a user has ANY of the specified roles.
 */
export function userHasAnyRole(user, roleNames) {
  return roleNames.some((roleName) => userHasRole(user, roleName));
}

/**
 * Check if a user has a specific permission (e.g. "USER_READ").
 * Checks both the Zustand permissions array and the role.permissions objects.
 */
export function userHasPermission(user, permissionName) {
  if (!user?.roles || !Array.isArray(user.roles)) return false;
  return user.roles.some(
    (role) =>
      role.permissions &&
      Array.isArray(role.permissions) &&
      role.permissions.some(
        (p) => (typeof p === "string" ? p : p.name) === permissionName
      )
  );
}

/**
 * Extract clean role names from user object.
 * Returns e.g. ["ADMIN", "GUEST"]
 */
export function getUserRoles(user) {
  if (!user?.roles || !Array.isArray(user.roles)) return [];
  return user.roles.map((r) => {
    const name = typeof r === "string" ? r : r.name;
    return name?.replace("ROLE_", "") || "UNKNOWN";
  });
}

/**
 * Extract all permission names from a user's roles.
 */
export function getUserPermissions(user) {
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

/**
 * Route guard component — renders children only if user has the required role(s).
 * Accepts a single role string or an array of roles (any match = allowed).
 */
export function RoleGuard({ role, children }) {
  const user = useAuth((state) => state.user);
  const checkLogin = useAuth((state) => state.checkLogin);

  if (!checkLogin()) {
    return <Navigate to="/login" />;
  }

  const roles = Array.isArray(role) ? role : [role];
  if (!userHasAnyRole(user, roles)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="mx-auto w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6">
            <ShieldAlert className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-6">
            You don't have the required{" "}
            <span className="font-mono text-foreground font-semibold">
              {roles.join(" / ")}
            </span>{" "}
            role to access this page. Contact your administrator if you believe
            this is an error.
          </p>
          <NavLink to="/dashboard">
            <Button className="rounded-xl px-6 cursor-pointer">
              Back to Dashboard
            </Button>
          </NavLink>
        </motion.div>
      </div>
    );
  }

  return children;
}

/**
 * Route guard component — renders children only if user has the required permission.
 */
export function PermissionGuard({ permission, children, fallback = null }) {
  const user = useAuth((state) => state.user);
  const checkLogin = useAuth((state) => state.checkLogin);

  if (!checkLogin()) {
    return <Navigate to="/login" />;
  }

  if (!userHasPermission(user, permission)) {
    if (fallback) return fallback;
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="mx-auto w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6">
            <ShieldAlert className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Insufficient Permissions</h2>
          <p className="text-muted-foreground mb-6">
            You need the{" "}
            <span className="font-mono text-foreground font-semibold">
              {permission}
            </span>{" "}
            permission to access this resource.
          </p>
          <NavLink to="/dashboard">
            <Button className="rounded-xl px-6 cursor-pointer">
              Back to Dashboard
            </Button>
          </NavLink>
        </motion.div>
      </div>
    );
  }

  return children;
}
