
import ChatDialog from "./chatDialog/ChatDialog";
import ContactInfo from "./contactInfo/ContactInfo";
import { useChat } from "../../context/ChatMessagesContext";
import { useParams } from "react-router-dom";
import ChatPrompt from "./chatPrompt/ChatPrompt";
import "./chat.scss";

const Chat = () => {
  const { allMessages } = useChat();
  const { chatID } = useParams<{ chatID: string }>();
  return (
    <div className="chatComponent">
      {chatID && allMessages[chatID] ? (
        <div className="chat-container">
          <ContactInfo />
          <ChatDialog />
          <ChatPrompt chatID={chatID} />
        </div>
      ) : (
        <div className="info">Please select a friend to chat.</div>
      )}
    </div>
  );
};

export default Chat;
