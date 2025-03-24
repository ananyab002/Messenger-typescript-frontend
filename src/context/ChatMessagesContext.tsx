import { createContext, ReactNode, useContext, useState } from "react";
import { Message, RepliedToMessageType } from "../types/type";
import api from "../api/globalApi";



export interface ChatMessagesContextType {
  allMessages: { [key: string]: Message[] };
  fetchAllMessages: (userId: number, contactId: string, chatId?: string) => Promise<string>;
  updateAllMessages: (message: Message, chatID: string) => void;
  updateReplyMessages: (action: string, message?: string, chatID?: string, msgId?: number) => void;
  replyMessage: RepliedToMessageType | undefined;
}

// const defaultContextValue: ChatMessagesContextType = {
//   allMessages: {},
//   fetchAllMessages: async ():Promise<string> => {return "" },
//   updateAllMessages: async () => { },
//   updateReplyMessages: async () => { },
//   replyMessage: undefined
// };
interface Props {
  children: ReactNode
}
export const ChatMessagesContext = createContext<ChatMessagesContextType | undefined>(undefined);

export const ChatMessagesContextProvider = ({ children }: Props) => {

  const [allMessages, setAllMessages] = useState<{ [key: string]: Message[] }>({});
  const [replyMessage, setReplyMessage] = useState<RepliedToMessageType | undefined>();

  const fetchInitialMessages = async (chatID: string) => {
    console.log("fetchInitialMessages");
    try {
      const response = await fetch(
        "https://ananyab002.github.io/Messenger-typescript-frontend/data/initialMessages.json"
      );
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();
      const chatIdData = { [chatID]: [...data[chatID]] };
      console.log("Initial Data", chatIdData)
      return chatIdData;
    }
    catch (error) {
      console.log(error)
    }
  };

  const fetchActualMessages = async (userId: number, contactId: string) => {
    try {

      const token = localStorage.getItem("authToken");
      if (!token)
        return;
      console.log(token)
      const response = await api.post(`chat/createOrgetmessages?userId=${userId}&contactId=${contactId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data) {
        const data = response.data;
        console.log(data)
        return data;
      }
      else
        console.log("Empty")


    } catch (error) {
      console.log(error);
    }
  }

  const fetchAllMessages = async (userId: number, contactId: string, chatId?: string) => {
    let dummyMessages;
    let actualMessages;
    console.log(chatId)
    if (chatId) {
      dummyMessages = await fetchInitialMessages(chatId);
      if (dummyMessages)
        setAllMessages({ ...dummyMessages });
    }
    else {
      actualMessages = await fetchActualMessages(userId, contactId);
      if (actualMessages)
        setAllMessages({ ...actualMessages });
      if (dummyMessages && actualMessages)
        setAllMessages({ dummyMessages, ...actualMessages })
    }
    const actualChatId = chatId ? chatId : Object.keys(actualMessages)[0] || "";
    console.log(actualChatId)
    return actualChatId;
  }


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