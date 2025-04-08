import { createContext, PropsWithChildren, useState } from "react";

type ChatIdContextType = {
    updateChatId: (actualChatId: number) => void;
    chatId: number | undefined;
}
export const ChatIdContext = createContext<ChatIdContextType | undefined>(undefined);

export const ChatIdContextProvider = ({ children }: PropsWithChildren) => {

    const [chatId, setChatId] = useState<number>();

    const updateChatId = (actualChatId: number) => {
        setChatId(actualChatId);
    }

    return (
        <ChatIdContext.Provider value={{ chatId, updateChatId }}>{children}</ChatIdContext.Provider>
    )
}