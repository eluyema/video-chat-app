"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCookie = void 0;
function getCookie(cookieRaw, name) {
    if (!cookieRaw) {
        return '';
    }
    const match = cookieRaw.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
        return match[2];
    }
    else {
        return '';
    }
}
exports.getCookie = getCookie;
//# sourceMappingURL=cookie.js.map