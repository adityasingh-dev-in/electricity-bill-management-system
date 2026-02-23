import { createContext, useMemo, useState, type ReactNode } from "react";

export type User = {
    _id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export type UserContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const value = useMemo(() => ({
        user,
        setUser,
        loading,
        setLoading
    }), [user, loading]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};