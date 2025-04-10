import { useState, useCallback, useEffect } from 'react'
import { ContactListType } from '../types/type';
import { useLogin } from './useLogin';
import { contactApi } from '../api/contactsApi';
import { subscribe } from '../api/connectWebSocket';

export const useContact = () => {
    const [contactList, setContactList] = useState<ContactListType[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const { currentUser } = useLogin();
    const token = localStorage.getItem("authToken");

    const fetchInitialContacts = useCallback(async () => {
        const userId = currentUser?.userId;
        const token = localStorage.getItem("authToken");
        if (!userId) {
            console.error("User ID is missing.");
            return;
        }
        if (!token) {
            console.error("Token is missing.");
            return;
        }
        try {

            const response = await contactApi.getContacts(userId, token);
            console.log(response.data)
            if (!isInitialized) {
                console.log("Inside block")
                if (response.data)
                    setContactList(response.data);
                setIsInitialized(true);
            }
        } catch (error) {
            console.log(error);
        }
    }, [currentUser?.userId, isInitialized]);


    const updateContactList = useCallback((newContact: ContactListType) => {
        setContactList(prev => [...prev, newContact]);
    }, []);

    useEffect(() => {
        if (!currentUser) return;
        if (!token) return;

        fetchInitialContacts();

        const unsubscribe = subscribe(
            `/topic/contacts/${currentUser.userId}`,
            updateContactList
        );

        return unsubscribe;
    }, [currentUser, token, fetchInitialContacts, updateContactList]);

    return {
        contactList,
        updateContactList
    };
}