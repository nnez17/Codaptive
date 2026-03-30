import { createContext } from "react";

interface NotifyOptions {
  type?: "info" | "success" | "warning" | "error";
  message: string;
  duration?: number;
}

interface NotificationContextType {
  notify: (options: NotifyOptions) => void;
}

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);
