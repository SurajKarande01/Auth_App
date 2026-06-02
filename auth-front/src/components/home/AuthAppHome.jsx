import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Shield, Lock, Sparkles, Fingerprint, ArrowRight, LayoutDashboard } from "lucide-react";
import { NavLink } from "react-router";
import useAuth from "@/auth/store";

export default function AuthAppHome() {
  const checkLogin = useAuth((state) => state.checkLogin);
  const user = useAuth((state) => state.user);
  const isLoggedIn = checkLogin();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-28 px-6 text-center flex flex-col items-center justify-center">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Shield className="w-4 h-4" />
            Full-Stack Authentication Platform
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-5xl md:text-7xl font-bold tracking-tight"
        >
          Secure. Fast.{" "}
          <span className="gradient-text">Futuristic.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground"
        >
          {isLoggedIn
            ? `Welcome back, ${user?.name || "User"}! Your dashboard is ready.`
            : "The next‑generation authentication platform built for modern apps. JWT tokens, OAuth2 social login, and role-based access — all in one."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative mt-10 flex gap-4"
        >
          {isLoggedIn ? (
            <>
              <NavLink to="/dashboard">
                <Button size="lg" className="rounded-2xl text-lg px-6 cursor-pointer group">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </NavLink>
              <NavLink to="/dashboard/profile">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-2xl text-lg px-6 border-border cursor-pointer"
                >
                  View Profile
                </Button>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/signup">
                <Button size="lg" className="rounded-2xl text-lg px-6 cursor-pointer group">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </NavLink>
              <NavLink to="/services">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-2xl text-lg px-6 border-border cursor-pointer"
                >
                  Learn More
                </Button>
              </NavLink>
            </>
          )}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <h2 className="text-4xl font-bold text-center mb-16">
          Powerful Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Biometric Login",
              desc: "Next‑level security with fingerprint and facial recognition.",
              icon: <Fingerprint className="w-10 h-10" />,
            },
            {
              title: "Multi‑Layer Encryption",
              desc: "Industry‑grade encrypted authentication for complete safety.",
              icon: <Lock className="w-10 h-10" />,
            },
            {
              title: "Smart Access Control",
              desc: "AI‑powered access system that adapts to real‑time threats.",
              icon: <Shield className="w-10 h-10" />,
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-card/70 backdrop-blur-xl border-border rounded-2xl shadow-lg hover:border-primary/30 hover:shadow-primary/5 transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
                    {f.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{f.title}</h3>
                  <p className="text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 px-6 text-center bg-card/50 backdrop-blur-lg border-t border-border">
        <h2 className="text-4xl font-bold">
          {isLoggedIn
            ? "Your Account is Protected"
            : "Start Securing Your App Today"}
        </h2>
        <p className="mt-4 max-w-xl mx-auto text-muted-foreground text-lg">
          {isLoggedIn
            ? "Manage your profile, update your security settings, and stay in control."
            : "Join thousands of developers already building with our authentication system."}
        </p>

        {isLoggedIn ? (
          <NavLink to="/dashboard/profile">
            <Button size="lg" className="mt-8 px-8 text-lg rounded-2xl cursor-pointer">
              Manage Account
            </Button>
          </NavLink>
        ) : (
          <NavLink to="/signup">
            <Button size="lg" className="mt-8 px-8 text-lg rounded-2xl cursor-pointer">
              Create Account
            </Button>
          </NavLink>
        )}
      </section>

      {/* Extra Section — Why Choose Us */}
      <section className="py-24 px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          Why Choose Our Auth Platform?
        </h2>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 text-muted-foreground">
          {[
            {
              title: "AI‑Driven Security",
              desc: "Real‑time monitoring detects suspicious activities and prevents unauthorized access.",
            },
            {
              title: "Lightning‑Fast Performance",
              desc: "Built for scale with instant response times for authentication flows.",
            },
            {
              title: "Developer‑Friendly API",
              desc: "Integrate in minutes with clean, powerful, well‑structured APIs.",
            },
            {
              title: "Highly Customizable",
              desc: "Theme, workflow, and control options designed to match your app perfectly.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold mb-3 flex items-center gap-2 text-foreground">
                <Sparkles className="w-6 h-6 text-primary" /> {item.title}
              </h3>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-muted-foreground border-t border-border">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Auth_App. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <NavLink to="/about" className="hover:text-primary transition-colors">
              About
            </NavLink>
            <NavLink to="/services" className="hover:text-primary transition-colors">
              Services
            </NavLink>
            {isLoggedIn ? (
              <NavLink to="/dashboard" className="hover:text-primary transition-colors">
                Dashboard
              </NavLink>
            ) : (
              <NavLink to="/login" className="hover:text-primary transition-colors">
                Login
              </NavLink>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
