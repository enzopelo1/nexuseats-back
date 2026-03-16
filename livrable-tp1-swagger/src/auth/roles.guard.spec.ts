import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ForbiddenException } from '@nestjs/common';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const mockExecutionContext = (roles: string[] | undefined, user?: any) => {
    return {
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    } as any;
  };

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as any;

    guard = new RolesGuard(reflector);
  });

  it('retourne true si aucune métadonnée @Roles (route publique)', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(undefined);

    const ctx = mockExecutionContext(undefined, undefined);

    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('retourne true si l’utilisateur a un des rôles requis', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['owner', 'admin']);

    const ctx = mockExecutionContext(['owner', 'admin'], { role: 'owner' });

    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('lève ForbiddenException si aucun user dans la requête', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['admin']);

    const ctx = mockExecutionContext(['admin'], undefined);

    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('lève ForbiddenException si rôle insuffisant', () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['admin']);

    const ctx = mockExecutionContext(['admin'], { role: 'customer' });

    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });
});

