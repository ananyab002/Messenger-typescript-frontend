import { useEffect, useState } from "react";
import "./addContact.scss";

import { ContactListType, SearchResultType } from "../../../../types/type";
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { useLogin } from "../../../../hooks/useLogin";
import { AxiosError } from "axios";
import { contactApi } from "../../../../api/contactsApi";



type AddContactProp = {
    onClickAddContactDialog: (contactListData?: ContactListType) => void;
}
const AddContact = ({ onClickAddContactDialog }: AddContactProp) => {

    const [searchInput, setSearchInput] = useState<string>();
    const [searchResults, setSearchResults] = useState<SearchResultType[]>();
    const [addContactError, setAddContactError] = useState<string>();
    const { currentUser } = useLogin();
    const token = localStorage.getItem("authToken");

    console.log(currentUser);

    useEffect(() => {
        if (!searchInput) {
            setSearchResults([]);
        }
        const searchQuery = async (searchInput: string) => {
            const token = localStorage.getItem("authToken");
            console.log(token)
            if (!token) {
                console.log("No auth token found!");
                return;
            }
            try {
                const response = await contactApi.searchContact(searchInput, token);
                setSearchResults(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        const debounceTime = setTimeout(() => {
            if (searchInput)
                searchQuery(searchInput);

        }, 300);
        return () => clearTimeout(debounceTime);
    }, [searchInput, token]
    );



    const handleAddContacts = async (contactId: string) => {
        setAddContactError(undefined);
        const userId = currentUser?.userId;
        const token = localStorage.getItem("authToken");
        if (!userId || !token) {
            setAddContactError("User is not authenticated");
            return;
        }
        try {
            const response = await contactApi.addContact(userId, contactId, token);
            if (response.data) {
                console.log(response.data);
                onClickAddContactDialog(response.data);
            }
            else {
                console.log(response.data.message)
                setAddContactError(response.data.message);
            }

        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                if (error.response) {
                    console.error("Axios Error:", error.response.data);
                    setAddContactError(error.response.data);
                    console.log(error)
                }

            }
        }
    }

    const handleCancelAddContact = () => {
        onClickAddContactDialog();
    }
    return (
        <>
            <div className="overlay"></div>
            <div className="addContacts">
                <h3 style={{ textAlign: "center" }}>Add New Contact</h3>
                <DisabledByDefaultIcon className="closeButton" onClick={handleCancelAddContact}></DisabledByDefaultIcon>
                <form>
                    <input type="text" placeholder="Contact name" onChange={(e) => setSearchInput(e.target.value)} />
                </form>
                {addContactError && <div style={{ margin: "5px", color: "red" }}>{addContactError}</div>}
                {searchResults && searchResults.map(item => (
                    <div key={item.userId} className="searchList">
                        <div className="user">
                            <img src={item.image} alt="" />
                            <div className="details">
                                <p className="userName">{item.name}</p>
                                <p>{item.phoneNumber}</p>
                            </div>
                        </div>
                        <button onClick={() => handleAddContacts(item.userId)}>Add</button>
                    </div>
                ))}
            </div>

        </>
    )
}

export default AddContact;