import 'server-only';
import { createDraftModeHandlers } from '@eightmedia/kikker-next';

import { client } from './live';

export const draftModeHandlers = createDraftModeHandlers({
  client,
  token: process.env.SANITY_API_READ_TOKEN ?? '',
});
