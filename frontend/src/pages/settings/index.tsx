"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LabeledInput } from "@/components/ui/labeledInput";
import { useTheme } from "@/contexts/themeProvider";
import { useAccount } from "@/contexts/account";
import {
  updateProfile,
  updatePassword,
  uploadAvatar,
} from "@/services/userService";

import {
  Moon,
  Sun,
  Camera,
  Loader2,
  Check,
  AlertCircle,
  User,
  Lock,
  ImageIcon,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

const maxAvatarSize = 1 * 1024 * 1024;

type FeedbackState = {
  type: "success" | "error" | "idle";
  message: string;
};

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { account, setAccount } = useAccount();

  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarFeedback, setAvatarFeedback] = useState<FeedbackState>({
    type: "idle",
    message: "",
  });

  const [newName, setNewName] = useState(account?.username || "");
  const [nameLoading, setNameLoading] = useState(false);

  useEffect(() => {
    if (account?.username) {
      setNewName(account.username);
    }
  }, [account?.username]);

  const [nameFeedback, setNameFeedback] = useState<FeedbackState>({
    type: "idle",
    message: "",
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<FeedbackState>({
    type: "idle",
    message: "",
  });

  const autoFeedback = useCallback(
    (setter: (f: FeedbackState) => void, state: FeedbackState, ms = 4000) => {
      setter(state);
      if (state.type !== "idle") {
        setTimeout(() => setter({ type: "idle", message: "" }), ms);
      }
    },
    [],
  );

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      autoFeedback(setAvatarFeedback, {
        type: "error",
        message: "Please select an image file (JPG, PNG, etc.)",
      });
      return;
    }

    if (file.size > maxAvatarSize) {
      autoFeedback(setAvatarFeedback, {
        type: "error",
        message: `Image must be under 1 MB. Yours is ${(file.size / (1024 * 1024)).toFixed(1)} MB.`,
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setAvatarPreview(base64String);
      
      setAvatarLoading(true);
      try {
        const res = await uploadAvatar(base64String);
        if (account) {
          setAccount({ ...account, avatar: res.data?.avatar || base64String });
        }
        autoFeedback(setAvatarFeedback, {
          type: "success",
          message: "Profile picture updated!",
        });
      } catch (err: any) {
        autoFeedback(setAvatarFeedback, {
          type: "error",
          message:
            err?.response?.data?.message || "Failed to upload. Please try again.",
        });
      } finally {
        setAvatarLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  const handleNameSave = async () => {
    const trimmed = newName.trim();
    if (!trimmed) {
      autoFeedback(setNameFeedback, {
        type: "error",
        message: "Name cannot be empty.",
      });
      return;
    }
    if (trimmed === account?.username) {
      autoFeedback(setNameFeedback, {
        type: "error",
        message: "This is already your current name.",
      });
      return;
    }

    setNameLoading(true);
    try {
      await updateProfile({ username: trimmed });
      if (account) setAccount({ ...account, username: trimmed });
      autoFeedback(setNameFeedback, {
        type: "success",
        message: "Name updated successfully!",
      });
    } catch (err: any) {
      autoFeedback(setNameFeedback, {
        type: "error",
        message: err?.response?.data?.message || "Failed to update name.",
      });
    } finally {
      setNameLoading(false);
    }
  };

  const handlePasswordSave = async () => {
    if (!currentPassword) {
      autoFeedback(setPasswordFeedback, {
        type: "error",
        message: "Please enter your current password.",
      });
      return;
    }
    if (newPassword.length < 6) {
      autoFeedback(setPasswordFeedback, {
        type: "error",
        message: "New password must be at least 6 characters.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      autoFeedback(setPasswordFeedback, {
        type: "error",
        message: "New passwords don't match.",
      });
      return;
    }

    setPasswordLoading(true);
    try {
      await updatePassword(currentPassword, newPassword);
      autoFeedback(setPasswordFeedback, {
        type: "success",
        message: "Password changed successfully!",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      autoFeedback(setPasswordFeedback, {
        type: "error",
        message: err?.response?.data?.message || "Failed to change password.",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const displayAvatar = avatarPreview || account?.avatar;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 bg-background/70 backdrop-blur-sm border-b border-border px-4 py-3 sm:px-6 md:py-4 flex justify-center lg:hidden">
        <div className="max-w-7xl w-full flex items-center gap-3">
          <SidebarTrigger className="-ml-2" />
          <div className="lg:hidden">
            <img src="/icons.png" alt="Logo" width={28} height={28} />
          </div>
          <div className="flex-1" />
          <Link
            to="/profile"
            className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-10 pb-24 md:pb-10">
        <div className="space-y-1 mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Account Settings
            </h1>
          </div>
          <p className="text-sm md:text-base text-foreground/60">
            Manage your profile and account preferences.
          </p>
        </div>

        <Card className="rounded-2xl md:rounded-3xl border-border bg-card shadow-sm overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2.5 mb-5">
              <ImageIcon className="w-5 h-5 text-primary" />
              <h2 className="text-lg md:text-xl font-bold text-foreground">
                Profile Picture
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8">
              <div className="relative group">
                <div
                  className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden ring-4 ring-primary/10 shadow-xl shadow-primary/10 bg-primary flex items-center justify-center cursor-pointer transition-all duration-300 group-hover:ring-primary/30"
                  onClick={handleAvatarClick}
                >
                  {displayAvatar ? (
                    <img
                      src={displayAvatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-primary-foreground text-3xl md:text-4xl font-bold">
                      {account?.username?.charAt(0).toUpperCase() || "?"}
                    </span>
                  )}

                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {avatarLoading ? (
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    ) : (
                      <Camera className="w-6 h-6 text-white" />
                    )}
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <p className="text-sm text-foreground font-medium">
                  Click the avatar to upload a new photo
                </p>
                <p className="text-xs text-muted-foreground">
                  Accepted formats: JPG, PNG, GIF, WebP. Max size:{" "}
                  <span className="font-semibold text-foreground/70">1 MB</span>
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl mt-2 text-sm font-semibold"
                  onClick={handleAvatarClick}
                  disabled={avatarLoading}
                >
                  {avatarLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Choose File"
                  )}
                </Button>
              </div>
            </div>

            {avatarFeedback.type !== "idle" && (
              <FeedbackBanner
                type={avatarFeedback.type}
                message={avatarFeedback.message}
              />
            )}
          </div>

          <div className="border-t border-border" />

          <div className="p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-2.5">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-lg md:text-xl font-bold text-foreground">
                Display Name
              </h2>
            </div>

            <p className="text-sm text-muted-foreground">
              This is the name that will be displayed on your profile and
              throughout the platform.
            </p>
            <LabeledInput
              label="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter your display name"
              maxLength={50}
              maxLengthDisplay={50}
            />

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                className="rounded-xl font-semibold px-6 h-11"
                onClick={handleNameSave}
                disabled={nameLoading || !newName.trim()}
              >
                {nameLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Name"
                )}
              </Button>
            </div>

            {nameFeedback.type !== "idle" && (
              <FeedbackBanner
                type={nameFeedback.type}
                message={nameFeedback.message}
              />
            )}
          </div>

          <div className="border-t border-border" />

          <div className="p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-2.5">
              <Lock className="w-5 h-5 text-primary" />
              <h2 className="text-lg md:text-xl font-bold text-foreground">
                Change Password
              </h2>
            </div>

            <p className="text-sm text-muted-foreground">
              Use a strong password with at least 6 characters.
            </p>

            <div className="space-y-4">
              <LabeledInput
                label="Current Password"
                type="password"
                showPasswordToggle
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
              />
              <LabeledInput
                label="New Password"
                type="password"
                showPasswordToggle
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
              <LabeledInput
                label="Confirm New Password"
                type="password"
                showPasswordToggle
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                className="rounded-xl font-semibold px-6 h-11"
                onClick={handlePasswordSave}
                disabled={passwordLoading}
              >
                {passwordLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Changing...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </div>

            {passwordFeedback.type !== "idle" && (
              <FeedbackBanner
                type={passwordFeedback.type}
                message={passwordFeedback.message}
              />
            )}
          </div>

          <div className="border-t border-border" />

          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2.5 mb-5">
              <Sun className="w-5 h-5 text-primary" />
              <h2 className="text-lg md:text-xl font-bold text-foreground">
                Appearance
              </h2>
            </div>

            <div className="flex flex-col space-y-4">
              <span className="text-sm font-medium text-foreground">
                Theme Preference
              </span>
              <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-sm">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  className="h-12 rounded-xl flex items-center justify-center gap-2"
                  onClick={() => setTheme("light")}
                >
                  <Sun className="h-4 w-4" /> Light
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  className="h-12 rounded-xl flex items-center justify-center gap-2"
                  onClick={() => setTheme("dark")}
                >
                  <Moon className="h-4 w-4" /> Dark
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-border" />

          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2.5 mb-3">
              <LogOut className="w-5 h-5 text-red-500" />
              <h2 className="text-lg md:text-xl font-bold text-foreground">
                Log Out
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              Sign out of your account on this device.
            </p>
            <Button
              variant="outline"
              className="rounded-xl font-semibold px-6 h-11 border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all"
              onClick={() => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                setAccount(null);
                navigate({ to: "/login" });
              }}
            >
              Log Out
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function FeedbackBanner({
  type,
  message,
}: {
  type: "success" | "error";
  message: string;
}) {
  const isSuccess = type === "success";
  return (
    <div
      className={`mt-4 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-300 ${
        isSuccess
          ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
          : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
      }`}
    >
      {isSuccess ? (
        <Check className="w-4 h-4 shrink-0" />
      ) : (
        <AlertCircle className="w-4 h-4 shrink-0" />
      )}
      <span>{message}</span>
    </div>
  );
}
