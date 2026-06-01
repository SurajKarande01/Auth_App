import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { NavLink } from "react-router";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email.trim() === "") {
      toast.error("Email is required!");
      return;
    }
    setLoading(true);
    // Simulate API call — backend endpoint can be added later
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      toast.success("Reset link sent!");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <Card className="bg-card/70 backdrop-blur-xl border-border shadow-2xl rounded-2xl p-6">
          <CardContent>
            {!submitted ? (
              <>
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold text-center"
                >
                  Reset Password
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center text-muted-foreground mt-2 mb-8"
                >
                  Enter your email and we'll send you a reset link
                </motion.p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button
                    disabled={loading}
                    className="w-full cursor-pointer rounded-2xl text-lg"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Check Your Email</h2>
                <p className="text-muted-foreground mb-6">
                  We've sent a password reset link to{" "}
                  <span className="font-medium text-foreground">{email}</span>.
                  Please check your inbox and spam folder.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSubmitted(false);
                    setEmail("");
                  }}
                  className="rounded-2xl cursor-pointer"
                >
                  Try a different email
                </Button>
              </motion.div>
            )}

            <div className="mt-6 text-center">
              <NavLink
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </NavLink>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;
