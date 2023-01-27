"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicUser = void 0;
const getPublicUser = (user) => {
    return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
    };
};
exports.getPublicUser = getPublicUser;
//# sourceMappingURL=users.js.map