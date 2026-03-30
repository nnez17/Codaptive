"use client";

import * as React from "react";
import { getUserProfile } from "@/services/userService";
import { LoadingSpinner } from "@/components/common/loadingSpinner";

export type Account = {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  xp: number;
  streak: number;
  level: number;
};

type AccountContextValue = {
  account: Account | null;
  setAccount: (account: Account | null) => void;
};

const AccountContext = React.createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = React.useState<Account | null>(null);
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUserOnRefresh = async () => {
      const token = localStorage.getItem("accessToken");

      if (token && !account) {
        try {
          const res = await getUserProfile();
          setAccount(res.data);
        } catch (err: any) {
          console.error("Session expired or unauthorized");
          localStorage.removeItem("accessToken");
          setAccount(null);
        }
      }
      setIsInitialLoading(false);
    };

    fetchUserOnRefresh();
  }, []);

  const value = React.useMemo(() => ({ account, setAccount }), [account]);

  if (isInitialLoading)
    return <LoadingSpinner label="Loading application..." />;

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
}

export function useAccount() {
  const ctx = React.useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used within AccountProvider");
  return ctx;
}
