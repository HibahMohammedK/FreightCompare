import React, { useState } from 'react';
import { Card } from '../../components/shared/Card';
import { Input } from '../../components/shared/Input';
import { SearchIcon, MessageSquareIcon } from 'lucide-react';
import { useAppSelector } from '../../hooks/redux';
import { formatDistanceToNow, format } from 'date-fns';
import { MessageBubble } from '../../components/shared/chat/MessageBubble';
export const ChatMonitoringPage: React.FC = () => {
  const conversations = useAppSelector((state) => state.chat.conversations);
  const messages = useAppSelector((state) => state.chat.messages);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const filteredConversations = conversations.filter((c) => {
    const matchesSearch = c.participants.some((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
    );
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const selectedChat = conversations.find((c) => c.id === selectedChatId);
  const chatMessages = selectedChatId ? messages[selectedChatId] || [] : [];
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="p-8 border-b border-border-light shrink-0 bg-bg-light">
        <h1 className="text-2xl font-bold text-text-dark mb-2">
          Chat Monitoring
        </h1>
        <p className="text-sm text-text-light mb-6">
          Monitor active conversations between users and staff in real-time.
        </p>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by participant name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<SearchIcon size={18} />} />
            
          </div>
          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-border-light bg-white px-4 py-2.5 text-sm text-text-darker focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
              
              <option value="all">All Chats</option>
              <option value="active">Active Only</option>
              <option value="closed">Closed Only</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Chat List */}
        <div className="w-1/3 min-w-[320px] border-r border-border-light bg-white overflow-y-auto p-4 space-y-3">
          {filteredConversations.map((conv) =>
          <Card
            key={conv.id}
            className={`p-4 cursor-pointer transition-colors ${selectedChatId === conv.id ? 'border-primary bg-primary-light/10 shadow-sm' : 'hover:border-primary/50'}`}
            onClick={() => setSelectedChatId(conv.id)}>
            
              <div className="flex justify-between items-start mb-3">
                <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${conv.status === 'active' ? 'bg-success-bg text-success-dark border-green-200' : 'bg-bg-light text-text-medium border-border-light'}`}>
                
                  {conv.status}
                </span>
                <span className="text-[10px] text-text-lighter">
                  {formatDistanceToNow(new Date(conv.lastMessageAt), {
                  addSuffix: true
                })}
                </span>
              </div>

              <div className="space-y-1 mb-3">
                {conv.participants.map((p) =>
              <div key={p.id} className="flex items-center gap-2 text-sm">
                    <span
                  className={`w-1.5 h-1.5 rounded-full ${p.role === 'staff' ? 'bg-primary' : 'bg-text-lighter'}`} />
                
                    <span className="font-medium text-text-dark truncate">
                      {p.name}
                    </span>
                    <span className="text-[10px] text-text-lighter capitalize">
                      ({p.role})
                    </span>
                  </div>
              )}
              </div>

              <div className="text-xs text-text-medium truncate bg-bg-light p-2 rounded-lg border border-border-light">
                {conv.lastMessage}
              </div>
            </Card>
          )}
          {filteredConversations.length === 0 &&
          <div className="text-center p-8 text-text-light">
              No conversations found.
            </div>
          }
        </div>

        {/* Read-Only Chat View */}
        <div className="flex-1 flex flex-col bg-bg-light">
          {selectedChat ?
          <>
              <div className="h-16 bg-white border-b border-border-light px-6 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="font-bold text-text-dark">
                    Conversation Details
                  </h3>
                  <p className="text-xs text-text-light">
                    {selectedChat.participants.map((p) => p.name).join(' & ')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-warning-bg text-warning text-xs font-bold rounded-full border border-yellow-200 uppercase tracking-wide">
                    Read Only Mode
                  </span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages.length > 0 ?
              chatMessages.map((msg) =>
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwnMessage={msg.senderRole === 'staff'} />

              ) :

              <div className="text-center text-text-light p-8">
                    No messages in this conversation yet.
                  </div>
              }
              </div>
            </> :

          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-text-lighter mb-4 shadow-sm">
                <MessageSquareIcon size={32} />
              </div>
              <h3 className="text-lg font-semibold text-text-dark mb-2">
                Select a Conversation
              </h3>
              <p className="text-sm text-text-light max-w-sm">
                Choose a conversation from the list to view the message history
                in read-only mode.
              </p>
            </div>
          }
        </div>
      </div>
    </div>);

};