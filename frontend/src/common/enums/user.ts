interface UserI {
    firstName?: string;
    lastName?: string;
    email?: string;
    id: string;
    displayName?: string;
}

interface IApprovedUser {
    email: string;
    displayName: string;
}

export type { UserI, IApprovedUser};
