import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserNavbar } from '../../components/shared/UserNavbar';
import { Button } from '../../components/shared/Button';
import { Card } from '../../components/shared/Card';
import { ChatWindow } from '../../components/shared/chat/ChatWindow';
import { ChatSidebar } from '../../components/shared/chat/ChatSidebar';
import { MessageSquareIcon, ShieldIcon } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import {
    fetchConversation,
    fetchConversations,
    markConversationRead,
} from "../../redux/chatSlice";
export const CustomerChatPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const {
      conversations,
      selectedConversation,
  } = useAppSelector(
      (state) => state.chat
  );
  
  
  useEffect(() => {
      dispatch(
          fetchConversations()
      );
  }, [dispatch]);


  useEffect(() => {
      if (
          conversations.length > 0 &&
          !selectedConversation
      ) {

          dispatch(
              fetchConversation(
                  conversations[0].id
              )
          );

          dispatch(
              markConversationRead(
                  conversations[0].id
              )
          );

      }

  }, [
      conversations,
      selectedConversation,
      dispatch,
  ]);
  
  // If the user is not a premium member, show an upgrade prompt
  if (!user?.isPremium) {
    return (
      <div className="min-h-screen bg-bg-light flex flex-col">
        <UserNavbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="max-w-md w-full p-8 text-center">
            <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center text-primary mx-auto mb-6">
              <ShieldIcon size={32} />
            </div>
            <h2 className="text-2xl font-bold text-text-dark mb-3">
              Premium Feature
            </h2>
            <p className="text-text-medium mb-8">
              Direct live chat with our support agents is available exclusively
              for premium members. Upgrade your account for instant assistance.
            </p>
            <Button fullWidth onClick={() => navigate('/pricing')}>
              Upgrade to Premium
            </Button>
          </Card>
        </div>
      </div>);

  }
  // Main chat UI for premium users
  return (
    <>
      <div className="min-h-screen bg-bg-light flex flex-col">
        <UserNavbar />
        <div className="max-w-5xl mx-auto w-full px-6 py-8 flex-1 flex flex-col">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-text-dark">
              Live Support Chat
            </h1>
            <p className="text-sm text-text-light">
              Chat directly with our support team for immediate assistance.
            </p>
          </div>
          <div className="flex-1 bg-white rounded-2xl border border-border-light overflow-hidden flex shadow-sm min-h-[600px]">
            {selectedConversation ? (
                  <>
                      <ChatSidebar />
                      <ChatWindow />
                  </>
              ) : ( 

            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 bg-bg-light rounded-full flex items-center justify-center text-text-lighter mb-4">
                  <MessageSquareIcon size={32} />
                </div>
                <h3 className="text-lg font-semibold text-text-dark mb-2">
                    No Support Conversations
                </h3>

                <p className="text-sm text-text-light max-w-sm">
                    Support conversations are created automatically when
                    one of your support tickets is assigned to a support
                    agent.
                </p>
                <p className="text-text-light">
                    You don't have any support conversations yet.
                    A conversation will automatically appear
                    when one of your support tickets is assigned.
                </p>
              </div>
           )}
          </div>
        </div>
      </div>
    </>);

};