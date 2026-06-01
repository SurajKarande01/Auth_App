import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Key,
  Fingerprint,
  Lock,
  RefreshCw,
  UserCheck,
  Globe,
  Database,
  Zap,
  Check,
} from "lucide-react";
import { NavLink } from "react-router";

function Services() {
  const services = [
    {
      icon: <Key className="w-8 h-8" />,
      title: "JWT Authentication",
      desc: "Stateless, secure token-based authentication with HS512 signed access and refresh tokens. Automatic token rotation prevents replay attacks.",
      features: [
        "Access & Refresh tokens",
        "Token rotation",
        "Configurable TTL",
      ],
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "OAuth2 Social Login",
      desc: "Let users sign in with their existing Google or GitHub accounts. Zero friction onboarding with automatic account provisioning.",
      features: [
        "Google sign-in",
        "GitHub sign-in",
        "Auto account creation",
      ],
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Role-Based Access",
      desc: "Fine-grained authorization with Admin and Guest roles. Method-level security with @PreAuthorize ensures endpoint protection.",
      features: [
        "Admin & Guest roles",
        "Method-level security",
        "URL-pattern matching",
      ],
    },
    {
      icon: <RefreshCw className="w-8 h-8" />,
      title: "Auto Token Refresh",
      desc: "Seamless UX with automatic access token renewal. Failed requests are queued and replayed after token refresh — users never notice.",
      features: [
        "Axios interceptors",
        "Request queueing",
        "Silent renewal",
      ],
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Secure Cookie Handling",
      desc: "HttpOnly, Secure, SameSite cookies for refresh token storage. Configurable per environment for dev and production.",
      features: [
        "HttpOnly cookies",
        "SameSite protection",
        "Domain scoping",
      ],
    },
    {
      icon: <UserCheck className="w-8 h-8" />,
      title: "User Management API",
      desc: "Complete CRUD endpoints for user administration. Email lookup, profile updates, and account deletion with proper authorization.",
      features: [
        "Full CRUD",
        "Email lookup",
        "Admin-only controls",
      ],
    },
    {
      icon: <Fingerprint className="w-8 h-8" />,
      title: "BCrypt Password Hashing",
      desc: "Industry-standard password hashing with BCrypt. Passwords are never stored in plain text — only salted hashes.",
      features: [
        "Salted hashing",
        "Brute-force resistant",
        "Configurable rounds",
      ],
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Persistent Session Storage",
      desc: "Refresh tokens stored in MySQL with JTI tracking, revocation support, and token chain linking for security auditing.",
      features: [
        "JTI tracking",
        "Revocation support",
        "Chain linking",
      ],
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Swagger API Docs",
      desc: "Auto-generated OpenAPI 3.0 documentation with Swagger UI. Bearer token auth support built in for easy testing.",
      features: [
        "OpenAPI 3.0",
        "Interactive testing",
        "Bearer auth support",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative py-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Our Services
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Everything You Need for{" "}
            <span className="gradient-text">Auth</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A comprehensive suite of authentication and authorization services,
            designed to integrate seamlessly with your application.
          </p>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              viewport={{ once: true }}
            >
              <Card className="bg-card/70 backdrop-blur-lg border-border rounded-2xl h-full hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="text-primary mb-5 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                    {service.desc}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((f, j) => (
                      <li
                        key={j}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 rounded-2xl">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Secure Your App?
              </h2>
              <p className="text-muted-foreground mb-8">
                Get started in minutes. Create an account and integrate our
                authentication system into your project today.
              </p>
              <NavLink to="/signup">
                <Button size="lg" className="rounded-2xl px-8 text-lg">
                  Create Free Account
                </Button>
              </NavLink>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}

export default Services;
