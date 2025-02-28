import { useState } from 'react'
import { ContactListType } from '../types/type';

export const useFetchContactList = () => {
    const [contactList, setcontactList] = useState<ContactListType[] | []>([]);

    const fetchContactList = async (contactData?: ContactListType[]) => {

        if (!contactData) {
            const response = await fetch(
                "https://ananyab002.github.io/Messenger-typescript-frontend/data/contactList.json"
            );
            const contactsData: ContactListType[] = await response.json();
            console.log(contactsData);
            setcontactList(contactsData);
        }
        else
            setcontactList(prev => [...prev, ...contactData]);

    }

    return { contactList, fetchContactList, setcontactList };
}
