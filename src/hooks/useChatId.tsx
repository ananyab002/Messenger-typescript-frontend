import { useContext } from "react";
import { ChatIdContext } from "../context/ChatIdContext";

export function useChatId() {
    const context = useContext(ChatIdContext);
    if (context == undefined)
        throw new Error("Undefined is not allowed");

    return context;
}