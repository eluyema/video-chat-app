import axios from "axios";
import { SessionCreateData, SessionInfoI, SessionUpdateData } from "../common/types/sessions";

const urls = {
    sessionInfo: "/sessions/{shareId}",
    createSession: "/sessions",
    updateSession: "/sessions/{shareId}",
    deleteSession: "/sessions/{shareId}",
    stopSession: "/sessions/stop/{shareId}",
    mySessions: "/sessions/all",
};

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL as string,
});

console.log(process.env.REACT_APP_SECRET_NAME)

const fetchSessionInfo = async (shareId: string): Promise<SessionInfoI> => {
    const url = urls.sessionInfo.replace("{shareId}", shareId);

    const response = await api.get<SessionInfoI>(url);

    return response.data;
}

const deleteSession = async (shareId: string): Promise<string> => {
    const url = urls.deleteSession.replace("{shareId}", shareId);

    const response = await api.delete<string>(url, { withCredentials: true });

    return response.data;
}

const createSession = async (data: SessionCreateData): Promise<SessionInfoI> => {
    const url = urls.createSession

    const response = await api.post<SessionInfoI>(url, data, { withCredentials: true });

    return response.data;
}

const updateSession = async (shareId: string, data: SessionUpdateData): Promise<SessionInfoI> => {
    const url = urls.updateSession.replace("{shareId}", shareId);

    const response = await api.put<SessionInfoI>(url, data, { withCredentials: true });

    return response.data;
}

const fetchMySessions = async (): Promise<SessionInfoI[]> => {
    const url = urls.mySessions;

    const response = await api.get<SessionInfoI[]>(url, { withCredentials: true });

    return response.data;
}

const stopSession = async (shareId: string): Promise<void> => {
    const url = urls.stopSession.replace("{shareId}", shareId);

    await api.post<void>(url, null, { withCredentials: true });
}

export { fetchSessionInfo, fetchMySessions, deleteSession, updateSession, createSession, stopSession };
