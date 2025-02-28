import { createContext, PropsWithChildren, useContext, useState } from "react";
import { LoginDataType } from "../types/type";

interface LoginContextType {
    currentUser: LoginDataType | undefined,
    loginCurrentUser: (data: LoginDataType) => void;
    loginError: string | null
}

export const AuthContext = createContext<LoginContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: PropsWithChildren) => {

    const [currentUser, setCurrentUser] = useState<LoginDataType>();
    const [loginError, setLoginError] = useState<string | null>(null);


    const loginCurrentUser = async (data: LoginDataType) => {
        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ email: data.email, password: data.password })

            })

            const responseMessage = await response.json();
            if (response.ok) {

                console.log(responseMessage.token);
                localStorage.setItem("authToken", responseMessage.token);
                setCurrentUser(responseMessage.userData);

            }

            if (response.status === 404) {
                setLoginError(responseMessage.message);
            }
            if (response.status === 401) {
                setLoginError(responseMessage.message);
            }
        }
        catch (error) {
            console.log(error);
            setLoginError("Server failed. Please try again.")
        }
    }

    return (
        <AuthContext.Provider value={{ currentUser, loginCurrentUser, loginError }}>{children}</AuthContext.Provider>
    )
}

export function useLogin() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("It should not be undefined");
    }
    return context;
}