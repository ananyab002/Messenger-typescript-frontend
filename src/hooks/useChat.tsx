import { useContext } from "react";
import { ChatMessagesContext } from "../context/ChatMessagesContext";

export function useChat() {
    const context = useContext(ChatMessagesContext);
    if (context == undefined)
        throw new Error("Undefined is not allowed");

    return context;
}