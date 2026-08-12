import React, { useRef, useState } from "react";
import {
    SendIcon,
    PaperclipIcon,
} from "lucide-react";

interface ChatInputProps {
    onSendMessage: (
        message: string,
        attachment?: File | null,
    ) => void;

    disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    onSendMessage,
    disabled = false,
}) => {
    const [message, setMessage] = useState("");
    const [selectedFile, setSelectedFile] =
        useState<File | null>(null);

    const fileInputRef =
        useRef<HTMLInputElement>(null);

    const handleSubmit = (
        e: React.FormEvent,
    ) => {
        e.preventDefault();

        if (
            disabled ||
            (!message.trim() && !selectedFile)
        ) {
            return;
        }

        onSendMessage(
            message.trim(),
            selectedFile,
        );

        setMessage("");
        setSelectedFile(null);
    };

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        setSelectedFile(file);

        // Allow selecting the same file again later
        e.target.value = "";
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white border-t border-border-light"
        >
            {/* Selected file */}
            {selectedFile && (
                <div className="flex items-center gap-2 px-4 py-2 bg-bg-light border-b border-border-light">
                    <PaperclipIcon size={16} />

                    <span className="text-sm truncate flex-1">
                        {selectedFile.name}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            setSelectedFile(null)
                        }
                        className="text-text-lighter hover:text-text-dark"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Input row */}
            <div className="flex items-center gap-2 p-4">
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() =>
                        fileInputRef.current?.click()
                    }
                    className="p-2 text-text-lighter hover:text-text-medium transition-colors rounded-full hover:bg-bg-light disabled:opacity-50"
                >
                    <PaperclipIcon size={20} />
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                />

                <input
                    type="text"
                    value={message}
                    onChange={(e) =>
                        setMessage(e.target.value)
                    }
                    disabled={disabled}
                    placeholder="Type your message..."
                    className="flex-1 bg-bg-light border-none focus:ring-0 text-sm px-4 py-2.5 rounded-full text-text-dark placeholder:text-text-lighter disabled:opacity-50"
                />

                <button
                    type="submit"
                    disabled={
                        (!message.trim() &&
                            !selectedFile) ||
                        disabled
                    }
                    className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-50 disabled:bg-border-dark transition-colors"
                >
                    <SendIcon
                        size={18}
                        className="ml-1"
                    />
                </button>
            </div>
        </form>
    );
};