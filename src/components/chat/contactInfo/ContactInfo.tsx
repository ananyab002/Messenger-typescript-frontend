import "./contactInfo.scss";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useFetchContactList } from "../../../hooks/useFetchContactList";
import { useEffect } from "react";

/**
 * Interface for contact information.
 */
interface ContactInfoType {
  chatId: string;
  image: string;
  contactName: string;
  status: string;
}

const ContactInfo = () => {
  const { chatID } = useParams<{ chatID: string }>();
  const { contactList, fetchContactList } = useFetchContactList();

  useEffect(() => {
    fetchContactList();
  }, [fetchContactList]);
  const {
    data: contactInfo,
    // isLoading,
    isError,
  } = useQuery<ContactInfoType | null, Error>({
    queryKey: ["contactInfo", chatID],
    queryFn: async () => {
      if (!chatID) return null; // Return null if chatID is not provided
      console.log(contactList)
      return contactList.find((item) => item.chatId === chatID) || null;
    },
    enabled: !!chatID && contactList && contactList.length > 0,
  });

  if (isError || !contactInfo) {
    return <div className="error">Error loading contact info.</div>;
  }

  return (
    <div className="top">
      <div className="userInformation">
        <div className="user">
          <img src={contactInfo.image} alt="User" />
          <div className="text">
            <span>{contactInfo.contactName}</span>
            <p>{contactInfo.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;