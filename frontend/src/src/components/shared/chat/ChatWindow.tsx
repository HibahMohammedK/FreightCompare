import React, { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { chatSocket } from "../../../websocket/chatSocket";
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { MessageSquareIcon } from 'lucide-react';
import {
    fetchConversation,
    markConversationRead,
    sendChatMessage,
} from "../../../redux/chatSlice";

interface ChatWindowProps {
    conversationId: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
    conversationId,
}) => {

  const dispatch = useAppDispatch();
  const { selectedConversation } =
    useAppSelector((state) => state.chat);
  
  const currentUser = useAppSelector((state) => state.auth.user);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversation = selectedConversation;
  const messages = conversation?.messages ?? [];
  const loading = useAppSelector(
      (state) => state.chat.loading.detail
  );
  const otherParticipant = currentUser?.role === "customer"
    ? {
        name: conversation?.staff_name ?? "Support",
        role: "staff",
        image: conversation?.staff_profile_image,
    }
    : {
        name: conversation?.customer_name ?? "Customer",
        role: "customer",
        image: conversation?.customer_profile_image,
    };

  useEffect(() => {
      dispatch(fetchConversation(conversationId));
  }, [dispatch, conversationId]);

  useEffect(() => {
      if (!selectedConversation) return;

      if (selectedConversation.id !== conversationId) return;

      chatSocket.connect(conversationId);

      return () => chatSocket.disconnect();

  }, [conversationId, selectedConversation?.id]);

  useEffect(() => {
    if (!conversation || !currentUser) return;

      const hasUnread = conversation.messages.some(
          message =>
              !message.is_read &&
              message.sender !== currentUser.id
      );

      if (hasUnread) {
          dispatch(markConversationRead(conversation.id));
      }

  }, [
      dispatch,
      conversation?.messages,
      conversation?.id,
      currentUser?.id,
  ]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages]);

  const handleSendMessage = async (
      message: string,
      attachment?: File | null,
  ) => {

      if (!conversation) return;

      try {

          await dispatch(
              sendChatMessage({
                  conversation: conversation.id,
                  message,
                  attachment,
              }),
          ).unwrap();

      } catch {

          // show toast later
      }

  };


  if (loading) {
      return (
          <div className="flex-1 flex items-center justify-center">
              Loading conversation...
          </div>
      );
  }
  if (!conversation){
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-bg-light p-8 text-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-text-lighter mb-4 shadow-sm">
          <MessageSquareIcon size={32} />
        </div>
        <h3 className="text-lg font-semibold text-text-dark mb-2">
          Your Messages
        </h3>
        <p className="text-sm text-text-light max-w-sm">
          This ticket doesn't have an active conversation yet.
        </p>
      </div>);

  }
  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-bg-light">
      {/* Header */}
      <div className="h-16 bg-white border-b border-border-light px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-lighter flex items-center justify-center text-primary-darker font-semibold text-sm">
              {otherParticipant?.image ? (

                  <img
                      src={otherParticipant.image}
                      alt={otherParticipant.name}
                      className="w-full h-full object-cover"
                  />

              ) : (

                  <span className="font-semibold">
                      {otherParticipant?.name.charAt(0).toUpperCase()}
                  </span>

              )}
            </div>
            {conversation?.status === 'active' &&
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white" />
            }
          </div>
          <div>
            <h3 className="font-semibold text-text-dark text-sm">
              {otherParticipant?.name || 'Unknown'}
            </h3>
            <p className="text-xs text-text-light capitalize">
              {otherParticipant?.role || 'User'}
            </p>
          </div>
        </div>
        {conversation?.status === 'closed' &&
        <span className="px-3 py-1 bg-bg-light text-text-medium text-xs font-medium rounded-full">
            Closed
          </span>
        }
      </div>

      {/* Messages Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-6">
        {messages.map((msg) =>
        <MessageBubble
          key={msg.id}
          message={msg}
          isOwnMessage={msg.sender === currentUser?.id} />

        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {currentUser?.role === "admin" ? (

        <div className="border-t border-border-light bg-white px-6 py-4 text-center text-sm text-text-light">
            Admin monitoring mode. Messages are read-only.
        </div>

    ) : (

        <ChatInput
            onSendMessage={handleSendMessage}
            disabled={conversation?.status === "closed"}
        />

    )}
      
    </div>);

};