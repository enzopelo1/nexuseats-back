import { SetMetadata } from '@nestjs/common';

export const SKIP_TRANSFORM_KEY = 'skipTransform';

/** Réponse HTTP brute (CSV, binaire, etc.) sans enveloppe { success, data }. */
export const SkipTransform = () => SetMetadata(SKIP_TRANSFORM_KEY, true);
