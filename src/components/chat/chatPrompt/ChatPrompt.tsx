import { getFormattedDate, formatTime } from "../../../utils/date";
import { SubmitHandler, useForm } from "react-hook-form";
import { memo, useContext, useEffect, useState } from "react";
import { ChatMessagesContext } from "../../../context/ChatMessagesContext";
import { useParams } from "react-router-dom";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import "./chatPrompt.scss";

/**
 *  Handles the input and submission of new chat messages.
 */

interface ChatPromptType {
  message: string
}
interface PromptDraftMessage {
  promptChatID: string | undefined,
  promptMessage: string
}
const ChatPrompt = () => {
  const { register, handleSubmit, setValue, reset, getValues } = useForm<ChatPromptType>();
  const [openEmoji, setOpenEmoji] = useState(false);
  const [promtDraftMessages, setPromptDraftMessages] = useState<PromptDraftMessage[]>([]);
  const { updateAllMessages, replyMessage } = useContext(ChatMessagesContext);
  const { chatID } = useParams();

  useEffect(() => {
    getDraftMessages()
  }, [chatID]);

  const getDraftMessages = () => {
    const promptMessageValue = promtDraftMessages.find(draftMsg => chatID === draftMsg.promptChatID);
    if (promptMessageValue) {
      setValue("message", promptMessageValue.promptMessage);
    }
    else
      setValue("message", "");
  }

  const handleSendMessage: SubmitHandler<ChatPromptType> = async (data) => {
    const updatedPromptDraft = promtDraftMessages.filter(item => item.promptChatID != chatID && item.promptMessage != data.message);
    setPromptDraftMessages(updatedPromptDraft);
    let messageObject;
    if (data.message.trim().length === 0) {
      return;
    }
    if (replyMessage) {
      messageObject = {
        // id 1 is for the user
        id: 1,
        message: data.message,
        time: formatTime(new Date()),
        date: getFormattedDate(new Date()),
        msgId: 10,
        repliedToMsgId: replyMessage.msgId,
        repliedToMessage: replyMessage.message
      };
      updateAllMessages(messageObject, chatID || "");
    }
    else {
      messageObject = {
        // id 1 is for the user
        id: 1,
        message: data.message,
        time: formatTime(new Date()),
        date: getFormattedDate(new Date()),
        msgId: 10,
      };
      updateAllMessages(messageObject, chatID || "");
    }


    reset();
  };

  /**
   * Handles the Enter key press event to send the message.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const currentMessage = getValues("message");
      console.log("Enter", currentMessage)
      if (currentMessage.trim()) handleSubmit(handleSendMessage)();
    }
  };

  const handleEmoji = (e: EmojiClickData) => {
    const sendMessage = getValues("message") || "";
    setValue("message", sendMessage + e.emoji + "");
    setOpenEmoji(false);
  };

  const handlePromptInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setPromptDraftMessages(prev => {
      const findChatID = prev.find(draftMsg => chatID === draftMsg.promptChatID);
      if (findChatID) {
        return prev.map(draftMsg => {
          if (chatID === draftMsg.promptChatID) {
            return { ...draftMsg, promptMessage: inputValue };
          }
          return draftMsg;
        })
      }
      else {
        return [...prev, { promptChatID: chatID, promptMessage: inputValue }];
      }
    });

    console.log(promtDraftMessages);
  }

  return (
    <div className="bottom">
      <form onSubmit={handleSubmit(handleSendMessage)}>
        <div className="emoji">
          <input
            {...register("message")}
            className="messageInput"
            type="text"
            placeholder="Type a message...."
            onKeyDown={handleKeyDown}
            onChange={handlePromptInput}
          />
          <img
            className="emojiIcon"
            style={{ height: "25px" }}
            src="/images/emoji.png"
            alt=""
            onClick={() => setOpenEmoji((prev) => !prev)}
          />
          <div className="emojiPicker">
            <EmojiPicker open={openEmoji} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button type="submit" className="sendButton">
          Send
        </button>
      </form>
    </div>
  );
};

export default memo(ChatPrompt);
