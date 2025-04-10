import { Client, Message, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const SOCKET_URL = "http://localhost:8080/message";

let stompClient: Client | null = null;
const subscriptions = new Map<
    string,
    { callback: (data: any) => void; stompSub?: StompSubscription }
>();

let currentToken = localStorage.getItem("authToken") || null;

export const connectWebSocket = () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
        console.error("No auth token available");
        return;
    }
    currentToken = token;

    if (stompClient && stompClient?.active) {
        return;
    }

    stompClient = new Client({
        webSocketFactory: () => new SockJS(`${SOCKET_URL}?token=${token}`),
        reconnectDelay: 5000,

        onConnect: () => {
            console.log("WebSocket connected");

            subscriptions.forEach((entry, destination) => {
                const stompSub = stompClient!.subscribe(destination, (message) => {
                    try {
                        const data = JSON.parse(message.body);
                        entry.callback(data);
                    } catch (error) {
                        console.error("Error parsing message", error);
                    }
                })
                subscriptions.set(destination, {
                    ...entry,
                    stompSub,
                });
            });
        },

        onDisconnect: () => {
            console.log("WebSocket disconnected");
        },

        onStompError: (frame) => {
            console.error("STOMP error:", frame.headers.message);
        }
    });

    stompClient.activate();
};

export const disconnectWebSocket = async () => {
    if (stompClient?.active) {
        await stompClient.deactivate();
        stompClient = null;
        subscriptions.clear();
        console.log("WebSocket manually disconnected");
    }
};

export const subscribe = (destination: string, callback: (data: any) => void) => {

    const existing = subscriptions.get(destination);
    if (existing?.stompSub) {
        existing.stompSub.unsubscribe();
    }

    subscriptions.set(destination, { callback });

    if (stompClient?.connected) {
        const stompSub = stompClient.subscribe(destination, (message: Message) => {
            try {
                const data = JSON.parse(message.body);
                callback(data);
            } catch (error) {
                console.error("WebSocket: Error parsing message", error);
            }
        });

        subscriptions.set(destination, { callback, stompSub });
    } else {
        console.log("WebSocket: Subscription queued", destination);
        connectWebSocket();
    }

    return () => unsubscribe(destination);
};

export const unsubscribe = (destination: string) => {
    const entry = subscriptions.get(destination);
    if (entry?.stompSub) {
        entry.stompSub.unsubscribe();
    }
    subscriptions.delete(destination);
};


export const sendMessage = (destination: string, body: any = {}) => {
    const token = localStorage.getItem("authToken");

    if (!token || !stompClient?.connected) {
        console.warn("WebSocket: Cannot send, not connected");
        return;
    }

    stompClient.publish({
        destination,
        body: JSON.stringify(body),
        headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }
    });
};

export const watchAuthToken = () => {
    setInterval(() => {
        const newToken = localStorage.getItem("authToken");
        if (newToken !== currentToken) {
            console.log("WebSocket: Token changed, reconnecting");
            disconnectWebSocket().then(connectWebSocket);
        }
    }, 1000);
};