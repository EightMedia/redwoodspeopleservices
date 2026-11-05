import type { NextRequest } from 'next/server';
import { createRevalidateHandler } from '@eightmedia/kikker-next';

const handler = createRevalidateHandler({
  secret: process.env.SANITY_REVALIDATE_SECRET,
});

// While kikker-next is linked locally it types `NextRequest` from kikker-core's own copy of
// `next`, which the route validator rejects. The cast disappears with the published package.
export const POST = handler.POST as unknown as (request: NextRequest) => Promise<Response>;
