"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicSession = void 0;
const getPublicSession = (session) => {
    return {
        shareId: session.shareId,
        reusable: session.reusable,
        isRanning: session.isRanning,
        title: session.title,
        description: session.description,
        plannedDate: session.plannedDate,
        security: session.security,
        authorEmail: session.author.email,
    };
};
exports.getPublicSession = getPublicSession;
//# sourceMappingURL=sessions.js.map