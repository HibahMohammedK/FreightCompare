import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserNavbar } from '../../components/shared/UserNavbar';
import { Button } from '../../components/shared/Button';
import { Card } from '../../components/shared/Card';
import { ChatWindow } from '../../components/shared/chat/ChatWindow';
import { MessageSquareIcon, ShieldIcon } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import {
  createConversation,
  setActiveConversation } from
'../../redux/chatSlice';
export const UserChatPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { conversations, activeConversationId } = useAppSelector(
    (state) => state.chat
  );
  // Find the conversation that includes the current user
  const userConversation = conversations.find((c) =>
  c.participants.some((p) => p.id === user?.id)
  );
  // When a conversation exists but no active conversation is set, activate it
  useEffect(() => {
    if (userConversation && !activeConversationId) {
      dispatch(setActiveConversation(userConversation.id));
    }
  }, [userConversation, activeConversationId, dispatch]);
  const handleStartChat = () => {
    if (!user) return;
    const newConvId = `c${Date.now()}`;
    dispatch(
      createConversation({
        id: newConvId,
        participants: [
        {
          id: user.id,
          name: user.name,
          role: user.role
        },
        {
          id: 's1',
          name: 'Support Agent',
          role: 'staff'
        } // mock staff participant
        ],
        lastMessage: 'Chat started',
        lastMessageAt: new Date().toISOString(),
        unreadCount: 0,
        status: 'active'
      })
    );
    dispatch(setActiveConversation(newConvId));
  };
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
            {userConversation ?
            <ChatWindow /> :

            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 bg-bg-light rounded-full flex items-center justify-center text-text-lighter mb-4">
                  <MessageSquareIcon size={32} />
                </div>
                <h3 className="text-lg font-semibold text-text-dark mb-2">
                  Need Help?
                </h3>
                <p className="text-sm text-text-light max-w-sm mb-6">
                  Start a live chat with one of our support agents to get
                  immediate help with your shipments or account.
                </p>
                <Button onClick={handleStartChat}>Start Conversation</Button>
              </div>
            }
          </div>
        </div>
      </div>
    </>);

};