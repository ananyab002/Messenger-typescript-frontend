import { createContext, ReactNode, useState } from "react";
import { Message, RepliedToMessageType } from "../types/type";



export interface ChatMessagesContextType {
  allMessages: { [key: string]: Message[] };
  fetchInitialMessages: (chatID: string) => Promise<void>;
  updateAllMessages: (message: Message, chatID: string) => void;
  updateReplyMessages: (action: string, message?: string, chatID?: string, msgId?: number) => void;
  replyMessage: RepliedToMessageType | undefined;
}

const defaultContextValue: ChatMessagesContextType = {
  allMessages: {},
  fetchInitialMessages: async () => { },
  updateAllMessages: async () => { },
  updateReplyMessages: async () => { },
  replyMessage: undefined
};
interface Props {
  children: ReactNode
}
export const ChatMessagesContext = createContext<ChatMessagesContextType>(defaultContextValue);

export const ChatMessagesContextProvider = ({ children }: Props) => {
  const [allMessages, setAllMessages] = useState<{ [key: string]: Message[] }>({});
  const [replyMessage, setReplyMessage] = useState<RepliedToMessageType | undefined>();

  const fetchInitialMessages = async (chatID: string) => {
    console.log("fetchInitialMessages");
    try {
      const response = await fetch(
        "/data/initialMessages.json"
      );
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();
      const findChatIdData = data[chatID] || [];
      const chatIdData = { [chatID]: [...findChatIdData] };
      console.log("Initial Data", chatIdData)
      setAllMessages(chatIdData);
    } catch (error) {
      console.log(error);
    }
  };

  const updateAllMessages = async (message: Message, chatID: string) => {
    setAllMessages((prevData) => {
      const updatedMessages = [...prevData[chatID], message];
      return {
        ...prevData,
        [chatID]: updatedMessages,
      };
    });
    setReplyMessage(undefined);
    console.log(allMessages);
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
      value={{ allMessages, fetchInitialMessages, updateAllMessages, updateReplyMessages, replyMessage }}
    >
      {children}
    </ChatMessagesContext.Provider>
  );
};
