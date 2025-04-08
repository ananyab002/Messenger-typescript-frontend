import React, { useEffect, useRef, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';

import "./chatDialog.scss";
import CancelIcon from '@mui/icons-material/Cancel';
import { useLogin } from "../../../hooks/useLogin";
import { EmojiReactions } from "./emojiReactions/EmojiReactions";
import { DateTimeDiv } from "./dateTimeDiv/DateTimeDiv";
import { useChat } from "../../../hooks/useChat";
import useWebSocket from "../../../hooks/useWebSocket";


/**
 * ChatDialog component renders the chat interface displaying messages.
 * It fetches messages from the ChatMessagesContext based on the chatID
 */
type ChatDialogPropType = {
  chatID: number
}
const ChatDialog = ({ chatID }: ChatDialogPropType) => {

  const centerRef = useRef<HTMLDivElement | null>(null);
  const { allMessages } = useChat() ?? {};
  const [deleteMsgId, setDeleteMsgId] = useState<number>();
  const { replyMessage, updateReplyMessages } = useChat();
  const { currentUser } = useLogin();
  const { sendDeleteMessage, sendMessageEmojiReaction } = useWebSocket(chatID);


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
  const handleReplyMessage = (msgId: number, message: string): React.MouseEventHandler<HTMLDivElement> => () => {
    if (chatID)
      updateReplyMessages("open", message, chatID, msgId);
    console.log(msgId, replyMessage)
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
                  <p> {message.repliedToMessage}</p>
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
      {replyMessage?.msgId && chatID && replyMessage.chatID === chatID && (<div className="replyDiv">
        <div className="cancelReply" onClick={handleCancelReply}>
          <CancelIcon />
        </div>
        <div className="replyMessage">
          <p>{replyMessage.message}</p>
        </div>
      </div>)}
    </div >
  );
};

export default ChatDialog;
