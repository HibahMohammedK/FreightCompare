import React from "react";
import { formatDistanceToNow } from "date-fns";

import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import {
    fetchConversation,
    markConversationRead,
} from "../../../redux/chatSlice";

export const ChatSidebar: React.FC = () => {

    const dispatch = useAppDispatch();

    const {
        conversations,
        selectedConversation,
    } = useAppSelector(
        (state) => state.chat,
    );

    const currentUser = useAppSelector(
        (state) => state.auth.user,
    );

    const handleConversationClick = (
        conversationId: string,
    ) => {

        dispatch(
            fetchConversation(
                conversationId,
            ),
        );

        dispatch(
            markConversationRead(
                conversationId,
            ),
        );

    };

    return (
        <div className="w-80 border-r border-border-light bg-white flex flex-col h-full shrink-0">

            <div className="p-4 border-b border-border-light">
                <h2 className="font-bold text-text-dark">
                    Conversations
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto">

                {conversations.map((conversation) => {

                    const isActive =
                        conversation.id ===
                        selectedConversation?.id;

                    const otherParticipant =
                        currentUser?.role === "customer"
                            ? {
                                  name:
                                      conversation.staff_name ??
                                      "Support",
                              }
                            : {
                                  name:
                                      conversation.customer_name,
                              };

                    return (
                        <div
                            key={conversation.id}
                            onClick={() =>
                                handleConversationClick(
                                    conversation.id,
                                )
                            }
                            className={`p-4 border-b border-border-light cursor-pointer transition-colors flex gap-3 ${
                                isActive
                                    ? "bg-primary-light/30"
                                    : "hover:bg-bg-light"
                            }`}
                        >
                            <div className="relative shrink-0">

                                <div className="w-10 h-10 rounded-full bg-primary-lighter flex items-center justify-center text-primary-darker font-semibold text-sm">
                                    {otherParticipant.name
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                {conversation.status ===
                                    "active" && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white" />
                                )}

                            </div>

                            <div className="flex-1 min-w-0">

                                <div className="flex justify-between items-baseline mb-1">

                                    <h4 className="text-sm font-semibold text-text-dark truncate">
                                        {
                                            otherParticipant.name
                                        }
                                    </h4>

                                    {conversation.last_message_at && (
                                        <span className="text-[10px] text-text-lighter shrink-0 ml-2">
                                            {formatDistanceToNow(
                                                new Date(
                                                    conversation.last_message_at,
                                                ),
                                                {
                                                    addSuffix: true,
                                                },
                                            )}
                                        </span>
                                    )}

                                </div>

                                <div className="flex justify-between items-center gap-2">

                                    <p
                                        className={`text-xs truncate ${
                                            conversation.unread_count >
                                            0
                                                ? "font-semibold text-text-dark"
                                                : "text-text-medium"
                                        }`}
                                    >
                                        {conversation.last_message ??
                                            "No messages yet"}
                                    </p>

                                    {conversation.unread_count >
                                        0 && (
                                        <span className="w-4 h-4 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full shrink-0">
                                            {
                                                conversation.unread_count
                                            }
                                        </span>
                                    )}

                                </div>

                            </div>

                        </div>
                    );

                })}

            </div>

        </div>
    );

};