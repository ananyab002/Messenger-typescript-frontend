
import ChatDialog from "./chatDialog/ChatDialog";
import ContactInfo from "./contactInfo/ContactInfo";
import ChatPrompt from "./chatPrompt/ChatPrompt";
import "./chat.scss";
import { useChat } from "../../hooks/useChat";
import { useChatId } from "../../hooks/useChatId";

const Chat = () => {
  const { allMessages } = useChat();
  const { chatId } = useChatId();

  return (
    <div className="chatComponent">
      {chatId && allMessages ? (
        <div className="chat-container">
          <ContactInfo />
          <ChatDialog chatID={chatId} />
          <ChatPrompt chatID={chatId} />
        </div>
      ) : (
        <div className="info">Please select a friend to chat.</div>
      )}
    </div>
  );
};

export default Chat;
