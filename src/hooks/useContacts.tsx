import { useState, useCallback } from 'react'
import { ContactListType } from '../types/type';
import { useLogin } from './useLogin';
import { contactApi } from '../api/contactsApi';

export const useFetchContactList = () => {
    const [contactList, setContactList] = useState<ContactListType[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const { currentUser } = useLogin();

    const fetchDummyContactList = async () => {
        try {
            const response = await contactApi.getDummyContacts();
            console.log(response.data)
            return response.data;

        } catch (error) {
            console.error("Error fetching contact list:", error);
        }
    }
    const fetchActualContactList = async () => {
        const userId = currentUser?.userId;
        const token = localStorage.getItem("authToken");
        if (!userId) {
            console.error("User ID is missing.");
            // Optionally, handle this case (e.g., redirect to login)
            return;
        }
        if (!token) {
            console.error("Token is missing.");
            // Optionally, handle this case (e.g., redirect to login)
            return;
        }
        try {

            const response = await contactApi.getActualContacts(userId, token);
            console.log(response.data)
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    const fetchContactList = async () => {
        if (!isInitialized) {
            const dummyData = await fetchDummyContactList();
            const actualData = await fetchActualContactList();
            if (actualData && dummyData)
                setContactList([...dummyData, ...actualData]);
            setIsInitialized(true);
        }
    }

    const updateContactList = useCallback((newContacts: ContactListType[]) => {
        setContactList(newContacts);
    }, []);

    return {
        contactList,
        fetchContactList,
        updateContactList
    };
}