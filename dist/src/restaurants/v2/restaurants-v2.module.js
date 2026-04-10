"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantsV2Module = void 0;
const common_1 = require("@nestjs/common");
const restaurants_v2_service_1 = require("./restaurants-v2.service");
const restaurants_v2_controller_1 = require("./restaurants-v2.controller");
const auth_module_1 = require("../../auth/auth.module");
let RestaurantsV2Module = class RestaurantsV2Module {
};
exports.RestaurantsV2Module = RestaurantsV2Module;
exports.RestaurantsV2Module = RestaurantsV2Module = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        controllers: [restaurants_v2_controller_1.RestaurantsV2Controller],
        providers: [restaurants_v2_service_1.RestaurantsV2Service],
        exports: [restaurants_v2_service_1.RestaurantsV2Service],
    })
], RestaurantsV2Module);
//# sourceMappingURL=restaurants-v2.module.js.map