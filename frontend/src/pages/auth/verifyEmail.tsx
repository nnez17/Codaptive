"use client";

import { useState, useEffect } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { useNotification } from "@/hooks/use-notification";
import { userVerifyEmail } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/loadingSpinner";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export default function VerifyEmail() {
  const params = useParams({ strict: false });
  const token = (params as { token?: string }).token;
  const [status, setStatus] = useState<
    "info" | "loading" | "success" | "error"
  >("info");

  const { notify } = useNotification();

  useEffect(() => {
    if (token) {
      handleVerifyToken();
    }
  }, [token]);

  const handleVerifyToken = async () => {
    if (typeof token !== "string") {
      setStatus("error");
      notify({
        type: "error",
        message: "Invalid verification link.",
      });
      return;
    }

    setStatus("loading");
    try {
      const res = await userVerifyEmail(token);

      if (res.status === "success") {
        setStatus("success");
        notify({
          type: "success",
          message: "Email verified successfully!",
        });
      }
    } catch (err) {
      setStatus("error");
      console.error("Email verification error", err);
      notify({
        type: "error",
        message: "Failed to verify email.",
      });
    }
  };

  const handleResendEmail = () => {
    alert("Email verifikasi telah dikirim ulang!");
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-8 order-2 md:order-1">
      <div className="w-full max-w-[400px]">
        <div className="text-left pb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {status === "success" ? "All Set!" : "Verify your"}
          </h1>
          <h2 className="text-xl md:text-lg font-semibold text-gray-900 mt-1">
            Codaptive Account
          </h2>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center">
            <div className="mx-auto w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
              {status === "success" ? (
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              ) : status === "error" ? (
                <AlertCircle className="w-8 h-8 text-red-500" />
              ) : (
                <Mail className="w-8 h-8 text-black" />
              )}
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {status === "success"
                ? "Email Verified"
                : status === "error"
                  ? "Invalid Link"
                  : "Check your inbox"}
            </h3>

            <p className="text-sm text-gray-600 leading-relaxed">
              {status === "success"
                ? "Akun kamu sudah aktif. Sekarang kamu bisa menikmati semua fitur Codaptive."
                : status === "error"
                  ? "Link verifikasi mungkin sudah kadaluarsa atau tidak valid. Silakan coba kirim ulang."
                  : "Kami telah mengirimkan link verifikasi ke email kamu. Silakan klik link tersebut untuk mengaktifkan akun."}
            </p>
          </div>

          <div className="space-y-3">
            {status === "success" ? (
              <Button
                asChild
                className="w-full h-[46px] rounded-xl text-base font-bold bg-black text-white hover:bg-black/90 mt-2"
              >
                <Link to="/login">Sign In Now</Link>
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleResendEmail}
                  disabled={status === "loading"}
                  className="w-full h-[46px] rounded-xl text-base font-bold bg-black text-white hover:bg-black/90 mt-2"
                >
                  {status === "loading" ? (
                    <LoadingSpinner size="sm" label="Verify..." />
                  ) : (
                    "Resend Verification Email"
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
