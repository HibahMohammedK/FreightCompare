import React, { useState } from 'react';
import { SendIcon, PaperclipIcon } from 'lucide-react';
interface ChatInputProps {
    onSendMessage: (message: string) => void;
    disabled?: boolean;
}
export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false
}) => {
  const [message, setMessage] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 p-4 bg-white border-t border-border-light">
      
      <button
        type="button"
        disabled={disabled}
        className="p-2 text-text-lighter hover:text-text-medium transition-colors rounded-full hover:bg-bg-light disabled:opacity-50">
        
        <PaperclipIcon size={20} />
      </button>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={disabled}
        placeholder="Type your message..."
        className="flex-1 bg-bg-light border-none focus:ring-0 text-sm px-4 py-2.5 rounded-full text-text-dark placeholder:text-text-lighter disabled:opacity-50" />
      
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-50 disabled:bg-border-dark transition-colors">
        
        <SendIcon size={18} className="ml-1" />
      </button>
    </form>);

};