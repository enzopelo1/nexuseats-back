import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Décorateur pour restreindre l'accès aux rôles fournis.
 * À utiliser avec RolesGuard.
 * @example @Roles('owner', 'admin')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
