import { useEffect, useState } from "react";
import { useChat } from "../../../context/ChatMessagesContext";
import "./contactList.scss";
import { useNavigate } from "react-router-dom";
import AddBoxIcon from '@mui/icons-material/AddBox';
import SearchIcon from '@mui/icons-material/Search';
import AddContact from "./addContact/AddContact";
import { useContact } from "../../../hooks/useContacts";
import { ContactListType } from "../../../types/type";
import { useLogin } from "../../../hooks/useLogin";
import { useSelectedContact } from "../../../hooks/useSelectedContact";


/**
 * Fetches contact list data from a JSON file and updates state.
 */

const ContactList = () => {
  const { fetchAllMessages } = useChat();
  const { contactList, updateContactList } = useContact();
  const { selectedContact, updateSelectedContact } = useSelectedContact();
  const [searchText, setSearchText] = useState<string>();
  const [addContactDialog, setAddContactDialog] = useState<boolean>(false);
  const { currentUser } = useLogin();
  const navigate = useNavigate();

  console.log(contactList);

  const getMessages = async (contact: ContactListType) => {
    const userId = currentUser?.userId;
    if (!userId)
      return;
    try {
      console.log("getMessages", contact.contactId);
      const actualChatId = await fetchAllMessages(userId, contact.contactId);
      updateSelectedContact(contact);
      console.log(selectedContact, actualChatId);
      navigate(`/Messenger-typescript-frontend/messenger/` + actualChatId);

    } catch (error) {
      console.log(error);
    }
  };


  // const handleSearch = () => {
  //   const searchContactList = contactList.filter(item => searchText && item.contactName.toLowerCase().includes(searchText.toLowerCase()));
  //   if (searchContactList) {
  //     const remainingContactList = contactList.filter(item => item.contactId !== searchContactList[0].contactId);
  //     const updatedContactList = [...searchContactList, ...remainingContactList];
  //     updateContactList(updatedContactList);
  //     updateSelectedContact(searchContactList[0]);
  //     getMessages(searchContactList[0]);
  //   }
  //   console.log(searchContactList);
  // }

  const handleAddContactDialog = (contactData?: ContactListType) => {
    if (contactData) {
      updateContactList(contactData);
    }
    setAddContactDialog(false);

  }

  return (
    <div className="contactList">
      <div className="addSearchContacts">
        <input type="text" placeholder="Add or search"
          onChange={(e) => setSearchText(e.target.value)} />
        <div className="search">
          {/* <SearchIcon className="searchContact" onClick={handleSearch} /> */}
          <AddBoxIcon className="addContact" onClick={() => setAddContactDialog(true)} />
        </div>
      </div>
      <div className="list">
        {contactList.map((contact) => (
          <div
            key={contact.contactId}
            className={`user ${selectedContact?.contactId === contact.contactId ? "selected" : ""
              }`}
            onClick={() => getMessages(contact)}
            style={{
              pointerEvents: selectedContact?.contactId === contact.contactId ? "none" : "auto",
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
