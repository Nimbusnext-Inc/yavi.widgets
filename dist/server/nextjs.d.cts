import { Y as YaviServerConfig } from '../types-DfKGVrNy.cjs';

/**
 * @yavi/widgets/server/nextjs
 *
 * Drop-in Next.js App Router route handler.
 *
 * Usage (app/api/yavi/[...route]/route.ts):
 *
 *   import { createNextjsHandlers } from '@yavi/widgets/server/nextjs';
 *
 *   export const { GET, POST } = createNextjsHandlers();
 *   // No config needed — all defaults are built in.
 *
 * This wires up these internal routes automatically:
 *   GET  /api/yavi/widget/[id]
 *   POST /api/yavi/session
 *   GET  /api/yavi/namespaces/[workspaceId]
 *   POST /api/yavi/summary-stream   ← SSE
 *   POST /api/yavi/qna-chat
 *   POST /api/yavi/structured-chat
 */

declare function createNextjsHandlers(config?: YaviServerConfig): {
    GET: (request: Request) => Promise<Response>;
    POST: (request: Request) => Promise<Response>;
};

export { createNextjsHandlers };
