import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { NavLink } from "react-router";

function OAuthFailure() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="bg-card/70 backdrop-blur-xl border-border shadow-2xl rounded-2xl">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
              className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6"
            >
              <XCircle className="w-8 h-8 text-destructive" />
            </motion.div>

            <h1 className="text-2xl font-bold mb-3">Login Failed</h1>
            <p className="text-muted-foreground mb-8">
              Something went wrong during the authentication process. This could
              be due to denied permissions, an expired session, or a
              configuration issue.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <NavLink to="/login" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full rounded-2xl cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              </NavLink>
              <Button
                onClick={() => window.location.reload()}
                className="flex-1 rounded-2xl cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default OAuthFailure;
