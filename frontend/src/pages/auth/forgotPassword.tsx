"use client";

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useNotification } from "@/hooks/use-notification";
import { forgotPassword } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/common/loadingSpinner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { notify } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const res = await forgotPassword(email);

      if (res.status === "success") {
        notify({
          type: "success",
          message: res.message || "Reset link sent. Please check your email.",
        });
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      notify({
        type: "error",
        message,
      });
      console.error("Forgot password error", err);
    } finally {
      setIsLoading(false);
    }

    setSent(true);
  };

  if (isLoading) return <LoadingSpinner label="Sent link..." />;

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-2xl border border-gray-100 shadow-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Forgot password?
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            {sent
              ? "Check your email for a reset link."
              : "Enter your email and we'll send a reset link."}
          </p>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl h-11"
                required
              />
              <Button type="submit" className="w-full h-11 rounded-xl">
                Send reset link
              </Button>
            </form>
          ) : null}
          <p className="text-center text-sm text-gray-500 mt-6">
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              Back to log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
