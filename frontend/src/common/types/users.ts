interface IUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
};

interface UserUpdateData {
    email?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
}

interface WaiterInfo {
    socketId: string;
    identity: string;
}

export type { IUser, UserUpdateData, WaiterInfo };
