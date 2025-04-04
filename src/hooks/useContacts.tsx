import { useState, useCallback, useEffect } from 'react'
import { ContactListType } from '../types/type';
import { useLogin } from './useLogin';
import { contactApi } from '../api/contactsApi';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const SOCKET_URL = "http://localhost:8080/message";

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

        const stompClient = new Client({
            webSocketFactory: () => {
                return new SockJS(`${SOCKET_URL}?token=${token}`);
            },
            reconnectDelay: 5000
        });

        stompClient.onConnect = () => {
            console.log('WebSocket connected');

            stompClient.subscribe(`/topic/contacts/${currentUser.userId}`, (message: Message) => {
                const data = JSON.parse(message.body);
                console.log(data);
                updateContactList(data);
            });
        };

        stompClient.onDisconnect = () => {
            console.log('WebSocket disconnected');
        };

        stompClient.activate();

        return () => {
            if (stompClient.active) {
                stompClient.deactivate();
            }
        };
    }, [currentUser, token, fetchInitialContacts, updateContactList]);

    return {
        contactList,
        updateContactList
    };
}