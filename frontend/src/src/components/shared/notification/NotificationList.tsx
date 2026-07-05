import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { markAsRead, markAllAsRead } from '../../../redux/notificationSlice';
import { BellIcon, CheckIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
interface NotificationListProps {
  maxItems?: number;
  onItemClick?: () => void;
}
export const NotificationList: React.FC<NotificationListProps> = ({
  maxItems,
  onItemClick
}) => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(
    (state) => state.notification.notifications
  );
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
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-light">
        <span className="text-sm font-semibold text-text-dark">
          Notifications
        </span>
        <button
          onClick={() => dispatch(markAllAsRead())}
          className="text-xs font-medium text-primary hover:text-primary-dark flex items-center gap-1">
          
          <CheckIcon size={14} /> Mark all read
        </button>
      </div>
      <div className="overflow-y-auto max-h-[400px]">
        {displayNotifications.map((notification) =>
        <button
          type="button"
          key={notification.id}
          onClick={() => {
            if (!notification.is_read) {
              dispatch(markAsRead(notification.id));
            }
            if (onItemClick) onItemClick();
          }}
          className={`group w-full p-4 border-b border-border-light text-left transition-colors hover:bg-bg-light flex gap-3 ${!notification.is_read ? 'bg-blue-50' : ''}`}>
          
            <div className="mt-0.5 shrink-0">
              <div
              className={`w-2 h-2 rounded-full ${!notification.is_read ? 'bg-primary' : 'bg-transparent'}`} />
            
            </div>
            <div className="flex-1 min-w-0">
              <h4
              className={`text-sm transition-colors ${!notification.is_read ? 'font-semibold text-text-darker' : 'font-medium text-text-dark'} group-hover:text-primary`}>
              
                {notification.title}
              </h4>
              <p className="text-xs text-text-medium mt-1 line-clamp-2 group-hover:text-text-dark">
                {notification.message}
              </p>
              <span className="text-[10px] text-text-lighter mt-2 block">
                {formatDistanceToNow(new Date(notification.created_at), {
                addSuffix: true
              })}
              </span>
            </div>
          </button>
        )}
      </div>
    </div>);

};
