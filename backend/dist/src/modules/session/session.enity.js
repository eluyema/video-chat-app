"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionSecurity = void 0;
const typeorm_1 = require("typeorm");
const ManyToMany_1 = require("typeorm/decorator/relations/ManyToMany");
const ManyToOne_1 = require("typeorm/decorator/relations/ManyToOne");
const user_enity_1 = require("../user/user.enity");
var SessionSecurity;
(function (SessionSecurity) {
    SessionSecurity["NONE"] = "NONE";
    SessionSecurity["PERMISSION"] = "PERMISSION";
    SessionSecurity["PASSWORD"] = "PASSWORD";
    SessionSecurity["REGISTRED"] = "REGISTRED";
})(SessionSecurity = exports.SessionSecurity || (exports.SessionSecurity = {}));
let SessionEntity = class SessionEntity extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SessionEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], SessionEntity.prototype, "shareId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], SessionEntity.prototype, "reusable", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], SessionEntity.prototype, "isRanning", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SessionEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SessionEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SessionEntity.prototype, "twilioRoomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], SessionEntity.prototype, "plannedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SessionSecurity,
    }),
    __metadata("design:type", String)
], SessionEntity.prototype, "security", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SessionEntity.prototype, "password", void 0);
__decorate([
    (0, ManyToOne_1.ManyToOne)(() => user_enity_1.default, (user) => user.createdSessions, {
        nullable: false,
    }),
    __metadata("design:type", user_enity_1.default)
], SessionEntity.prototype, "author", void 0);
__decorate([
    (0, ManyToMany_1.ManyToMany)(() => user_enity_1.default, (user) => user.friendlySessions, {
        nullable: true,
    }),
    __metadata("design:type", Array)
], SessionEntity.prototype, "approvedParticipants", void 0);
SessionEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'sessions' })
], SessionEntity);
exports.default = SessionEntity;
//# sourceMappingURL=session.enity.js.map