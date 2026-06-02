import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "@/auth/store";
import { getUserRoles, userHasRole, userHasPermission } from "@/auth/rbac";
import { useEffect, useState, useMemo } from "react";
import {
  getAllUsers,
  deleteUser,
  assignRoleToUser,
  revokeRoleFromUser,
  getAllRoles,
  getAllPermissions,
  getAuditLogs,
  assignPermission,
  removePermission,
} from "@/services/AuthService";
import toast from "react-hot-toast";
import {
  Users,
  Crown,
  Trash2,
  Mail,
  Globe,
  CheckCircle2,
  XCircle,
  UserCheck,
  ShieldAlert,
  RefreshCw,
  Clock,
  KeyRound,
  Shield,
  FileText,
  Plus,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  UserMinus,
  Check,
} from "lucide-react";

function AdminPanel() {
  const user = useAuth((state) => state.user);

  // Tabs: "users" | "roles" | "audit"
  const [activeTab, setActiveTab] = useState("users");

  // Users State
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserForRole, setSelectedUserForRole] = useState(null);

  // Roles & Permissions State
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [matrixUpdating, setMatrixUpdating] = useState(false);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditPage, setAuditPage] = useState(0);
  const [auditTotalPages, setAuditTotalPages] = useState(0);

  // Fetch data depending on active tab
  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "roles") {
      fetchRolesAndPermissions();
    } else if (activeTab === "audit") {
      fetchAuditLogs();
    }
  }, [activeTab, auditPage]);

  // --- API Calls ---

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchRolesAndPermissions = async () => {
    try {
      setRolesLoading(true);
      const [rData, pData] = await Promise.all([getAllRoles(), getAllPermissions()]);
      setRoles(Array.isArray(rData) ? rData : []);
      setPermissions(Array.isArray(pData) ? pData : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load roles and permissions");
    } finally {
      setRolesLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      setAuditLoading(true);
      const data = await getAuditLogs(auditPage, 10);
      setAuditLogs(data.content || []);
      setAuditTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load audit logs");
    } finally {
      setAuditLoading(false);
    }
  };

  // --- Actions ---

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        setDeletingId(userId);
        await deleteUser(userId);
        toast.success("User deleted successfully");
        setUsers(users.filter((u) => u.id !== userId));
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete user");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleAssignRole = async (userId, roleName) => {
    try {
      const updatedUser = await assignRoleToUser(userId, roleName);
      setUsers(users.map((u) => (u.id === userId ? updatedUser : u)));
      toast.success(`Role ${roleName.replace("ROLE_", "")} assigned successfully`);
      setSelectedUserForRole(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to assign role");
    }
  };

  const handleRevokeRole = async (userId, roleName) => {
    try {
      const cleanRole = roleName.startsWith("ROLE_") ? roleName : `ROLE_${roleName}`;
      const updatedUser = await revokeRoleFromUser(userId, cleanRole);
      setUsers(users.map((u) => (u.id === userId ? updatedUser : u)));
      toast.success(`Role ${cleanRole.replace("ROLE_", "")} revoked successfully`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to revoke role");
    }
  };

  // Toggle permission for a role (SUPER_ADMIN only)
  const handleTogglePermission = async (role, permission) => {
    const hasPerm = role.permissions?.some((p) => p.id === permission.id);
    const roleId = role.id;
    const permissionId = permission.id;

    // Check if SUPER_ADMIN or system config authority exists
    if (!userHasPermission(user, "SYSTEM_CONFIG")) {
      toast.error("Only SUPER_ADMIN can configure permissions");
      return;
    }

    try {
      setMatrixUpdating(true);
      
      let updatedRole;
      if (hasPerm) {
        updatedRole = await removePermission(roleId, permissionId);
        toast.success(`Removed ${permission.name} from ${role.name.replace("ROLE_", "")}`);
      } else {
        updatedRole = await assignPermission(roleId, permissionId);
        toast.success(`Added ${permission.name} to ${role.name.replace("ROLE_", "")}`);
      }

      setRoles(roles.map((r) => (r.id === roleId ? updatedRole : r)));
    } catch (error) {
      console.error(error);
      toast.error("Failed to update role permissions");
    } finally {
      setMatrixUpdating(false);
    }
  };

  // --- Helpers & Computations ---

  const getRoleBadgeStyle = (roleName) => {
    const cleanRole = roleName.replace("ROLE_", "");
    switch (cleanRole) {
      case "SUPER_ADMIN":
        return "bg-amber-500/15 text-amber-500 border-amber-500/30";
      case "ADMIN":
        return "bg-primary/15 text-primary border-primary/30";
      case "MODERATOR":
        return "bg-cyan-500/15 text-cyan-500 border-cyan-500/30";
      case "USER":
        return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getRoleIcon = (roleName) => {
    const cleanRole = roleName.replace("ROLE_", "");
    if (cleanRole === "SUPER_ADMIN" || cleanRole === "ADMIN") {
      return <Crown className="w-2.5 h-2.5" />;
    }
    if (cleanRole === "MODERATOR") {
      return <Shield className="w-2.5 h-2.5" />;
    }
    return <UserCheck className="w-2.5 h-2.5" />;
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const nameMatch = u.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const emailMatch = u.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const roleMatch = u.roles?.some((r) =>
        (typeof r === "string" ? r : r.name)?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return nameMatch || emailMatch || roleMatch;
    });
  }, [users, searchQuery]);

  const stats = useMemo(() => {
    const total = users.length;
    const superAdmins = users.filter((u) =>
      u.roles?.some((r) => (r.name || r) === "ROLE_SUPER_ADMIN")
    ).length;
    const admins = users.filter((u) =>
      u.roles?.some((r) => (r.name || r) === "ROLE_ADMIN")
    ).length;
    const moderators = users.filter((u) =>
      u.roles?.some((r) => (r.name || r) === "ROLE_MODERATOR")
    ).length;
    const active = users.filter((u) => u.enable).length;

    return { total, superAdmins, admins, moderators, active };
  }, [users]);

  // All roles defined in system design
  const allSystemRoles = ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_MODERATOR", "ROLE_USER", "ROLE_GUEST"];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <Crown className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">
              Enterprise Role-Based Access Control and System Diagnostics
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl cursor-pointer"
            onClick={() => {
              if (activeTab === "users") fetchUsers();
              else if (activeTab === "roles") fetchRolesAndPermissions();
              else if (activeTab === "audit") fetchAuditLogs();
            }}
            disabled={usersLoading || rolesLoading || auditLoading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${
                usersLoading || rolesLoading || auditLoading ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-6 text-sm font-medium">
        {[
          { id: "users", label: "User Directory", icon: <Users className="w-4 h-4" /> },
          { id: "roles", label: "Role Permissions Matrix", icon: <KeyRound className="w-4 h-4" /> },
          { id: "audit", label: "Security Audit Logs", icon: <FileText className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-3.5 border-b-2 transition-colors relative cursor-pointer ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === "users" && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Summary Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Total Users", value: stats.total, icon: <Users className="w-5 h-5 text-primary" /> },
                  { label: "Super Admins", value: stats.superAdmins, icon: <Crown className="w-5 h-5 text-amber-500" /> },
                  { label: "Admins & Mods", value: stats.admins + stats.moderators, icon: <Shield className="w-5 h-5 text-cyan-500" /> },
                  { label: "Active Accounts", value: stats.active, icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" /> },
                ].map((stat, i) => (
                  <Card key={i} className="rounded-xl border border-border/80">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-muted">{stat.icon}</div>
                      <div>
                        <p className="text-xl font-bold">{usersLoading ? "—" : stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Users Directory Table Card */}
              <Card className="rounded-2xl border border-border shadow-md">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border bg-muted/20">
                  <div>
                    <CardTitle className="text-lg font-bold">User Directory</CardTitle>
                    <CardDescription>View status, manage roles, and delete accounts</CardDescription>
                  </div>
                  {/* Search Bar */}
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search name, email or role..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {usersLoading ? (
                    <div className="p-16 text-center text-muted-foreground">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                      Loading users directory...
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="p-16 text-center text-muted-foreground">
                      No users match your criteria.
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {filteredUsers.map((u) => {
                        const initials =
                          u.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2) || "U";

                        const isCurrentUser = u.id === user.id;
                        const uRoles = getUserRoles(u);

                        return (
                          <div
                            key={u.id}
                            className={`p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between transition-colors ${
                              isCurrentUser ? "bg-primary/5" : "hover:bg-muted/10"
                            }`}
                          >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <Avatar className="w-12 h-12 border shadow-sm shrink-0">
                                <AvatarImage
                                  src={
                                    u.image ||
                                    `https://api.dicebear.com/7.x/thumbs/svg?seed=${
                                      u.email || "user"
                                    }`
                                  }
                                />
                                <AvatarFallback className="font-bold bg-primary/10 text-primary text-sm">
                                  {initials}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-semibold truncate">{u.name || "No Name"}</h3>
                                  {/* Dynamic badges */}
                                  {uRoles.map((role) => (
                                    <span
                                      key={role}
                                      className={`group relative inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase border leading-none ${getRoleBadgeStyle(
                                        role
                                      )}`}
                                    >
                                      {getRoleIcon(role)}
                                      {role}
                                      {/* Revoke button (only for users other than current, if admin has assign permission) */}
                                      {userHasPermission(user, "ROLE_ASSIGN") && !isCurrentUser && (
                                        <button
                                          onClick={() => handleRevokeRole(u.id, role)}
                                          className="ml-1 text-muted-foreground hover:text-destructive cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                          title={`Revoke ${role}`}
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      )}
                                    </span>
                                  ))}
                                  {isCurrentUser && (
                                    <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-500 text-[10px] font-bold border border-emerald-500/30 uppercase leading-none">
                                      YOU
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1 truncate">
                                    <Mail className="w-3 h-3 shrink-0" /> {u.email}
                                  </span>
                                  <span className="flex items-center gap-1 shrink-0">
                                    <Globe className="w-3 h-3" /> {u.provider || "LOCAL"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* User action options */}
                            <div className="flex items-center gap-3 w-full md:w-auto shrink-0 md:justify-end">
                              <span className="flex items-center gap-1.5 text-xs">
                                {u.enable ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                ) : (
                                  <XCircle className="w-3.5 h-3.5 text-red-500" />
                                )}
                                {u.enable ? "Active" : "Disabled"}
                              </span>

                              {/* Assign Role Dropdown Toggler */}
                              {userHasPermission(user, "ROLE_ASSIGN") && !isCurrentUser && (
                                <div className="relative">
                                  {selectedUserForRole === u.id ? (
                                    <div className="absolute right-0 bottom-full mb-2 z-10 bg-popover border border-border p-2 rounded-xl shadow-lg flex flex-col gap-1 min-w-[150px]">
                                      <p className="text-[10px] text-muted-foreground px-2 py-1 font-semibold uppercase">
                                        Assign Role
                                      </p>
                                      {allSystemRoles
                                        .filter((r) => !uRoles.includes(r.replace("ROLE_", "")))
                                        .map((r) => (
                                          <button
                                            key={r}
                                            onClick={() => handleAssignRole(u.id, r)}
                                            className="w-full text-left px-2 py-1.5 text-xs font-semibold hover:bg-muted hover:text-foreground rounded-lg transition-colors cursor-pointer"
                                          >
                                            {r.replace("ROLE_", "")}
                                          </button>
                                        ))}
                                      <button
                                        onClick={() => setSelectedUserForRole(null)}
                                        className="w-full text-center mt-1 text-[10px] text-destructive py-1.5 border-t border-border hover:bg-destructive/5 rounded-lg transition-colors cursor-pointer font-bold"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : null}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl cursor-pointer"
                                    onClick={() => setSelectedUserForRole(selectedUserForRole === u.id ? null : u.id)}
                                  >
                                    <Plus className="w-3.5 h-3.5 mr-1" />
                                    Role
                                  </Button>
                                </div>
                              )}

                              {/* Delete Button */}
                              {userHasPermission(user, "USER_DELETE") && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="rounded-xl cursor-pointer"
                                  onClick={() => handleDelete(u.id)}
                                  disabled={deletingId === u.id || isCurrentUser}
                                  title={isCurrentUser ? "Cannot delete yourself" : "Delete user"}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "roles" && (
            <motion.div
              key="roles"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <Card className="rounded-2xl border border-border shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-primary" />
                    Role-Permission Matrix
                  </CardTitle>
                  <CardDescription>
                    Configure privileges assigned to roles. {userHasPermission(user, "SYSTEM_CONFIG") ? (
                      <span className="text-emerald-500 font-semibold">Toggling updates permissions in real-time.</span>
                    ) : (
                      <span>Read-only configuration view.</span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                  {rolesLoading ? (
                    <div className="p-16 text-center text-muted-foreground">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                      Loading permissions matrix...
                    </div>
                  ) : (
                    <table className="w-full min-w-[700px] border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/40">
                          <th className="p-4 font-semibold text-muted-foreground max-w-[250px]">Permission</th>
                          {roles.map((r) => (
                            <th key={r.id} className="p-4 font-semibold text-center">
                              <div className="flex flex-col items-center">
                                <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${getRoleBadgeStyle(r.name)}`}>
                                  {r.name.replace("ROLE_", "")}
                                </span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {permissions.map((p) => (
                          <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                            <td className="p-4 max-w-[250px]">
                              <div>
                                <span className="font-mono text-xs font-bold text-foreground bg-muted/50 px-1.5 py-0.5 rounded border border-border">
                                  {p.name}
                                </span>
                                <p className="text-xs text-muted-foreground mt-1">{p.description}</p>
                              </div>
                            </td>
                            {roles.map((r) => {
                              const hasPerm = r.permissions?.some((rp) => rp.id === p.id);
                              const isSuper = r.name === "ROLE_SUPER_ADMIN";
                              return (
                                <td key={r.id} className="p-4 text-center">
                                  <div className="flex justify-center">
                                    <button
                                      onClick={() => !isSuper && handleTogglePermission(r, p)}
                                      disabled={isSuper || matrixUpdating || !userHasPermission(user, "SYSTEM_CONFIG")}
                                      className={`w-6 h-6 rounded-md flex items-center justify-center border transition-all ${
                                        hasPerm
                                          ? "bg-primary border-primary text-primary-foreground"
                                          : "border-border hover:border-primary/50"
                                      } ${isSuper ? "opacity-70 cursor-not-allowed bg-muted border-muted text-muted-foreground" : "cursor-pointer"}`}
                                    >
                                      {hasPerm && <Check className="w-4 h-4" />}
                                    </button>
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "audit" && (
            <motion.div
              key="audit"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <Card className="rounded-2xl border border-border shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Security Audit Trail
                  </CardTitle>
                  <CardDescription>
                    Real-time log of security operations, credential adjustments, and role mutations
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {auditLoading ? (
                    <div className="p-16 text-center text-muted-foreground">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                      Loading security logs...
                    </div>
                  ) : auditLogs.length === 0 ? (
                    <div className="p-16 text-center text-muted-foreground">
                      No security audit records exist.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[800px] border-collapse text-left text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/40">
                            <th className="p-4 font-semibold text-muted-foreground">Timestamp</th>
                            <th className="p-4 font-semibold text-muted-foreground">Action</th>
                            <th className="p-4 font-semibold text-muted-foreground">User ID</th>
                            <th className="p-4 font-semibold text-muted-foreground">IP Address</th>
                            <th className="p-4 font-semibold text-muted-foreground">Resource</th>
                            <th className="p-4 font-semibold text-muted-foreground">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {auditLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-muted/10 transition-colors">
                              <td className="p-4 text-xs font-mono text-muted-foreground">
                                {new Date(log.timestamp).toLocaleString()}
                              </td>
                              <td className="p-4">
                                <span className="font-semibold text-xs tracking-wider uppercase">
                                  {log.action}
                                </span>
                              </td>
                              <td className="p-4 text-xs font-mono truncate max-w-[120px]" title={log.userId}>
                                {log.userId || "Anonymous"}
                              </td>
                              <td className="p-4 text-xs font-mono text-muted-foreground">
                                {log.ipAddress}
                              </td>
                              <td className="p-4 text-xs text-muted-foreground truncate max-w-[200px]" title={log.resource}>
                                {log.resource}
                              </td>
                              <td className="p-4">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                    log.status === "SUCCESS"
                                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/25"
                                      : "bg-destructive/10 text-destructive border-destructive/25"
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      log.status === "SUCCESS" ? "bg-emerald-500" : "bg-destructive"
                                    }`}
                                  />
                                  {log.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Pagination Controls */}
                      {auditTotalPages > 1 && (
                        <div className="flex items-center justify-between p-4 border-t border-border">
                          <p className="text-xs text-muted-foreground">
                            Page {auditPage + 1} of {auditTotalPages}
                          </p>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={auditPage === 0}
                              onClick={() => setAuditPage(auditPage - 1)}
                              className="rounded-xl cursor-pointer"
                            >
                              <ChevronLeft className="w-4 h-4 mr-1" />
                              Previous
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={auditPage >= auditTotalPages - 1}
                              onClick={() => setAuditPage(auditPage + 1)}
                              className="rounded-xl cursor-pointer"
                            >
                              Next
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AdminPanel;
