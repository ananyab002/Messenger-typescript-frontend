import { useContext, useEffect, useState } from "react";
import { ChatMessagesContext, ChatMessagesContextType } from "../../../context/ChatMessagesContext";
import "./contactList.scss";
import { useNavigate } from "react-router-dom";

/**
 * Fetches contact list data from a JSON file and updates state.
 */
interface ContactListType {
  id: string,
  name: string,
  img: string,
  status: string,
  chatId: string
}
const ContactList = () => {
  const { fetchInitialMessages } = useContext<ChatMessagesContextType>(ChatMessagesContext);
  const [contactList, setcontactList] = useState<ContactListType[] | []>([]);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchContactList = async () => {
    const response = await fetch(
      "/data/contactList.json"
    );
    const contactsData: ContactListType[] = await response.json();
    setcontactList(contactsData);
    console.log(contactsData)
  };

  useEffect(() => {
    fetchContactList();
  }, []);

  const getMessages = async (contactId: string, chatId: string) => {
    try {
      console.log("getMessages", contactId, chatId)
      await fetchInitialMessages(chatId);
      setSelectedContactId(contactId);
      console.log(selectedContactId);
      navigate(`/messenger/` + chatId);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="contactList">
      <p>Friends</p>
      <div className="list">
        {contactList.map((contact) => (
          <div
            key={contact.id}
            className={`user ${selectedContactId === contact.id ? "selected" : ""
              }`}
            onClick={() => getMessages(contact.id, contact.chatId)}
            style={{
              pointerEvents: selectedContactId === contact.id ? "none" : "auto",
            }}
          >
            <img src={contact.img} alt="" />
            <div className="text">
              <span>{contact.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactList;
