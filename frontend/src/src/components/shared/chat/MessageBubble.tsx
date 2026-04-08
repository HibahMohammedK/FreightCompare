import React from 'react';
import { ChatMessage } from '../../../utils/mockData';
import { format } from 'date-fns';
interface MessageBubbleProps {
  message: ChatMessage;
  isOwnMessage: boolean;
}
export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage
}) => {
  return (
    <div
      className={`flex flex-col w-full mb-4 ${isOwnMessage ? 'items-end' : 'items-start'}`}>
      
      <div className="flex items-end gap-2 max-w-[80%]">
        {!isOwnMessage &&
        <div className="w-8 h-8 rounded-full bg-primary-lighter flex items-center justify-center text-primary-darker font-semibold text-xs shrink-0">
            {message.senderName.charAt(0).toUpperCase()}
          </div>
        }
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm ${isOwnMessage ? 'bg-primary text-white rounded-br-sm' : 'bg-white border border-border-light text-text-dark rounded-bl-sm'}`}>
          
          {message.content}
        </div>
      </div>
      <span className="text-[10px] text-text-lighter mt-1 px-10">
        {format(new Date(message.createdAt), 'h:mm a')}
      </span>
    </div>);

};