import "./contactInfo.scss";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

/**
 * Interface for contact information.
 */
interface ContactInfoType {
  chatId: string;
  img: string;
  name: string;
  status: string;
}

const ContactInfo = () => {
  const { chatID } = useParams<{ chatID: string }>();

  const {
    data: contactInfo,
    isLoading,
    isError,
  } = useQuery<ContactInfoType | null, Error>({
    queryKey: ["contactInfo", chatID],
    queryFn: async () => {
      if (!chatID) return null; // Return null if chatID is not provided

      const response = await fetch("/data/contactList.json");
      if (!response.ok) {
        throw new Error("Failed to fetch contact information.");
      }

      const contactsData: ContactInfoType[] = await response.json();
      return contactsData.find((item) => item.chatId === chatID) || null;
    },
    enabled: !!chatID,
  });

  if (isLoading) {
    return <div className="loading">Loading contact info...</div>;
  }

  if (isError || !contactInfo) {
    return <div className="error">Error loading contact info.</div>;
  }

  return (
    <div className="top">
      <div className="userInformation">
        <div className="user">
          <img src={contactInfo.img} alt="User" />
          <div className="text">
            <span>{contactInfo.name}</span>
            <p>{contactInfo.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;