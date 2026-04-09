"use client";

import { useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { useNotification } from "@/hooks/use-notification";
import { resetPassword } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/common/loadingSpinner";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ResetPassword() {
  const params = useParams({ strict: false });
  const token = (params as { token?: string }).token;

  const { notify } = useNotification();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<
    "info" | "loading" | "success" | "error"
  >("info");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      notify({ type: "error", message: "Invalid or missing token." });
      return;
    }

    if (password !== confirmPassword) {
      notify({ type: "error", message: "Passwords do not match." });
      return;
    }

    setStatus("loading");
    try {
      const res = await resetPassword(token, password);

      if (res.status === "success") {
        setStatus("success");
        notify({
          type: "success",
          message: "Password has been reset successfully!",
        });
      }
    } catch (err) {
      setStatus("error");
      console.error("Reset password error", err);
      notify({
        type: "error",
        message: "Failed to reset password. Link may be expired.",
      });
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-8 order-2 md:order-1">
      <div className="w-full max-w-[400px]">
        <div className="text-left pb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {status === "success" ? "All Set!" : "Reset your"}
          </h1>
          <h2 className="text-xl md:text-lg font-semibold text-foreground mt-1">
            Codaptive Password
          </h2>
        </div>

        {status === "success" ? (
          <div className="space-y-6">
            <div className="bg-muted border border-border rounded-2xl p-6 text-center">
              <div className="mx-auto w-16 h-16 bg-background rounded-2xl shadow-sm flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Password Updated
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Password kamu berhasil diperbarui. Silakan login kembali
                menggunakan password baru kamu.
              </p>
            </div>
            <Button
              asChild
              className="w-full h-[46px] rounded-xl text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link to="/login">Sign In Now</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground/80 block mb-1.5">
                New Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl h-[46px] border-border bg-background text-foreground"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground/80 block mb-1.5">
                Confirm New Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="rounded-xl h-[46px] border-border bg-background text-foreground"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={status === "loading"}
              className="w-full h-[46px] rounded-xl text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 mt-2"
            >
              {status === "loading" ? (
                <LoadingSpinner size="sm" label="Updating..." />
              ) : (
                "Reset Password"
              )}
            </Button>

            <Button
              variant="ghost"
              asChild
              className="w-full h-[46px] rounded-xl text-base font-semibold text-muted-foreground hover:bg-muted/50"
            >
              <Link
                to="/login"
                className="flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} />
                Back to Login
              </Link>
            </Button>
          </form>
        )}

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Tiba-tiba ingat password?{" "}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Coba Login
          </Link>
        </div>
      </div>
    </div>
  );
}
