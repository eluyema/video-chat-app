import { SessionSecurityEnum } from "../enums/sessions";

interface SessionInfoI {
    shareId: string;
    reusable: boolean;
    isRanning: boolean;
    title: string;
    description?: string;
    plannedDate?: Date;
    security: SessionSecurityEnum;
    authorEmail: string;
}

interface SessionUpdateData {
    title?: string;
    description?: string ;
    plannedDate?: Date;
    security?: SessionSecurityEnum;
    password?: string;
}

interface SessionCreateData {
    title: string;
    reusable: boolean;
    security: SessionSecurityEnum;
    description?: string;
    plannedDate?: Date;
    password?: string;
}

interface ChatMessageI {
    utc: string;
    userId: string;
    name: string;
    text: string;   
}

export type { SessionInfoI, SessionUpdateData, SessionCreateData }
