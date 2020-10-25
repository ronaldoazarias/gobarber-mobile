import React, { createContext, useCallback, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';

interface AuthState {
    token: string;
    user: object;
};

interface SignInCredentials {
    email: string;
    password: string;
}

interface AuthContextData {
    user: object;
    loading: boolean;
    signIn(credentials: SignInCredentials): Promise<void>;
    signOut(): void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData); 
//burlar TS para iniciar com objeto vazio

export const AuthProvider: React.FC = ({ children }) => {
    const [data, setData] = useState<AuthState>({} as AuthState);
    const [loading, setLoading] = useState(true);
    /*const [data, setData] = useState<AuthState>(() => {
        const token = localStorage.getItem('@GoBarber:token');
        const user = localStorage.getItem('@GoBarber:user');

        if (token && user) {
            return { token, user: JSON.parse(user) };
        }

        return {} as AuthState;
    });*/

    useEffect(() => {
        async function loadStoragedData(): Promise<void> {
            const token = await AsyncStorage.getItem('@GoBarber:token');
            const user = await AsyncStorage.getItem('@GoBarber:user');

            /*const [token, user] = await AsyncStorage.multiGet([
                '@GoBarber:token',
                '@GoBarber:user'
            ]);          */  

            if (token && user) {
                setData({ token, user: JSON.parse(user) });
                setLoading(false);
            }

            //return {} as AuthState;
        }

        loadStoragedData();
    }, []);

    const signIn = useCallback(async ({ email, password}) => {
        const response = await api.post<{ token: string; user: object}>('sessions',{
            email,
            password
        });

        const { token, user } = response.data;

        //await AsyncStorage.setItem('@GoBarber:token', token);
        //await AsyncStorage.setItem('@GoBarber:user', JSON.stringify(user));

        await AsyncStorage.multiSet([
            ['@GoBarber:token', token],
            ['@GoBarber:user', JSON.stringify(user)]
        ]);

        const mUser = await AsyncStorage.getItem('@GoBarber:user');

        console.log('mUser: ', mUser);

        setData({ token, user });

    }, []);

    const signOut = useCallback(async () => {
        //await AsyncStorage.removeItem('@GoBarber:token');
        //await AsyncStorage.removeItem('@GoBarber:user');

        await AsyncStorage.multiRemove(['@GoBarber:token', '@GoBarber:user']);

        setData({} as AuthState);
    }, []);

    return (
        <AuthContext.Provider
            value={{ user: data.user, loading, signIn, signOut }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth(): AuthContextData{
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}