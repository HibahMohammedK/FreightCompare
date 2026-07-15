import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { markAsRead, markAllAsRead, removeNotification, clearNotifications } from '../../../redux/notificationSlice';
import { markNotificationRead, markAllNotificationsRead, deleteNotification, clearNotifications as clearNotificationsApi, } from '../../../api/notifications';
import type { Notification } from "../../../redux/notificationSlice";
import { BellIcon, CheckIcon, Trash2Icon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { NotificationTypeIcon } from './NotificationTypeIcon';

interface NotificationListProps {
  maxItems?: number;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  maxItems,
}) => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(
    (state) => state.notification.notifications
  );
  const navigate = useNavigate();
  const displayNotifications = maxItems ?
  notifications.slice(0, maxItems) :
  notifications;

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 bg-bg-light rounded-full flex items-center justify-center text-text-lighter mb-3">
          <BellIcon size={24} />
        </div>
        <p className="text-sm font-medium text-text-dark">No notifications</p>
        <p className="text-xs text-text-light mt-1">You're all caught up!</p>
      </div>);
  }

  const handleMarkAsRead = async (
      id: string
  ) => {

      try {
          await markNotificationRead(id);
          dispatch(
              markAsRead(id)
          );

      } catch (error) {

          console.error(
              "Failed to mark notification as read",
              error
          );

      }

  };

  const handleNotificationClick = async (
        notification: Notification
    ) => {

        if (!notification.is_read) {
            await handleMarkAsRead(notification.id);
        }
        console.log(notification);

        switch (notification.type) {

            case "price_alert":
                console.log(
                    notification.source,
                    notification.destination,
                    notification.transport_type
                );
                
            case "route_match":

                if (
                    notification.source &&
                    notification.destination &&
                    notification.transport_type
                ) {

                    navigate(
                        `/search?source=${encodeURIComponent(notification.source)}&destination=${encodeURIComponent(notification.destination)}&type=${notification.transport_type}`
                    );

                }

                break;

            case "subscription":
                navigate("/pricing");
                break;

            case "chat":
                navigate("/chat");
                break;

            default:
                break;
        }
    };

  const handleMarkAllAsRead = async () => {

      try {

          await markAllNotificationsRead();

          dispatch(
              markAllAsRead()
          );

      } catch (error) {

          console.error(
              "Failed to mark all notifications as read",
              error
          );
      }
  };

  const handleDeleteNotification = async (
        id: string
    ) => {

        try {
            await deleteNotification(id);
            dispatch(
                removeNotification(id)
            );

        } catch (error) {
            console.error(
                "Failed to delete notification",
                error
            );
        }
    };

  const handleClearNotifications = async () => {
      if (!window.confirm("Clear all notifications?")) {
          return;
      }

      try {
          await clearNotificationsApi();
          dispatch(clearNotifications());
      } catch (error) {
          console.error(
              "Failed to clear notifications",
              error
          );
      }
  };
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-light">
        <span className="text-sm font-semibold text-text-dark">
          Notifications
        </span>
        <button
            onClick={handleMarkAllAsRead}
            className="
                flex
                items-center
                gap-1
                rounded-md
                px-2
                py-1
                text-xs
                font-medium
                text-primary
                transition-colors
                hover:bg-primary-light
                hover:text-primary-dark
            "
        >
            <CheckIcon size={14} />
            Mark all read
        </button>
      </div>
      <div className="overflow-y-auto max-h-[400px]">
        {displayNotifications.map((notification) =>
        <button
            type="button"
            key={notification.id}
            onClick={() =>
                handleNotificationClick(notification)
            }
            className={`
                group
                w-full
                p-4
                border-b
                border-border-light
                text-left
                transition-colors
                hover:bg-bg-light
                flex
                gap-3
                ${
                    !notification.is_read
                        ? "bg-blue-50"
                        : ""
                }
            `}
        >

            {/* Notification type icon */}
            <div
                className="
                    w-9
                    h-9
                    rounded-full
                    bg-primary-light
                    text-primary
                    flex
                    items-center
                    justify-center
                    shrink-0
                "
            >
                <NotificationTypeIcon
                    type={notification.type}
                    size={17}
                />
            </div>

            {/* Notification content */}
            <div className="flex-1 min-w-0">

                {/* Title row */}
                <div className="flex items-start justify-between gap-2">

                    <div className="flex items-start gap-2 min-w-0">

                        {/* Unread indicator */}
                        <div
                            className={`
                                w-2
                                h-2
                                mt-1.5
                                rounded-full
                                shrink-0
                                ${
                                    !notification.is_read
                                        ? "bg-primary"
                                        : "bg-transparent"
                                }
                            `}
                        />

                        <h4
                            className={`
                                text-sm
                                transition-colors
                                ${
                                    !notification.is_read
                                        ? "font-semibold text-text-darker"
                                        : "font-medium text-text-dark"
                                }
                                group-hover:text-primary
                            `}
                        >
                            {notification.title}
                        </h4>

                    </div>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();

                            handleDeleteNotification(
                                notification.id
                            );
                        }}
                        className="
                            opacity-0
                            group-hover:opacity-100
                            transition-opacity
                            text-text-light
                            hover:text-red-500
                            shrink-0
                        "
                    >
                        <Trash2Icon size={15} />
                    </button>

                </div>

                {/* Message */}
                <p
                    className="
                        text-xs
                        text-text-medium
                        mt-1
                        line-clamp-2
                        group-hover:text-text-dark
                    "
                >
                    {notification.message}
                </p>

                {/* Time */}
                <span
                    className="
                        text-[10px]
                        text-text-lighter
                        mt-2
                        block
                    "
                >
                    {formatDistanceToNow(
                        new Date(notification.created_at),
                        {
                            addSuffix: true,
                        }
                    )}
                </span>

            </div>

        </button>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="border-t border-border-light px-4 py-3">
            <button
                onClick={handleClearNotifications}
                className="
                    w-full
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    px-3
                    py-2
                    text-sm
                    font-medium
                    text-text-medium
                    transition-all
                    duration-200
                    hover:bg-red-50
                    hover:text-red-600
                "
            >
                <Trash2Icon size={15} />
                <span>Clear all notifications</span>
            </button>
        </div>
    )}
    </div>);

};
