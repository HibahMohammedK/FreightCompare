import React from "react";
import { format } from "date-fns";
import { FileTextIcon, DownloadIcon } from "lucide-react";

import type { Message } from "../../../types/chat";

interface MessageBubbleProps {
    message: Message;
    isOwnMessage: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
    message,
    isOwnMessage,
}) => {
    const isImage = message.attachment
        ? /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(
              message.attachment
          )
        : false;

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
                {/* Text message */}
                {message.message && (
                    <p className="break-words leading-5 mb-2">
                        {message.message}
                    </p>
                )}

                {/* Image attachment */}
                {message.attachment && isImage && (
                    <a
                        href={message.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                    >
                        <img
                            src={message.attachment}
                            alt="Chat attachment"
                            className="w-auto max-w-[220px] max-h-[160px] rounded-lg object-contain cursor-pointer"
                        />
                    </a>
                )}

                {/* Non-image attachment */}
                {message.attachment && !isImage && (
                    <a
                        href={message.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                            isOwnMessage
                                ? "bg-white/10"
                                : "bg-bg-light"
                        }`}
                    >
                        <FileTextIcon size={24} />

                        <span className="text-sm truncate flex-1">
                            Open attachment
                        </span>

                        <DownloadIcon size={18} />
                    </a>
                )}

                {/* Time + read status */}
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
                            {message.is_read
                                ? "✓✓"
                                : "✓"}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};