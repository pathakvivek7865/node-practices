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
exports.IdeaEntity = void 0;
const typeorm_1 = require("typeorm");
let IdeaEntity = class IdeaEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], IdeaEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], IdeaEntity.prototype, "created", void 0);
__decorate([
    typeorm_1.Column('text'),
    __metadata("design:type", String)
], IdeaEntity.prototype, "idea", void 0);
__decorate([
    typeorm_1.Column('text'),
    __metadata("design:type", String)
], IdeaEntity.prototype, "description", void 0);
IdeaEntity = __decorate([
    typeorm_1.Entity()
], IdeaEntity);
exports.IdeaEntity = IdeaEntity;
//# sourceMappingURL=idea.entity.js.map