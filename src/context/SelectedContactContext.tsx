import { createContext, PropsWithChildren, useState } from "react";
import { ContactListType } from "../types/type";

type SelectedContactContextType = {
    updateSelectedContact: (contact: ContactListType) => void;
    selectedContact: ContactListType | undefined;
}
export const SelectedContactContext = createContext<SelectedContactContextType | undefined>(undefined);

export const SelectedContactContextProvider = ({ children }: PropsWithChildren) => {

    const [selectedContact, setSelectedContact] = useState<ContactListType>();

    const updateSelectedContact = (contact: ContactListType) => {
        setSelectedContact(contact);
    }

    return (
        <SelectedContactContext.Provider value={{ updateSelectedContact, selectedContact }}>{children}</SelectedContactContext.Provider>
    )
}