"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicIp = void 0;
const tslib_1 = require("tslib");
const warthog_1 = require("warthog");
let PublicIp = class PublicIp extends warthog_1.BaseModel {
    constructor(init) {
        super();
        Object.assign(this, init);
    }
};
tslib_1.__decorate([
    warthog_1.IntField({}),
    tslib_1.__metadata("design:type", Number)
], PublicIp.prototype, "farmId", void 0);
tslib_1.__decorate([
    warthog_1.StringField({}),
    tslib_1.__metadata("design:type", String)
], PublicIp.prototype, "ip", void 0);
tslib_1.__decorate([
    warthog_1.IntField({}),
    tslib_1.__metadata("design:type", Number)
], PublicIp.prototype, "workloadId", void 0);
PublicIp = tslib_1.__decorate([
    warthog_1.Model({ api: {} }),
    tslib_1.__metadata("design:paramtypes", [Object])
], PublicIp);
exports.PublicIp = PublicIp;
