import { useContext } from "react";
import { SelectedContactContext } from "../context/SelectedContactContext";


export const useSelectedContact = () => {

    const context = useContext(SelectedContactContext);
    if (!context)
        throw new Error("Undefined not allowed");
    return context;
}
