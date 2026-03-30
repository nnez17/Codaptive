"use client";

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, X } from "lucide-react";
import { userRegister } from "@/services/authService";
import { useNotification } from "@/hooks/use-notification";
import { LoadingSpinner } from "@/components/common/loadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Register() {
  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { notify } = useNotification();

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => setStep((s: number) => Math.min(s + 1, totalSteps));
  const handleBack = () => {
    if (step === 1) navigate({ to: "/login" });
    else setStep((s: number) => s - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    if (password !== confirmPassword) {
      notify({
        type: "error",
        message: "Passwords do not match!",
      });
      return;
    }

    try {
      const payload = {
        username: name,
        email,
        password,
        confirmPassword,
      };

      const result = await userRegister(payload);

      if (result.status === "success") {
        notify({
          type: "success",
          message: "Registered successful.",
        });

        setTimeout(() => {
          notify({
            type: "info",
            message: "Please check your email to verify your account.",
          });
        }, 1500);
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      notify({
        type: "error",
        message,
      });
      console.error("Registration Error", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner label="Loading..." />;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Progress Header */}
      <header className="sticky top-0 left-0 right-0 h-16 flex items-center px-4 md:px-8 bg-white z-50">
        <div className="max-w-4xl mx-auto w-full flex items-center gap-4 md:gap-8">
          <button
            type="button"
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
            aria-label="Back or Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 pt-24 pb-12">
        <div className="w-full max-w-[520px] flex flex-col items-center">
          {step === 1 && (
            <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-10 relative">
                <img
                  src="/Macot.png"
                  alt="Macot"
                  className="w-48 h-48 object-contain drop-shadow-xl"
                />
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-black/5 blur-lg rounded-full" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed max-w-[400px]">
                Sebelum kita belajar bersama, aku akan memberikan beberapa
                pertanyaan untuk mengetahui seberapa tinggi tingkat pemahamanmu
                agar proses belajarmu lebih adaptive
              </h1>
              <Button
                onClick={handleNext}
                className="mt-12 w-full max-w-[320px] h-[52px] rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm tracking-widest shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
              >
                CONTINUE
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-6 flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4 overflow-hidden border-2 border-white shadow-sm">
                  <img
                    src="/Macot.png"
                    alt="Macot"
                    className="w-24 h-24 object-contain"
                  />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Now Fill This Field Bellow
                </h2>
              </div>

              <div className="w-full space-y-6">
                <div className="space-y-1.5">
                  <label
                    className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1"
                    htmlFor="username"
                  >
                    User name
                  </label>
                  <Input
                    id="username"
                    placeholder="Enter your name name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-14 rounded-xl border-gray-200 focus:border-blue-500 transition-all text-sm px-4"
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    placeholder="Enter your email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 rounded-xl border-gray-200 focus:border-blue-500 transition-all text-sm px-4"
                  />
                </div>
              </div>

              <Button
                onClick={handleNext}
                className="mt-12 w-full max-w-[320px] h-[52px] rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm tracking-widest shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
              >
                CONTINUE
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-6 flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4 overflow-hidden border-2 border-white shadow-sm">
                  <img
                    src="/Macot.png"
                    alt="Macot"
                    className="w-24 h-24 object-contain"
                  />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Now Fill This Field Bellow
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="w-full space-y-6">
                <div className="space-y-1.5">
                  <label
                    className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      placeholder="Enter your Password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-14 rounded-xl border-gray-200 focus:border-blue-500 transition-all text-sm px-4 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label
                    className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1"
                    htmlFor="confirm-password"
                  >
                    Confrim Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      placeholder="Confirm your Password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-14 rounded-xl border-gray-200 focus:border-blue-500 transition-all text-sm px-4 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="mt-6 w-full h-[52px] rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm tracking-widest shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
                >
                  REGISTER
                </Button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
