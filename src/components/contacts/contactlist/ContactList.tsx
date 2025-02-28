import { useContext, useEffect, useState } from "react";
import { ChatMessagesContext, ChatMessagesContextType } from "../../../context/ChatMessagesContext";
import "./contactList.scss";
import { useNavigate } from "react-router-dom";
import AddBoxIcon from '@mui/icons-material/AddBox';
import SearchIcon from '@mui/icons-material/Search';
import AddContact from "./addContact/AddContact";
import { useFetchContactList } from "../../../hooks/useFetchContactList";
import { ContactListType } from "../../../types/type";

/**
 * Fetches contact list data from a JSON file and updates state.
 */

const ContactList = () => {
  const { fetchInitialMessages } = useContext<ChatMessagesContextType>(ChatMessagesContext);
  const { contactList, fetchContactList, setcontactList } = useFetchContactList();
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>();
  const [addContactDialog, setAddContactDialog] = useState<boolean>(false);
  const navigate = useNavigate();

  console.log(contactList);

  useEffect(() => {
    fetchContactList();
  }, [])

  const getMessages = async (contactId: string, chatId: string) => {
    try {
      console.log("getMessages", contactId, chatId)
      await fetchInitialMessages(chatId);
      setSelectedContactId(contactId);
      console.log(selectedContactId);
      navigate(`/Messenger-typescript-frontend/messenger/` + chatId);

    } catch (error) {
      console.log(error);
    }
  };


  const handleSearch = () => {
    const searchContactList = contactList.filter(item => searchText && item.name.toLowerCase().includes(searchText.toLowerCase()));
    if (searchContactList) {
      const remainingContactList = contactList.filter(item => item.id !== searchContactList[0].id);
      const updatedContactList = [...searchContactList, ...remainingContactList];
      setcontactList(updatedContactList);
      setSelectedContactId(searchContactList[0].id);
      getMessages(searchContactList[0].id, searchContactList[0].chatId);
    }
    console.log(searchContactList);
  }

  const handleAddContactDialog = (contactData: ContactListType[]) => {
    //setcontactList(prev => [...prev, ...contactData]);
    setAddContactDialog(false);
    fetchContactList(contactData);
  }

  return (
    <div className="contactList">
      <div className="addSearchContacts">
        <input type="text" placeholder="Add or search"
          onChange={(e) => setSearchText(e.target.value)} />
        <div className="search">
          <SearchIcon className="searchContact" onClick={handleSearch} />
          <AddBoxIcon className="addContact" onClick={() => setAddContactDialog(true)} />
        </div>
      </div>
      <div className="list">
        {contactList.map((contact) => (
          <div
            className={`user ${selectedContactId === contact.contactId ? "selected" : ""
              }`}
            onClick={() => getMessages(contact.contactId, contact.chatId)}
            style={{
              pointerEvents: selectedContactId === contact.contactId ? "none" : "auto",
            }}
          >
            <img src={contact.image} alt="" />
            <div className="text">
              <span>{contact.contactName}</span>
            </div>
          </div>
        ))}
      </div>
      {addContactDialog && <AddContact onClickAddContactDialog={handleAddContactDialog} />}
    </div>
  );
};

export default ContactList;
