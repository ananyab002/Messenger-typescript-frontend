import UserInfo from "./userInfo/UserInfo";
import "./contacts.scss";
import ContactList from "./contactlist/ContactList";

const Contacts = () => {
  return (
    <div className="contactsComponent">
      <UserInfo />
      <ContactList />
    </div>
  );
};

export default Contacts;
