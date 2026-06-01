import React, { useState } from "react";
import { Button } from "./ui/button";
import { NavLink, useNavigate } from "react-router";
import useAuth from "@/auth/store";
import { Menu, X, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const checkLogin = useAuth((state) => state.checkLogin);
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors hover:text-primary ${
      isActive ? "text-primary" : "text-muted-foreground"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
      isActive
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-md group-hover:shadow-primary/25 transition-shadow">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">Auth_App</span>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {checkLogin() ? (
              <>
                <NavLink to="/dashboard" end className={linkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/dashboard/profile" className={linkClass}>
                  {user?.name || "Profile"}
                </NavLink>
                <Button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  size="sm"
                  className="cursor-pointer rounded-xl"
                  variant="outline"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/" end className={linkClass}>
                  Home
                </NavLink>
                <NavLink to="/about" className={linkClass}>
                  About
                </NavLink>
                <NavLink to="/services" className={linkClass}>
                  Services
                </NavLink>
                <div className="flex items-center gap-2 ml-2">
                  <NavLink to="/login">
                    <Button
                      size="sm"
                      className="cursor-pointer rounded-xl"
                      variant="outline"
                    >
                      Login
                    </Button>
                  </NavLink>
                  <NavLink to="/signup">
                    <Button
                      size="sm"
                      className="cursor-pointer rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Sign Up
                    </Button>
                  </NavLink>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {checkLogin() ? (
                <>
                  <NavLink
                    to="/dashboard"
                    end
                    className={mobileLinkClass}
                    onClick={() => setMobileOpen(false)}
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/dashboard/profile"
                    className={mobileLinkClass}
                    onClick={() => setMobileOpen(false)}
                  >
                    {user?.name || "Profile"}
                  </NavLink>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                      setMobileOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/"
                    end
                    className={mobileLinkClass}
                    onClick={() => setMobileOpen(false)}
                  >
                    Home
                  </NavLink>
                  <NavLink
                    to="/about"
                    className={mobileLinkClass}
                    onClick={() => setMobileOpen(false)}
                  >
                    About
                  </NavLink>
                  <NavLink
                    to="/services"
                    className={mobileLinkClass}
                    onClick={() => setMobileOpen(false)}
                  >
                    Services
                  </NavLink>
                  <div className="pt-2 flex gap-2">
                    <NavLink to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Button
                        size="sm"
                        className="w-full cursor-pointer rounded-xl"
                        variant="outline"
                      >
                        Login
                      </Button>
                    </NavLink>
                    <NavLink to="/signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Button
                        size="sm"
                        className="w-full cursor-pointer rounded-xl"
                      >
                        Sign Up
                      </Button>
                    </NavLink>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
