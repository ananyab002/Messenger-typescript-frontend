import { useEffect, useState } from "react";
import "./addContact.scss";
import { useLogin } from "../../../../context/AuthContext";
import { ContactListType, SearchResultType } from "../../../../types/type";



type AddContactProp = {
    onClickAddContactDialog: (contactListData: ContactListType[]) => void;
}
const AddContact = ({ onClickAddContactDialog }: AddContactProp) => {

    const [searchInput, setSearchInput] = useState<string>();
    const [searchResults, setSearchResults] = useState<SearchResultType[]>();
    const { currentUser } = useLogin();
    const token = localStorage.getItem("authToken");
    console.log(currentUser);

    useEffect(() => {
        if (!searchInput) {
            setSearchResults([]);
        }
        const debounceTime = setTimeout(() => {
            if (searchInput)
                searchQuery(searchInput);

        }, 300);
        return () => clearTimeout(debounceTime);
    }, [searchInput]
    );

    const searchQuery = async (searchInput: string) => {

        console.log(token)
        if (!token) {
            console.log("No auth token found!");
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080/users/search?query=${encodeURIComponent(searchInput)}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            const data = await response.json();
            console.log(response)
            console.log(data)
            setSearchResults(data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleAddContacts = async (contactId: string) => {
        try {
            const response = await fetch(`http://localhost:8080/contacts?userId=${currentUser?.userId}&contactId=${contactId}`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                console.log(response);
                const contactListData = await response.json();
                console.log(contactListData);
                onClickAddContactDialog(contactListData);
            }
        } catch (error) {
            console.log(error)

        }

    }
    return (
        <>
            <div className="overlay"></div>
            <div className="addContacts">
                <h3>Add New Contact</h3>
                <form>
                    <input type="text" placeholder="Contact name" onChange={(e) => setSearchInput(e.target.value)} />
                </form>
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