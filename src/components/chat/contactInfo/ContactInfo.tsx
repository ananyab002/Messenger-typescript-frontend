import "./contactInfo.scss";
import { useSelectedContact } from "../../../hooks/useSelectedContact";

/**
 * Interface for contact information.
 */

const ContactInfo = () => {
  const { selectedContact } = useSelectedContact();

  return (
    <div className="top">
      <div className="userInformation">
        <div className="user">
          <img src={selectedContact?.image} alt="User" />
          <div className="text">
            <span>{selectedContact?.contactName}</span>
            <p>{selectedContact?.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;