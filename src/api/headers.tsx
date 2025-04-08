export const getCommonHeaders = () => {
    const token = localStorage.getItem("authToken");
    return {
        Authorization: token ? `Bearer ${token}` : '',
    };
};