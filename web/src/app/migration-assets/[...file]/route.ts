import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CONTENT_TYPES: Record<string, string> = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
};

/** `studio/migration-output/assets`, from `web/` (dev) or from the repository root. */
function assetDirs(): string[] {
  const cwd = process.cwd();
  return [
    path.resolve(cwd, '../studio/migration-output/assets'),
    path.resolve(cwd, 'studio/migration-output/assets'),
  ];
}

/**
 * Development only: serves the images that the migration dry run copied to
 * `studio/migration-output/assets/`, which the local asset documents reference as
 * `/migration-assets/<file>`. In production this route always answers 404.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ file: string[] }> }) {
  if (process.env.NODE_ENV === 'production') return new Response('Not found', { status: 404 });

  const { file } = await params;
  const segments = (file ?? []).map((s) => decodeURIComponent(s));
  if (segments.length === 0 || segments.some((s) => s === '' || s === '.' || s === '..' || s.includes('/') || s.includes('\\'))) {
    return new Response('Not found', { status: 404 });
  }

  for (const dir of assetDirs()) {
    const target = path.resolve(dir, ...segments);
    // Belt and braces: the resolved path must stay inside the assets folder.
    if (target !== dir && !target.startsWith(dir + path.sep)) continue;

    let info;
    try {
      // turbopackIgnore: the assets folder lives outside `web/` and must not be traced.
      info = await stat(/* turbopackIgnore: true */ target);
    } catch {
      continue;
    }
    if (!info.isFile()) continue;

    const type = CONTENT_TYPES[path.extname(target).toLowerCase()] ?? 'application/octet-stream';
    const stream = Readable.toWeb(
      createReadStream(/* turbopackIgnore: true */ target),
    ) as ReadableStream;
    return new Response(stream, {
      status: 200,
      headers: {
        'content-type': type,
        'content-length': String(info.size),
        'cache-control': 'no-cache',
      },
    });
  }

  return new Response('Not found', { status: 404 });
}
