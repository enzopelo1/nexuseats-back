"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roles_guard_1 = require("./roles.guard");
const common_1 = require("@nestjs/common");
describe('RolesGuard', () => {
    let guard;
    let reflector;
    const mockExecutionContext = (roles, user) => {
        return {
            getHandler: () => ({}),
            getClass: () => ({}),
            switchToHttp: () => ({
                getRequest: () => ({ user }),
            }),
        };
    };
    beforeEach(() => {
        reflector = {
            getAllAndOverride: jest.fn(),
        };
        guard = new roles_guard_1.RolesGuard(reflector);
    });
    it('retourne true si aucune métadonnée @Roles (route publique)', () => {
        reflector.getAllAndOverride.mockReturnValue(undefined);
        const ctx = mockExecutionContext(undefined, undefined);
        expect(guard.canActivate(ctx)).toBe(true);
    });
    it('retourne true si l’utilisateur a un des rôles requis', () => {
        reflector.getAllAndOverride.mockReturnValue(['owner', 'admin']);
        const ctx = mockExecutionContext(['owner', 'admin'], { role: 'owner' });
        expect(guard.canActivate(ctx)).toBe(true);
    });
    it('lève ForbiddenException si aucun user dans la requête', () => {
        reflector.getAllAndOverride.mockReturnValue(['admin']);
        const ctx = mockExecutionContext(['admin'], undefined);
        expect(() => guard.canActivate(ctx)).toThrow(common_1.ForbiddenException);
    });
    it('lève ForbiddenException si rôle insuffisant', () => {
        reflector.getAllAndOverride.mockReturnValue(['admin']);
        const ctx = mockExecutionContext(['admin'], { role: 'customer' });
        expect(() => guard.canActivate(ctx)).toThrow(common_1.ForbiddenException);
    });
});
//# sourceMappingURL=roles.guard.spec.js.map