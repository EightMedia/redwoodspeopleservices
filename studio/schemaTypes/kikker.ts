import { createKikkerSanity } from '@eightmedia/kikker-sanity';

import config from '../kikker.config';

/** Bound Kikker helpers (`linkableTypes` and site name from `kikker.config.ts`). */
export const kikker = createKikkerSanity(config);
