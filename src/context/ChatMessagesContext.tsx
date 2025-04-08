import { createContext, ReactNode, useState } from "react";
import { MessageType, RepliedToMessageType } from "../types/type";
import api from "../api/globalApi";



export interface ChatMessagesContextType {
  allMessages: MessageType[];
  fetchAllMessages: (userId: number, contactId: string) => Promise<number>;
  updateAllMessages: (recievedMessage: MessageType) => void;
  updateMessageReactions: (msgId: number, emojiReaction: string) => void;
  deletedMessages: (msgId: number) => void;
  updateReplyMessages: (action: string, message?: string, chatID?: number, msgId?: number) => void;
  replyMessage: RepliedToMessageType | undefined;
}

interface Props {
  children: ReactNode
}
export const ChatMessagesContext = createContext<ChatMessagesContextType | undefined>(undefined);

export const ChatMessagesContextProvider = ({ children }: Props) => {

  const [allMessages, setAllMessages] = useState<MessageType[]>([]);
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
        setAllMessages(data.messages);
        console.log(data.chatId)
        return data.chatId;
      }
      else
        console.log("Empty")


    } catch (error) {
      console.log(error);
    }
  }

  const updateAllMessages = async (recievedMessage: MessageType) => {
    console.log(recievedMessage)
    setAllMessages(prev => {
      const existingMsg = prev.some(msg => msg.msgId === recievedMessage.msgId);
      if (existingMsg)
        return prev;
      return [...prev, recievedMessage];
    })
  };

  const updateMessageReactions = (msgId: number, emojiReaction: string) => {
    setAllMessages(prevMessages =>
      prevMessages.map(msg => msg.msgId == msgId ? { ...msg, emojiReaction: emojiReaction } : msg)
    );
  }

  const deletedMessages = (msgId: number) => {
    setAllMessages(prevMessages => prevMessages.filter(msg => msg.msgId !== msgId));
  }

  const updateReplyMessages = async (action: string, message?: string, chatID?: number, msgId?: number) => {
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
      value={{ allMessages, fetchAllMessages, updateAllMessages, updateMessageReactions, deletedMessages, updateReplyMessages, replyMessage }}
    >
      {children}
    </ChatMessagesContext.Provider>
  );
};

