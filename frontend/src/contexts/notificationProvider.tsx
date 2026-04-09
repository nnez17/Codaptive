import { useState, useCallback } from "react";
import type { ReactNode } from "react";
import { NotificationContext } from "./notificationContext";
import NotificationContainer from "@/components/ui/notificationContainer";

export interface NotificationItem {
  id: number;
  type: "info" | "success" | "warning" | "error";
  message: string;
}

interface NotifyOptions {
  type?: NotificationItem["type"];
  message: string;
  duration?: number;
}

interface NotificationProviderProps {
  children: ReactNode;
}

function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const notify = useCallback(
    ({ type = "info", message, duration = 3000 }: NotifyOptions) => {
      const id = Date.now();

      setNotifications((prev) => [...prev, { id, type, message }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, duration);
    },
    [],
  );

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <NotificationContainer notifications={notifications} />
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;
