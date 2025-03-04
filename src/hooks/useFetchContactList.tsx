import { useState, useCallback } from 'react'
import { ContactListType } from '../types/type';

import api from '../api/globalApi';
import { useLogin } from './useLogin';

export const useFetchContactList = () => {
    const [contactList, setContactList] = useState<ContactListType[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const token = localStorage.getItem("authToken");
    const { currentUser } = useLogin();

    const fetchDummyContactList = async () => {
        try {
            const response = await api.get(
                "https://ananyab002.github.io/Messenger-typescript-frontend/data/contactList.json"
            );

            console.log(response.data)
            return response.data;

        } catch (error) {
            console.error("Error fetching contact list:", error);
        }
    }
    const fetchActualContactList = async () => {
        const userId = currentUser?.userId;
        if (!userId) {
            console.error("User ID is missing.");
            // Optionally, handle this case (e.g., redirect to login)
            return;
        }

        if (!token) {
            console.error("Auth Token is missing.");
            return;
        }
        try {
            const response = await api.get(`contacts/getContacts/${userId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
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