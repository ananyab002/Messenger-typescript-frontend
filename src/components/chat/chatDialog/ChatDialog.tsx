import React, { useEffect, useRef, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';

import "./chatDialog.scss";
import CancelIcon from '@mui/icons-material/Cancel';
import { useLogin } from "../../../hooks/useLogin";
import { EmojiReactions } from "./emojiReactions/EmojiReactions";
import { DateTimeDiv } from "./dateTimeDiv/DateTimeDiv";
import { useChat } from "../../../hooks/useChat";
import useWebSocket from "../../../hooks/useWebSocket";
import { useChatId } from "../../../hooks/useChatId";


/**
 * ChatDialog component renders the chat interface displaying messages.
 * It fetches messages from the ChatMessagesContext based on the chatID
 */
const ChatDialog = () => {

  const centerRef = useRef<HTMLDivElement | null>(null);
  const { allMessages } = useChat() ?? {};
  const [deleteMsgId, setDeleteMsgId] = useState<number>();
  const { replyMessage, updateReplyMessages } = useChat();
  const { currentUser } = useLogin();
  const { sendDeleteMessage, sendMessageEmojiReaction } = useWebSocket();
  const { chatId } = useChatId();


  /**
   * useEffect to bottom scroll.
   */

  useEffect(() => {
    const center = centerRef.current;
    if (center) {
      center.scrollTop = center.scrollHeight;
    }
  }, [allMessages]);

  const handleDeleteMsg = (msgId: number): React.MouseEventHandler<SVGSVGElement> => (event) => {
    console.log(event)
    sendDeleteMessage(msgId);

  }
  const handleReactions = (msgId: number, emoji: string) => {
    sendMessageEmojiReaction(msgId, emoji);
  }
  const handleReplyMessage = (repliedToMsgId: number, repliedToMsgContent: string): React.MouseEventHandler<HTMLDivElement> => () => {
    if (chatId)
      updateReplyMessages("open", repliedToMsgContent, chatId, repliedToMsgId);
  }

  const handleCancelReply = () => {
    updateReplyMessages("cancel");
  }

  return (
    <div className="center" ref={centerRef}>
      {allMessages &&
        allMessages.map((message, index) => (
          <div
            onClick={() => setDeleteMsgId(message.msgId)}
            key={index}
            className={message.senderId === currentUser?.userId ? "message user" : "message"}
          >
            {message.repliedToMsgId ? (
              <div className="text-container">
                <div className="replyChatDiv">
                  <p> {message.repliedToMsgContent}</p>
                  <div className="reply-texts" onDoubleClick={handleReplyMessage(message.msgId, message.content)}>
                    <p>{message.content}</p>
                    <DateTimeDiv message={message} />
                  </div>
                </div>

              </div>) :

              (<div className="texts" onDoubleClick={handleReplyMessage(message.msgId, message.content)}>
                <p>{message.content}</p>
                <DateTimeDiv message={message} />
              </div>)}

            <EmojiReactions message={message} reactions={handleReactions} />

            < div className="deleteMsg">
              {message.senderId === currentUser?.userId && message.msgId === deleteMsgId &&
                <DeleteIcon onClick={handleDeleteMsg(message.msgId)} sx={{ color: "red", fontSize: "20px" }} />}
            </div>
          </div>
        ))
      }
      {replyMessage?.repliedToMsgId && chatId && replyMessage.chatID === chatId && (<div className="replyDiv">
        <div className="cancelReply" onClick={handleCancelReply}>
          <CancelIcon />
        </div>
        <div className="replyMessage">
          <p>{replyMessage.repliedToMsgContent}</p>
        </div>
      </div>)}
    </div >
  );
};

export default ChatDialog;
