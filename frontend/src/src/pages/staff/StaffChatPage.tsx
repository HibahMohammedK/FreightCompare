import React from 'react';
import { ChatSidebar } from '../../components/shared/chat/ChatSidebar';
import { ChatWindow } from '../../components/shared/chat/ChatWindow';
export const StaffChatPage: React.FC = () => {
  return (
    <div className="flex-1 flex h-full overflow-hidden">
      <ChatSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <ChatWindow />
      </div>
    </div>);

};