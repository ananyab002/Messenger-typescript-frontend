import { useEffect, useRef, useCallback } from "react";
import { Client, Message } from "@stomp/stompjs";
import { MessageType } from "../types/type";
import SockJS from "sockjs-client";
import { useLogin } from "./useLogin";
import { useContact } from "./useContacts";
import { getCommonHeaders } from "../api/headers";
import { useChat } from "./useChat";

export const useWebSocket = (chatId: number) => {
  const SOCKET_URL = "http://localhost:8080/message";
  const token = localStorage.getItem("authToken");
  const { updateAllMessages, updateMessageReactions, deletedMessages } = useChat();
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
            updateAllMessages(receivedMessage);
          });

          client.subscribe(`/topic/chats/${chatId}/emojiReactions`, (reaction: Message) => {
            const messageReaction: MessageType = JSON.parse(reaction.body);
            console.log(messageReaction);
            updateMessageReactions(messageReaction.msgId, messageReaction.emojiReaction);
          })

          client.subscribe(`/topic/chats/${chatId}/deletion`, (message: Message) => {
            const deletedMessage: MessageType = JSON.parse(message.body);
            console.log(deletedMessage);
            deletedMessages(deletedMessage.msgId);
          })
        }

      },
      onDisconnect: () => console.log("Disconnected from WebSocket"),
      reconnectDelay: 5000,
    });

    clientRef.current = client;
    client.activate();

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate(); // Cleanup function (correct return type)
        clientRef.current = null;
      }
    };
  }, [chatId, token, updateAllMessages, updateContactList, deletedMessages, updateMessageReactions, currentUser?.userId]);

  const publishMessage = useCallback((destination: string, body: any = {}, headers: any = {}) => {
    if (!token || !chatId || !clientRef.current) return;

    const allHeaders = { ...getCommonHeaders(), ...headers }

    clientRef.current.publish({
      destination,
      body: JSON.stringify(body),
      headers: allHeaders,
    });
  }, [chatId, token]);

  const sendMessage = useCallback((content: string, senderId: number, receiverId: string) => {
    if (!senderId) return;
    publishMessage("/app/send", { chatId, content, senderId, receiverId });
  }, [chatId, publishMessage]);

  const sendMessageEmojiReaction = useCallback((messageId: number, emoji: string) => {
    publishMessage(`/app/reaction/${messageId}/${emoji}`, {})
  }, [publishMessage]);

  const sendDeleteMessage = useCallback((messageId: number) => {
    publishMessage(`/app/delete/${messageId}`, {});
  }, [publishMessage]);

  return { sendMessage, sendMessageEmojiReaction, sendDeleteMessage };
};

export default useWebSocket;
