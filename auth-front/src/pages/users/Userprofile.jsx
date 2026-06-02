import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "@/auth/store";
import { getUserRoles, userHasRole } from "@/auth/rbac";
import { useState } from "react";
import {
  updateMyProfile,
  changePassword,
  deleteMyAccount,
} from "@/services/AuthService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import {
  Pencil,
  Save,
  X,
  Lock,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
  Shield,
  KeyRound,
  Crown,
  UserCheck,
} from "lucide-react";

function Userprofile() {
  const user = useAuth((state) => state.user);
  const changeLocalLoginData = useAuth(
    (state) => state.changeLocalLoginData
  );
  const accessToken = useAuth((state) => state.accessToken);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  const roles = getUserRoles(user);
  const isAdmin = userHasRole(user, "ADMIN");

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);

  // Change password state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Handle save profile
  const handleSave = async () => {
    if (!editName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setSaving(true);
    try {
      const updatedUser = await updateMyProfile({ name: editName.trim() });
      changeLocalLoginData(accessToken, updatedUser, true);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // Handle change password
  const handleChangePassword = async () => {
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setChangingPw(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success("Password changed successfully!");
      setShowPasswordForm(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
    } finally {
      setChangingPw(false);
    }
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error('Please type "DELETE" to confirm');
      return;
    }
    setDeleting(true);
    try {
      await deleteMyAccount();
      toast.success("Account deleted successfully");
      logout();
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  // Role display config
  const roleConfig = {
    SUPER_ADMIN: {
      icon: <Crown className="w-4 h-4 text-amber-500" />,
      color: "bg-amber-500/15 text-amber-500 border-amber-500/30",
      desc: "Root level administration — complete control over all users, roles, permissions, audit logs, and configurations",
    },
    ADMIN: {
      icon: <Crown className="w-4 h-4" />,
      color: "bg-primary/15 text-primary border-primary/30",
      desc: "Administrative access — manage users, view audit logs, delete user profiles, and view reports",
    },
    MODERATOR: {
      icon: <Shield className="w-4 h-4" />,
      color: "bg-cyan-500/15 text-cyan-500 border-cyan-500/30",
      desc: "Moderation access — view user directory, analyze reports, and moderate content",
    },
    USER: {
      icon: <UserCheck className="w-4 h-4" />,
      color: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
      desc: "Standard authenticated user — access personal dashboard and manage own profile details",
    },
    GUEST: {
      icon: <UserCheck className="w-4 h-4 text-muted-foreground" />,
      color: "bg-muted text-muted-foreground border-border",
      desc: "Restricted guest access — read-only access to standard interface pages",
    },
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center"
      >
        User Profile
      </motion.h1>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="rounded-2xl shadow-md p-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <Avatar className="w-28 h-28 border shadow-md">
                <AvatarImage
                  src={
                    user?.image ||
                    `https://api.dicebear.com/7.x/thumbs/svg?seed=${user?.email || "user"}`
                  }
                />
                <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {/* Role badges under avatar */}
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {roles.map((role) => {
                  const config = roleConfig[role] || roleConfig.GUEST;
                  return (
                    <span
                      key={role}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold uppercase border ${config.color}`}
                    >
                      {config.icon}
                      {role}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* User Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="rounded-xl"
                    placeholder="Enter your name"
                  />
                ) : (
                  <Input
                    id="name"
                    value={user?.name}
                    readOnly
                    className="rounded-xl"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email}
                  readOnly
                  className="rounded-xl opacity-70"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="provider">Provider</Label>
                <Input
                  id="provider"
                  value={user?.provider}
                  readOnly
                  className="rounded-xl opacity-70"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="enabled">Account Status</Label>
                <div className="flex items-center gap-2 h-10 px-3 rounded-xl border border-border bg-background">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      user?.enable ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                  <span className="text-sm">
                    {user?.enable ? "Active" : "Disabled"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {!isEditing ? (
              <Button
                onClick={() => {
                  setEditName(user?.name || "");
                  setIsEditing(true);
                }}
                className="w-full rounded-2xl mt-4 text-lg cursor-pointer group"
              >
                <Pencil className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-3 mt-4 justify-end">
                <Button
                  className="rounded-xl cursor-pointer px-6"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditName(user?.name || "");
                  }}
                  disabled={saving}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  className="rounded-xl cursor-pointer px-6"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Roles & Permissions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="rounded-2xl shadow-md p-6">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-primary" />
              Roles & Permissions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {roles.length > 0 ? (
              roles.map((role) => {
                const config = roleConfig[role] || roleConfig.GUEST;
                return (
                  <div
                    key={role}
                    className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border"
                  >
                    <div className={`p-2 rounded-lg ${config.color}`}>
                      {config.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm uppercase tracking-wide">
                        {role}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {config.desc}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">
                No roles assigned to your account.
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Account Settings Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="rounded-2xl shadow-md p-6">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Change Password */}
            <Button
              variant="outline"
              className="w-full rounded-xl py-3 text-base cursor-pointer group"
              onClick={() => {
                setShowPasswordForm(!showPasswordForm);
                setShowDeleteConfirm(false);
              }}
            >
              <Lock className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
              Change Password
            </Button>

            <AnimatePresence>
              {showPasswordForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 p-4 rounded-xl bg-muted/50 border border-border">
                    <div className="space-y-2">
                      <Label>Current Password</Label>
                      <div className="relative">
                        <Input
                          type={showCurrentPw ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          className="rounded-xl pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPw(!showCurrentPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showCurrentPw ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <div className="relative">
                        <Input
                          type={showNewPw ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password (min 6 chars)"
                          className="rounded-xl pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPw(!showNewPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showNewPw ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm New Password</Label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="rounded-xl"
                      />
                    </div>
                    <div className="flex gap-3 justify-end mt-2">
                      <Button
                        variant="outline"
                        className="rounded-xl cursor-pointer px-6"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setCurrentPassword("");
                          setNewPassword("");
                          setConfirmPassword("");
                        }}
                        disabled={changingPw}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="rounded-xl cursor-pointer px-6"
                        onClick={handleChangePassword}
                        disabled={changingPw}
                      >
                        {changingPw ? "Changing..." : "Update Password"}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Delete Account */}
            <Button
              variant="destructive"
              className="w-full rounded-xl py-3 text-base cursor-pointer group"
              onClick={() => {
                setShowDeleteConfirm(!showDeleteConfirm);
                setShowPasswordForm(false);
              }}
            >
              <Trash2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              Delete Account
            </Button>

            <AnimatePresence>
              {showDeleteConfirm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-destructive">
                          This action is irreversible
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          All your data, sessions, and account information will
                          be permanently deleted. Type{" "}
                          <span className="font-mono font-bold text-foreground">
                            DELETE
                          </span>{" "}
                          to confirm.
                        </p>
                      </div>
                    </div>
                    <Input
                      value={deleteConfirmText}
                      onChange={(e) =>
                        setDeleteConfirmText(e.target.value.toUpperCase())
                      }
                      placeholder='Type "DELETE" to confirm'
                      className="rounded-xl font-mono"
                    />
                    <div className="flex gap-3 justify-end mt-2">
                      <Button
                        variant="outline"
                        className="rounded-xl cursor-pointer px-6"
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteConfirmText("");
                        }}
                        disabled={deleting}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        className="rounded-xl cursor-pointer px-6"
                        onClick={handleDeleteAccount}
                        disabled={
                          deleting || deleteConfirmText !== "DELETE"
                        }
                      >
                        {deleting ? "Deleting..." : "Permanently Delete"}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default Userprofile;
