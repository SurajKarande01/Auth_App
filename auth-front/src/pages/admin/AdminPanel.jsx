import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import useAuth from "@/auth/store";
import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "@/services/AuthService";
import toast from "react-hot-toast";
import { Users, Shield, Trash2, Mail, Globe, CheckCircle2, XCircle } from "lucide-react";
import { Navigate } from "react-router";

function AdminPanel() {
  const user = useAuth((state) => state.user);
  const isAdmin = user?.roles?.some(
    (r) => r.name === "ROLE_ADMIN" || r === "ROLE_ADMIN"
  );

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

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

  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 justify-center mb-8"
      >
        <Shield className="w-10 h-10 text-primary" />
        <h1 className="text-4xl font-bold">Admin Panel</h1>
      </motion.div>

      {/* Users List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="rounded-2xl shadow-md">
          <CardHeader className="border-b border-border bg-muted/20">
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Manage Users ({users.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">
                Loading users...
              </div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No users found.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {users.map((u) => {
                  const initials =
                    u.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2) || "U";
                  
                  const isCurrentAdmin = u.id === user.id;
                  const hasAdminRole = u.roles?.some(r => r.name === 'ROLE_ADMIN' || r === 'ROLE_ADMIN');

                  return (
                    <div
                      key={u.id}
                      className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between hover:bg-muted/10 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar className="w-14 h-14 border shadow-sm">
                          <AvatarImage
                            src={
                              u.image ||
                              `https://api.dicebear.com/7.x/thumbs/svg?seed=${
                                u.email || "user"
                              }`
                            }
                          />
                          <AvatarFallback className="font-bold bg-primary/10 text-primary">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">
                              {u.name || "No Name"}
                            </h3>
                            {hasAdminRole && (
                              <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium border border-primary/30">
                                ADMIN
                              </span>
                            )}
                            {isCurrentAdmin && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 text-xs font-medium border border-emerald-500/30">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5" /> {u.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Globe className="w-3.5 h-3.5" />{" "}
                              {u.provider || "LOCAL"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 w-full md:w-auto">
                        <div className="flex flex-col gap-1 text-sm">
                          <span className="flex items-center gap-1.5">
                            {u.enable ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            {u.enable ? "Active" : "Disabled"}
                          </span>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="rounded-xl ml-auto"
                          onClick={() => handleDelete(u.id)}
                          disabled={deletingId === u.id || isCurrentAdmin}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {deletingId === u.id ? "..." : "Delete"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default AdminPanel;
