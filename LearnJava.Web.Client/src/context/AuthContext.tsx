import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { TOKEN_STORAGE_KEY } from "../utils/Constants";

interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_STORAGE_KEY));
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {

        const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
        setToken(savedToken);
        setIsLoading(false);
    }, []);

    const login = (newToken: string) => {
        localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
        setToken(newToken);
    }

    const logout = () => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
    }

    return (
        <AuthContext.Provider value={{
            token,
            isAuthenticated: !!token,
            isLoading,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );

}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}

