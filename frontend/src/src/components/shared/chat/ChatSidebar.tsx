import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { setActiveConversation } from '../../../redux/chatSlice';
import { formatDistanceToNow } from 'date-fns';
export const ChatSidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { conversations, activeConversationId } = useAppSelector(
    (state) => state.chat
  );
  const currentUser = useAppSelector((state) => state.auth.user);
  return (
    <div className="w-80 border-r border-border-light bg-white flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-border-light">
        <h2 className="font-bold text-text-dark">Conversations</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => {
          const otherParticipant = conv.participants.find(
            (p) => p.id !== currentUser?.id
          );
          const isActive = conv.id === activeConversationId;
          return (
            <div
              key={conv.id}
              onClick={() => dispatch(setActiveConversation(conv.id))}
              className={`p-4 border-b border-border-light cursor-pointer transition-colors flex gap-3 ${isActive ? 'bg-primary-light/30' : 'hover:bg-bg-light'}`}>
              
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary-lighter flex items-center justify-center text-primary-darker font-semibold text-sm">
                  {otherParticipant?.name.charAt(0).toUpperCase() || '?'}
                </div>
                {conv.status === 'active' &&
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="text-sm font-semibold text-text-dark truncate">
                    {otherParticipant?.name || 'Unknown'}
                  </h4>
                  <span className="text-[10px] text-text-lighter shrink-0 ml-2">
                    {formatDistanceToNow(new Date(conv.lastMessageAt), {
                      addSuffix: true
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <p
                    className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-semibold text-text-dark' : 'text-text-medium'}`}>
                    
                    {conv.lastMessage}
                  </p>
                  {conv.unreadCount > 0 &&
                  <span className="w-4 h-4 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full shrink-0">
                      {conv.unreadCount}
                    </span>
                  }
                </div>
              </div>
            </div>);

        })}
      </div>
    </div>);

};