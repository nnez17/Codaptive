"use client";

import * as React from "react";

export type Account = {
  id: string;
  name: string;
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
  const value = React.useMemo(() => ({ account, setAccount }), [account]);
  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
}

export function useAccount() {
  const ctx = React.useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used within AccountProvider");
  return ctx;
}
