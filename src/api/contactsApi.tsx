import api from "./globalApi";
export const contactApi = {

    getActualContacts: (userId: number, token: string) => api.get(`contacts/getContacts/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),

    getDummyContacts: () => api.get("https://ananyab002.github.io/Messenger-typescript-frontend/data/contactList.json"),

    addContact: (userId: number, contactId: string, token: string) => api.post(`contacts?userId=${userId}&contactId=${contactId}`, {}, { headers: { Authorization: `Bearer ${token}` } }),

    searchContact: (searchInput: string, token: string) => api.get(`users/search?query=${encodeURIComponent(searchInput)}`, { headers: { Authorization: `Bearer ${token}` } })

}