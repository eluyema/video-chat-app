import axios from "axios";
import { SessionInfoI } from "../common/types/sessions";
import { IUser, UserUpdateData } from "../common/types/users";

const urls = {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    profile: "/users/profile",
    updateMyUser: "/users/my"
};

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL as string,
});

const userLogin = async (email: string, password: string): Promise<IUser> => {
    const url = urls.login;

    const body = {
        email,
        password
    }

    const response = await api.post<IUser>(url, body, { withCredentials: true });

    return response.data;
}

const userRegister = async (firstName: string, lastName: string, email: string, password: string): Promise<IUser> => {
    const url = urls.register;

    const body = {
        firstName,
        lastName,
        email,
        password
    }

    const response = await api.post<IUser>(url, body, { withCredentials: true } );

    return response.data;
}

const getMyUser = async (): Promise<IUser> => {
    const url = urls.profile;

    const response = await api.get<IUser>(url, {
        withCredentials: true
    });

    return response.data;
}

const updateMyUser = async (data: UserUpdateData): Promise<IUser> => {
    const url = urls.updateMyUser;

    const response = await api.put<IUser>(url, data, {
        withCredentials: true
    });

    return response.data;
}

const logoutMyUser = async (): Promise<void> => {
    const url = urls.logout;

    await api.post<IUser>(url, null, {
        withCredentials: true,
    });
}


export { userLogin, userRegister, getMyUser, logoutMyUser, updateMyUser};
