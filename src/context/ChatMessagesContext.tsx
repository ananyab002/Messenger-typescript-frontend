import { createContext, ReactNode, useContext, useState } from "react";
import { MessageType, RepliedToMessageType } from "../types/type";
import api from "../api/globalApi";



export interface ChatMessagesContextType {
  allMessages: { [key: string]: MessageType[] };
  fetchAllMessages: (userId: number, contactId: string) => Promise<string | undefined>;
  updateAllMessages: (chatID: string, recievedMessage: MessageType) => void;
  updateReplyMessages: (action: string, message?: string, chatID?: string, msgId?: number) => void;
  replyMessage: RepliedToMessageType | undefined;
}

interface Props {
  children: ReactNode
}
export const ChatMessagesContext = createContext<ChatMessagesContextType | undefined>(undefined);

export const ChatMessagesContextProvider = ({ children }: Props) => {

  const [allMessages, setAllMessages] = useState<{ [key: string]: MessageType[] }>({});
  const [replyMessage, setReplyMessage] = useState<RepliedToMessageType | undefined>();

  const fetchAllMessages = async (userId: number, contactId: string) => {
    try {

      const token = localStorage.getItem("authToken");
      if (!token)
        return;
      console.log(token)
      const response = await api.post(`chat/createOrgetmessages?userId=${userId}&contactId=${contactId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data) {
        const data = response.data;
        console.log(data)
        setAllMessages(data);
        const chatId = Object.keys(data)[0] || "";
        console.log(chatId)
        return chatId;
      }
      else
        console.log("Empty")


    } catch (error) {
      console.log(error);
    }
  }

  const updateAllMessages = async (chatID: string, recievedMessage: MessageType) => {
    console.log(recievedMessage)
    setAllMessages(prev => ({ ...prev, [chatID]: [...prev[chatID], recievedMessage] }))
  };

  const updateReplyMessages = async (action: string, message?: string, chatID?: string, msgId?: number) => {
    if (action === "open" && message && chatID && msgId) {
      setReplyMessage({ message, chatID, msgId });
      console.log("Open reply", replyMessage);
    }
    else if (action === "cancel") {
      setReplyMessage(undefined);
      console.log("cancel", replyMessage);
    }
  }

  return (
    <ChatMessagesContext.Provider
      value={{ allMessages, fetchAllMessages, updateAllMessages, updateReplyMessages, replyMessage }}
    >
      {children}
    </ChatMessagesContext.Provider>
  );
};

export function useChat() {
  const context = useContext(ChatMessagesContext);
  if (context == undefined)
    throw new Error("Undefined is not allowed");

  return context;
}