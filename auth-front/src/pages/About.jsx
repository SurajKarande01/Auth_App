import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Lock,
  Globe,
  Zap,
  Users,
  Code,
  Github,
  Mail,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

function About() {
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
            <Shield className="w-4 h-4" />
            About Us
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Built for{" "}
            <span className="gradient-text">Security</span>,{" "}
            Designed for{" "}
            <span className="gradient-text">Developers</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Auth_App is a modern, full-stack authentication platform powered by
            Spring Boot and React. We provide secure JWT-based authentication,
            OAuth2 social login, and role-based access control — all in a single,
            production-ready solution.
          </p>
        </motion.div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileInView="animate"
            initial="initial"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Our Mission
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We believe authentication shouldn't be a bottleneck. Our mission
              is to provide developers with a plug-and-play auth system that's
              secure, extensible, and easy to integrate into any application.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Whether you're building a SaaS product, an internal tool, or a
              personal project, Auth_App gives you everything you need to handle
              user authentication from day one.
            </p>
          </motion.div>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            whileInView="animate"
            initial="initial"
            className="grid grid-cols-2 gap-4"
          >
            {[
              { value: "99.9%", label: "Uptime SLA" },
              { value: "< 50ms", label: "Auth Latency" },
              { value: "10K+", label: "Developers" },
              { value: "AES-256", label: "Encryption" },
            ].map((stat, i) => (
              <Card
                key={i}
                className="bg-card/70 backdrop-blur-lg border-border rounded-2xl text-center"
              >
                <CardContent className="p-6">
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            {...fadeUp}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileInView="animate"
            initial="initial"
            className="text-3xl md:text-4xl font-bold text-center mb-16"
          >
            Technology Stack
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Code className="w-8 h-8" />,
                title: "Spring Boot 3",
                desc: "Robust Java backend with Spring Security, JPA, and REST APIs for enterprise-grade reliability.",
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "React + Vite",
                desc: "Lightning-fast frontend with modern React, Zustand state management, and Tailwind CSS styling.",
              },
              {
                icon: <Lock className="w-8 h-8" />,
                title: "JWT + OAuth2",
                desc: "Stateless JWT authentication with refresh token rotation, plus Google & GitHub social login.",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Role-Based Access",
                desc: "Fine-grained RBAC with admin and guest roles, method-level security, and protected endpoints.",
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Auto Token Refresh",
                desc: "Seamless access token renewal via Axios interceptors with automatic retry queuing.",
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "User Management",
                desc: "Complete CRUD operations for users with profile management, email lookup, and admin controls.",
              },
            ].map((tech, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-card/70 backdrop-blur-lg border-border rounded-2xl h-full hover:border-primary/30 transition-colors">
                  <CardContent className="p-8">
                    <div className="text-primary mb-4">{tech.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{tech.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {tech.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Creator Section */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileInView="animate"
            initial="initial"
          >
            <h2 className="text-3xl font-bold mb-6">Created By</h2>
            <Card className="bg-card/70 backdrop-blur-lg border-border rounded-2xl">
              <CardContent className="p-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                  SK
                </div>
                <h3 className="text-xl font-semibold">Suraj Karande</h3>
                <p className="text-muted-foreground mt-2 mb-4">
                  Full-Stack Developer passionate about building secure,
                  scalable applications with modern technologies.
                </p>
                <div className="flex justify-center gap-4">
                  <a
                    href="mailto:surajdkarande6396@gmail.com"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="w-4 h-4" /> Email
                  </a>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Github className="w-4 h-4" /> GitHub
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default About;
