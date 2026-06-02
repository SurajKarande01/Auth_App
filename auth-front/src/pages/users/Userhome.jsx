import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  User,
  ShieldCheck,
  Calendar,
  Clock,
  Mail,
  Globe,
  KeyRound,
  CheckCircle2,
  XCircle,
  Fingerprint,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import useAuth from "@/auth/store";
import { useMemo } from "react";

function Userhome() {
  const user = useAuth((state) => state.user);

  // Compute real analytics from user data
  const analytics = useMemo(() => {
    if (!user) return null;

    const createdAt = user.createdAt ? new Date(user.createdAt) : null;
    const updatedAt = user.updatedAt ? new Date(user.updatedAt) : null;
    const now = new Date();

    // Calculate account age
    let accountAge = "N/A";
    let accountAgeDays = 0;
    if (createdAt) {
      accountAgeDays = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
      if (accountAgeDays === 0) accountAge = "Today";
      else if (accountAgeDays === 1) accountAge = "1 day";
      else if (accountAgeDays < 30) accountAge = `${accountAgeDays} days`;
      else if (accountAgeDays < 365) {
        const months = Math.floor(accountAgeDays / 30);
        accountAge = `${months} month${months > 1 ? "s" : ""}`;
      } else {
        const years = Math.floor(accountAgeDays / 365);
        const remainingMonths = Math.floor((accountAgeDays % 365) / 30);
        accountAge = `${years}y ${remainingMonths}m`;
      }
    }

    // Security score calculation
    let securityScore = 0;
    let securityFactors = [];

    // Email verified (has email)
    if (user.email) {
      securityScore += 25;
      securityFactors.push({ label: "Email configured", met: true });
    } else {
      securityFactors.push({ label: "Email configured", met: false });
    }

    // Account active
    if (user.enable) {
      securityScore += 25;
      securityFactors.push({ label: "Account active", met: true });
    } else {
      securityFactors.push({ label: "Account active", met: false });
    }

    // Has name set
    if (user.name && user.name.trim()) {
      securityScore += 15;
      securityFactors.push({ label: "Profile name set", met: true });
    } else {
      securityFactors.push({ label: "Profile name set", met: false });
    }

    // Auth provider
    if (user.provider === "GOOGLE" || user.provider === "GITHUB") {
      securityScore += 20;
      securityFactors.push({ label: "OAuth2 linked", met: true });
    } else {
      securityScore += 10;
      securityFactors.push({ label: "OAuth2 linked (optional)", met: false });
    }

    // Has roles assigned
    if (user.roles && user.roles.length > 0) {
      securityScore += 15;
      securityFactors.push({ label: "Roles assigned", met: true });
    } else {
      securityFactors.push({ label: "Roles assigned", met: false });
    }

    // Clamp to 100
    securityScore = Math.min(securityScore, 100);

    // Format dates
    const formatDate = (date) => {
      if (!date) return "N/A";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    const formatDateTime = (date) => {
      if (!date) return "N/A";
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    // Get roles
    const roles =
      user.roles?.map((r) => r.name?.replace("ROLE_", "") || r) || [];

    return {
      accountAge,
      accountAgeDays,
      securityScore,
      securityFactors,
      createdDate: formatDate(createdAt),
      updatedDate: formatDateTime(updatedAt),
      roles,
    };
  }, [user]);

  if (!user || !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Security score color
  const scoreColor =
    analytics.securityScore >= 80
      ? "text-emerald-500"
      : analytics.securityScore >= 50
        ? "text-amber-500"
        : "text-red-500";

  const scoreBarColor =
    analytics.securityScore >= 80
      ? "bg-emerald-500"
      : analytics.securityScore >= 50
        ? "bg-amber-500"
        : "bg-red-500";

  return (
    <div className="min-h-screen bg-background text-foreground p-6 max-w-6xl mx-auto">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold">Dashboard Overview</h1>
        <div className="flex items-center gap-2 mt-2">
          <p className="text-muted-foreground">
            Welcome back, <span className="text-primary font-medium">{user.name}</span>
          </p>
          {analytics.roles.includes("ADMIN") && (
            <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/30 uppercase">
              Admin
            </span>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          {
            title: "Account Age",
            value: analytics.accountAge,
            icon: <Calendar className="w-6 h-6 text-primary" />,
            subtitle: `Created ${analytics.createdDate}`,
          },
          {
            title: "Security Score",
            value: `${analytics.securityScore}%`,
            icon: <ShieldCheck className="w-6 h-6 text-primary" />,
            subtitle:
              analytics.securityScore >= 80
                ? "Excellent"
                : analytics.securityScore >= 50
                  ? "Good"
                  : "Needs improvement",
            valueColor: scoreColor,
          },
          {
            title: "Auth Provider",
            value: user.provider || "LOCAL",
            icon: <Globe className="w-6 h-6 text-primary" />,
            subtitle:
              user.provider === "LOCAL"
                ? "Email & Password"
                : `Via ${user.provider}`,
          },
          {
            title: "Account Status",
            value: user.enable ? "Active" : "Disabled",
            icon: user.enable ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500" />
            ),
            subtitle: `Last updated ${analytics.updatedDate}`,
            valueColor: user.enable ? "text-emerald-500" : "text-red-500",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <Card className="bg-card/70 backdrop-blur-lg border-border rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-muted-foreground text-sm font-medium">
                    {stat.title}
                  </p>
                  <div className="p-2 bg-muted rounded-xl">{stat.icon}</div>
                </div>
                <h3
                  className={`text-2xl font-bold ${stat.valueColor || ""}`}
                >
                  {stat.value}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {stat.subtitle}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Security Analysis */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-card/70 backdrop-blur-lg border-border rounded-2xl shadow-lg h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Security Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Score Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Overall Score
                  </span>
                  <span className={`text-lg font-bold ${scoreColor}`}>
                    {analytics.securityScore}%
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${analytics.securityScore}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full rounded-full ${scoreBarColor}`}
                  />
                </div>
              </div>

              {/* Factors */}
              <div className="space-y-3">
                {analytics.securityFactors.map((factor, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {factor.met ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        factor.met
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {factor.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-card/70 backdrop-blur-lg border-border rounded-2xl shadow-lg h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  icon: <User className="w-4 h-4" />,
                  label: "Full Name",
                  value: user.name || "Not set",
                },
                {
                  icon: <Mail className="w-4 h-4" />,
                  label: "Email",
                  value: user.email,
                },
                {
                  icon: <Fingerprint className="w-4 h-4" />,
                  label: "User ID",
                  value: user.id
                    ? `${user.id.substring(0, 8)}...${user.id.substring(user.id.length - 4)}`
                    : "N/A",
                },
                {
                  icon: <Globe className="w-4 h-4" />,
                  label: "Auth Provider",
                  value: user.provider || "LOCAL",
                },
                {
                  icon: <KeyRound className="w-4 h-4" />,
                  label: "Roles",
                  value:
                    analytics.roles.length > 0
                      ? analytics.roles.join(", ")
                      : "No roles",
                },
                {
                  icon: <Calendar className="w-4 h-4" />,
                  label: "Member Since",
                  value: analytics.createdDate,
                },
                {
                  icon: <Clock className="w-4 h-4" />,
                  label: "Last Updated",
                  value: analytics.updatedDate,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                >
                  <div className="flex items-center gap-2.5 text-muted-foreground">
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground text-right max-w-[60%] truncate">
                    {item.value}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Account Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="bg-card/70 backdrop-blur-lg border-border rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Account Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6 space-y-6">
              {/* Timeline line */}
              <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-border" />

              {/* Account created event */}
              <div className="relative">
                <div className="absolute -left-4 top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                <div>
                  <p className="text-sm font-medium">Account Created</p>
                  <p className="text-xs text-muted-foreground">
                    {analytics.createdDate} •{" "}
                    {user.provider === "LOCAL"
                      ? "Registered with email & password"
                      : `Signed up via ${user.provider}`}
                  </p>
                </div>
              </div>

              {/* Role assigned */}
              {analytics.roles.length > 0 && (
                <div className="relative">
                  <div className="absolute -left-4 top-1.5 w-3 h-3 rounded-full bg-primary/60 border-2 border-background" />
                  <div>
                    <p className="text-sm font-medium">Roles Assigned</p>
                    <p className="text-xs text-muted-foreground">
                      Granted: {analytics.roles.join(", ")}
                    </p>
                  </div>
                </div>
              )}

              {/* Profile updated (if different from creation) */}
              {user.updatedAt && user.createdAt && user.updatedAt !== user.createdAt && (
                <div className="relative">
                  <div className="absolute -left-4 top-1.5 w-3 h-3 rounded-full bg-primary/40 border-2 border-background" />
                  <div>
                    <p className="text-sm font-medium">Profile Updated</p>
                    <p className="text-xs text-muted-foreground">
                      {analytics.updatedDate}
                    </p>
                  </div>
                </div>
              )}

              {/* Current session */}
              <div className="relative">
                <div className="absolute -left-4 top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background animate-pulse" />
                <div>
                  <p className="text-sm font-medium text-emerald-500">
                    Current Session Active
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Logged in now • {analytics.accountAgeDays === 0
                      ? "Account created today"
                      : `Account is ${analytics.accountAge} old`}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default Userhome;
