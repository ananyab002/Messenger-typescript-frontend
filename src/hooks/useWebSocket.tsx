import { useEffect, useCallback } from "react";
import { useLogin } from "./useLogin";
import { useChat } from "./useChat";
import { useChatId } from "./useChatId";
import { sendMessage, subscribe } from "../api/connectWebSocket";

export const useWebSocket = () => {
  const { updateAllMessages, updateMessageReactions, deletedMessages } = useChat();
  const { currentUser } = useLogin();
  const { chatId } = useChatId();

  useEffect(() => {
    if (!chatId || !currentUser?.userId) return;

    // Subscribe to chat messages
    const unsubMessages = subscribe(
      `/topic/chats/${chatId}`,
      (message) => updateAllMessages(message)
    );

    // Subscribe to emoji reactions
    const unsubReactions = subscribe(
      `/topic/chats/${chatId}/emojiReactions`,
      (message) => {
        if (message.msgId && message.emojiReaction) {
          updateMessageReactions(message.msgId, message.emojiReaction);
        }
      }
    );

    // Subscribe to message deletions
    const unsubDeletions = subscribe(
      `/topic/chats/${chatId}/deletion`,
      (message) => {
        if (message.msgId) {
          deletedMessages(message.msgId);
        }
      }
    );

    // Clean up subscriptions on unmount
    return () => {
      unsubMessages();
      unsubReactions();
      unsubDeletions();
    };
  }, [chatId, currentUser?.userId, updateAllMessages, updateMessageReactions, deletedMessages]);

  const send = useCallback((content: string, senderId: number, receiverId: string, repliedToMsgId?: number) => {
    if (!senderId || !chatId) return;

    sendMessage("/app/send", {
      chatId,
      content,
      senderId,
      receiverId,
      repliedToMsgId
    });
  }, [chatId]);

  const sendEmojiReaction = useCallback((messageId: number, emoji: string) => {
    sendMessage(`/app/reaction/${messageId}/${emoji}`, {});
  }, []);

  const deleteMessage = useCallback((messageId: number) => {
    sendMessage(`/app/delete/${messageId}`, {});
  }, []);

  return {
    sendMessage: send,
    sendMessageEmojiReaction: sendEmojiReaction,
    sendDeleteMessage: deleteMessage
  };

};

export default useWebSocket;
