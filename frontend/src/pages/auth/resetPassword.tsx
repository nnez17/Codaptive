"use client";

import { useState } from "react";
import { Link, useParams, useNavigate } from "@tanstack/react-router";
import { useNotification } from "@/hooks/use-notification";
import { resetPassword } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/common/loadingSpinner";
import {
  Lock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

export default function ResetPassword() {
  const params = useParams({ strict: false });
  const token = (params as { token?: string }).token;

  const navigate = useNavigate();
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {status === "success" ? "All Set!" : "Reset your"}
          </h1>
          <h2 className="text-xl md:text-lg font-semibold text-gray-900 mt-1">
            Codaptive Password
          </h2>
        </div>

        {status === "success" ? (
          <div className="space-y-6">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center">
              <div className="mx-auto w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Password Updated
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Password kamu berhasil diperbarui. Silakan login kembali
                menggunakan password baru kamu.
              </p>
            </div>
            <Button
              asChild
              className="w-full h-[46px] rounded-xl text-base font-bold bg-black text-white hover:bg-black/90"
            >
              <Link to="/login">Sign In Now</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                New Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl h-[46px] border-gray-200"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Confirm New Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="rounded-xl h-[46px] border-gray-200"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={status === "loading"}
              className="w-full h-[46px] rounded-xl text-base font-bold bg-black text-white hover:bg-black/90 mt-2"
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
              className="w-full h-[46px] rounded-xl text-base font-semibold text-gray-600 hover:bg-gray-50"
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

        <div className="mt-8 text-center text-sm text-gray-600">
          Tiba-tiba ingat password?{" "}
          <Link to="/login" className="text-black font-bold hover:underline">
            Coba Login
          </Link>
        </div>
      </div>
    </div>
  );
}
