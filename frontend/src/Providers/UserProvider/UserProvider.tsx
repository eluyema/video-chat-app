import { AxiosError } from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getMyUser, logoutMyUser, userLogin, userRegister } from '../../services/userService';

interface IUser {
    firstName: string;
    lastName: string;
    email: string;
}

interface UserValuesI {
    user: null | IUser,
    loading: boolean,
    login: (email: string, password: string) => Promise<void>;
    register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    fetchMyProfile: () => Promise<void>;
}

const UserInitValues: UserValuesI = {
    user: null,
    loading: false,
    login: async ()=>{},
    register: async () => {},
    logout: async () => {},
    fetchMyProfile: async () => {}
}

const UserContext = createContext(UserInitValues);

interface IUserProvider {
    children: React.ReactNode
}

const UserProvider = ({ children }: IUserProvider) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);

    const login = async (email: string, password: string) => {
        setLoading(true)
        try{
            const user = await userLogin(email, password);
            setUser(user)
        } catch(e: unknown) {
            if(e instanceof AxiosError && e.response) {
                switch(e.response.status) {
                    // eslint-disable-next-line no-throw-literal
                    case 401: throw "Credentials is wrong";
                    default: throw "Something goes wrong";
                }
            }
        } finally {
            setLoading(false)
        }
    }

    const register = async (firstName: string, lastName: string, email: string, password: string) => {
        setLoading(true)
        try{
            const user = await userRegister(firstName, lastName, email, password);
            setUser(user)
        } catch(e) {
            if(e instanceof AxiosError && e.response) {
                switch(e.response.status) {
                    // eslint-disable-next-line no-throw-literal
                    case 409: throw "Email is aready in use";
                    default: throw "Something goes wrong";
                }
            }
        }
        finally {
            setLoading(false)
        }
    }

    const fetchMyProfile = async () => {
        setLoading(true)
        try{
            const user = await getMyUser();
            setUser(user)
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        setLoading(true)
        try{
            await logoutMyUser();
            setUser(null)
        } finally {
            setLoading(false)
        }

    }

    useEffect(()=>{
        fetchMyProfile()
    },[])

    return (<UserContext.Provider value={{ user, loading, login, register, logout, fetchMyProfile}}>
        {children}
    </UserContext.Provider>)
}

export default UserProvider;
export { UserContext };
