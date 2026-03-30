import React from "react";
import NotificationItem from "./notificationItem";
import type { NotificationItem as NotificationType } from "../../contexts/notificationProvider";

interface NotificationContainerProps {
  notifications: NotificationType[];
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
}) => {
  return (
    <div className="fixed right-6 bottom-6 flex flex-col gap-3 z-[9999] pointer-events-none">
      {notifications.map((n) => (
        <div key={n.id} className="pointer-events-auto">
          <NotificationItem {...n} />
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;
