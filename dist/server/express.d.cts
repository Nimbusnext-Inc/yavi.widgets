import { Router } from 'express';
import { Y as YaviServerConfig } from '../types-DfKGVrNy.cjs';

/**
 * @yavi/widgets/server/express
 *
 * Drop-in Express router.
 *
 * Usage (server.ts / server.js):
 *
 *   import express from 'express';
 *   import { createExpressRouter } from '@yavi/widgets/server/express';
 *
 *   const app = express();
 *   app.use(express.json());
 *   app.use('/api/yavi', createExpressRouter());
 *   // No config needed — all defaults are built in.
 *
 * Wires up:
 *   GET  /api/yavi/widget/:id
 *   POST /api/yavi/session
 *   GET  /api/yavi/namespaces/:workspaceId
 *   POST /api/yavi/summary-stream   ← SSE
 *   POST /api/yavi/qna-chat
 *   POST /api/yavi/structured-chat
 */

declare function createExpressRouter(config?: YaviServerConfig): Router;

export { createExpressRouter };
