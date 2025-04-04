import { useEffect, useRef, useCallback } from "react";
import { Client, Message } from "@stomp/stompjs";
import { useChat } from "../context/ChatMessagesContext";
import { MessageType } from "../types/type";
import SockJS from "sockjs-client";
import { useLogin } from "./useLogin";
import { useContact } from "./useContacts";

const SOCKET_URL = "http://localhost:8080/message"; // Direct WebSocket URL

export const useWebSocket = (chatId: string) => {
  const token = localStorage.getItem("authToken");
  const { updateAllMessages } = useChat();
  const clientRef = useRef<Client | null>(null);
  const { currentUser } = useLogin();
  const { updateContactList } = useContact();

  useEffect(() => {
    const userId = currentUser?.userId;
    console.log("useEffect", chatId)
    if (!token)
      return;
    if (!userId)
      return;
    console.log(token)
    const client = new Client({
      webSocketFactory: () => {
        return new SockJS(`${SOCKET_URL}?token=${token}`);
      },
      onConnect: () => {

        console.log("Connected to WebSocket");

        if (chatId) {
          client.subscribe(`/topic/chats/${chatId}`, (message: Message) => {
            const receivedMessage: MessageType = JSON.parse(message.body);
            console.log("Received", receivedMessage)
            updateAllMessages(chatId, receivedMessage);
          });
        }

      },
      onDisconnect: () => console.log("Disconnected from WebSocket"),
      reconnectDelay: 5000,
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate(); // Cleanup function (correct return type)
        clientRef.current = null;
      }
    };
  }, [chatId, token, updateAllMessages, updateContactList]);

  const sendMessage = useCallback((content: string, senderId: number, receiverId: string) => {
    if (!token)
      return;
    if (!chatId)
      return;
    if (!senderId)
      return
    console.log(content, chatId, senderId)
    clientRef.current?.publish({
      destination: "/app/send",
      body: JSON.stringify({ chatId, content, senderId, receiverId }),
      headers: { Authorization: `Bearer ${token}` },
    });

  }, [chatId, token]);

  return { sendMessage };
};

export default useWebSocket;
