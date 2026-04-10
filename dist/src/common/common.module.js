"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonModule = void 0;
const common_1 = require("@nestjs/common");
const is_unique_restaurant_name_validator_1 = require("./validators/is-unique-restaurant-name.validator");
const global_exception_filter_1 = require("./filters/global-exception.filter");
const transform_interceptor_1 = require("./interceptors/transform.interceptor");
const logging_interceptor_1 = require("./interceptors/logging.interceptor");
let CommonModule = class CommonModule {
};
exports.CommonModule = CommonModule;
exports.CommonModule = CommonModule = __decorate([
    (0, common_1.Module)({
        providers: [
            is_unique_restaurant_name_validator_1.IsUniqueRestaurantNameConstraint,
            global_exception_filter_1.GlobalExceptionFilter,
            transform_interceptor_1.TransformInterceptor,
            logging_interceptor_1.LoggingInterceptor,
        ],
        exports: [
            is_unique_restaurant_name_validator_1.IsUniqueRestaurantNameConstraint,
            global_exception_filter_1.GlobalExceptionFilter,
            transform_interceptor_1.TransformInterceptor,
            logging_interceptor_1.LoggingInterceptor,
        ],
    })
], CommonModule);
//# sourceMappingURL=common.module.js.map