import React from "react";
import { format } from "date-fns";

import type { Message } from "../../../types/chat";

interface MessageBubbleProps {
    message: Message;
    isOwnMessage: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
    message,
    isOwnMessage,
}) => {

    return (
        <div
            className={`flex flex-col w-full mb-4 ${
                isOwnMessage
                    ? "items-end"
                    : "items-start"
            }`}
        >
            <div
                className={`max-w-[70%] px-3 py-1 rounded-xl text-[14px] ${
                    isOwnMessage
                        ? "bg-primary text-white rounded-br-sm"
                        : "bg-white border border-border-light text-text-dark rounded-bl-sm"
                }`}
            >
                <p className="break-words leading-5">
                    {message.message}
                </p>

                <div
                    className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                        isOwnMessage
                            ? "text-primary-lighter"
                            : "text-text-lighter"
                    }`}
                >
                    <span>
                        {format(
                            new Date(message.created_at),
                            "h:mm a"
                        )}
                    </span>

                    {isOwnMessage && (
                        <span>
                            {message.is_read ? "✓✓" : "✓"}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );

};