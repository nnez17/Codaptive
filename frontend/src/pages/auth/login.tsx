"use client";

import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAccount } from "@/contexts/account";
import { getUserProfile } from "@/services/userService";
import { userLogin } from "@/services/authService";
import { useNotification } from "@/hooks/use-notification";
import { LoadingSpinner } from "@/components/common/loadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CodeWindow } from "@/components/ui/codeWindow";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { setAccount } = useAccount();
  const { notify } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const loginResult = await userLogin(email, password);

      const accessToken = loginResult.data.accessToken;
      localStorage.setItem("accessToken", accessToken);

      const profileResult = await getUserProfile();

      if (profileResult.status === "success") {
        setAccount(profileResult.data);

        notify({
          type: "success",
          message: "Login successful.",
        });

        setTimeout(() => {
          navigate({ to: "/profile" });
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
      console.error("Login error", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner label="Loading..." />;

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 order-2 md:order-1">
        <div className="w-full max-w-[400px]">
          <div className="text-left pb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Sign in to
            </h1>
            <h2 className="text-xl md:text-lg font-semibold text-gray-900 mt-1">
              Codaptive
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 block mb-1.5"
              >
                Email / No HP
              </label>
              <Input
                id="email"
                type="text"
                placeholder="Masukkan email atau no HP"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl h-[46px] border-gray-200"
                autoComplete="email"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 block mb-1.5"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl h-[46px] border-gray-200"
                autoComplete="current-password"
              />
            </div>
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded text-black focus:ring-black w-4 h-4 border-gray-300"
                />
                <span className="text-gray-600">Remember Me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-gray-900 hover:text-black font-semibold"
              >
                Forgot password?
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full h-[46px] rounded-xl text-base font-bold bg-black text-white hover:bg-black/90 mt-2"
            >
              Sign In
            </Button>
          </form>
          <div className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-black font-bold hover:underline"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden md:flex flex-1 bg-[#09090B] items-center justify-center p-6 md:p-12 order-1 md:order-2 overflow-hidden relative rounded-2xl">
        {/* Decorative Grid & Glow Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none -translate-x-10 -translate-y-10"></div>

        <div className="w-full max-w-[460px] relative z-10">
          <CodeWindow filename="main.py" className="shadow-2xl">
            <div className="w-full flex items-center pt-6 pb-2 px-2">
              <pre className="font-mono text-sm sm:text-base leading-6 sm:leading-7 m-0 bg-transparent p-0 overflow-visible text-[#ABB2BF] font-medium">
                <span className="text-[#56B6C2]">print</span>(
                <span className="text-[#98C379]">"Hello, world!"</span>)
              </pre>
            </div>
          </CodeWindow>
        </div>
        <div className="absolute bottom-8 left-8 flex items-center gap-2">
          <img
            src="/icons.png"
            alt="Codaptive"
            className="w-8 h-8 object-contain"
          />
          <span className="text-white font-bold text-lg leading-none">
            Codaptive
          </span>
        </div>
      </div>
    </div>
  );
}
