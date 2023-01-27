"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trim = void 0;
const class_transformer_1 = require("class-transformer");
const lodash_1 = require("lodash");
function Trim() {
    return (0, class_transformer_1.Transform)((params) => {
        const value = params.value;
        if ((0, lodash_1.isArray)(value)) {
            return (0, lodash_1.map)(value, (v) => (0, lodash_1.trim)(v).replace(/\s\s+/g, ' '));
        }
        return (0, lodash_1.trim)(value).replace(/\s\s+/g, ' ');
    });
}
exports.Trim = Trim;
//# sourceMappingURL=transform.decorators.js.map