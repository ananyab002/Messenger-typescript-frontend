import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { getDate, formatTime, getFormattedDate } from "../../../utils/date";
import { ChatMessagesContext, useChat } from "../../../context/ChatMessagesContext";
import { useParams } from "react-router-dom";
import { EmojiReactions, MessageType } from "../../../types/type";
import DeleteIcon from '@mui/icons-material/Delete';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import "./chatDialog.scss";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import CancelIcon from '@mui/icons-material/Cancel';
import { useLogin } from "../../../hooks/useLogin";


/**
 * ChatDialog component renders the chat interface displaying messages.
 * It fetches messages from the ChatMessagesContext based on the chatID
 */
const ChatDialog = () => {
  const todayDate = new Date();
  const centerRef = useRef<HTMLDivElement | null>(null);
  const { allMessages } = useContext(ChatMessagesContext) ?? {};
  const { chatID } = useParams();

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [selectedMsgId, setselectedMsgId] = useState<number>();
  const [openEmojiPicker, setOpenEmojiPicker] = useState<boolean>(false);
  const [deleteMsgId, setDeleteMsgId] = useState<number>();
  const [emojiReactions, setEmojiReactions] = useState<EmojiReactions[]>([]);
  // const [replyMessage, setReplyMessage] = useState<RepliedToMessageType>();
  const { replyMessage, updateReplyMessages } = useChat();
  const { currentUser } = useLogin();

  /**
   * Fetches messages for the current chatID from the context and
   * updates the local state with the fetched messages.
   */
  const fetch = useCallback(() => {
    if (allMessages && chatID) setMessages(allMessages[chatID]);
  }, [chatID, allMessages]);

  useEffect(() => {
    fetch();
  }, [chatID, allMessages, fetch]);


  /**
   * useEffect to bottom scroll.
   */

  useEffect(() => {
    const center = centerRef.current;
    if (center) {
      center.scrollTop = center.scrollHeight;
    }
  }, [messages]);

  const handleDeleteMsg = (msgId: number): React.MouseEventHandler<SVGSVGElement> => (event) => {
    console.log(event)
    const updatedMessages = messages.filter(message => message.msgId != msgId);
    setMessages(updatedMessages);
  }

  const handleEmojiPicker = (msgId: number): React.MouseEventHandler<SVGSVGElement | HTMLDivElement> => () => {
    console.log(msgId);
    setselectedMsgId(msgId);
    setOpenEmojiPicker(!openEmojiPicker);
  }

  const handleEmojiReactions = (e: EmojiClickData, msgId: number) => {
    console.log(e.emoji, msgId);
    setEmojiReactions(prevReactions => {
      const findReaction = prevReactions.find(reaction => reaction.msgId === msgId);
      if (!findReaction)
        return [...prevReactions, { msgId, emoji: e.emoji }];
      else {
        return prevReactions.map(reaction => {
          if (reaction.msgId === msgId) {
            return { ...reaction, emoji: e.emoji };
          }
          return reaction;
        })
      }
    });
    setOpenEmojiPicker(false)
    console.log(emojiReactions);
  }

  function getEmojiReactions(msgId: number): string {
    if (emojiReactions) {
      const checkEmoji = emojiReactions.find(reaction => reaction.msgId === msgId);
      if (checkEmoji) return checkEmoji.emoji;
    }
    return "";
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
      {messages &&
        messages.map((message, index) => (
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
                    <div className="dateTime">
                      <span>
                        {getDate(message.sentAt) === getDate(todayDate)
                          ? ""
                          : getFormattedDate(message.sentAt)}
                      </span>
                      <span> {formatTime(message.sentAt)}</span>
                    </div>
                  </div>
                </div>

              </div>) :

              (<div className="texts" onDoubleClick={handleReplyMessage(message.msgId, message.content)}>
                <p>{message.content}</p>
                <div className="dateTime">
                  <span>
                    {getDate(message.sentAt) === getDate(todayDate)
                      ? ""
                      : getFormattedDate(message.sentAt)}
                  </span>
                  <span> {formatTime(message.sentAt)}</span>
                </div>
              </div>)}
            {getEmojiReactions(message.msgId).length === 0 &&
              < div className="addReaction">
                <AddReactionIcon onClick={handleEmojiPicker(message.msgId)} sx={{ color: "white", fontSize: "20px" }} />
              </div>
            }
            {getEmojiReactions(message.msgId).length > 0 &&
              < div className="reaction" onClick={handleEmojiPicker(message.msgId)}>
                {getEmojiReactions(message.msgId)}
              </div>}

            < div className="deleteMsg">
              {message.senderId === currentUser?.userId && message.msgId === deleteMsgId && <DeleteIcon onClick={handleDeleteMsg(message.msgId)} sx={{ color: "red", fontSize: "20px" }} />}
            </div>

            <div className="emojiPick">
              {openEmojiPicker && message.msgId === selectedMsgId && <EmojiPicker reactionsDefaultOpen={true} onReactionClick={(e) => handleEmojiReactions(e, message.msgId)} />}
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
