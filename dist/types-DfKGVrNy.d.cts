interface StreamingParams {
    documentIds: string[];
    token: string;
    customPrompt?: string;
    yaviLlmConfigName?: string;
    separate?: boolean;
    fileNameMap?: Record<string, string>;
    streamUrl: string;
}
interface SummaryWidgetProps {
    /**
     * Widget ID from the YAVI dashboard.
     */
    widgetId: string;
    /**
     * Valid Bearer access token (Keycloak / OIDC).
     * The consumer is responsible for refreshing it.
     */
    token: string;
    /**
     * Base URL of the consumer's backend that exposes the YAVI proxy routes.
     *
     * Required routes (auto-wired by createNextjsHandlers / createExpressRouter):
     *   GET  {apiBaseUrl}/widget/:id
     *   POST {apiBaseUrl}/session
     *   GET  {apiBaseUrl}/namespaces/:workspaceId
     *   POST {apiBaseUrl}/summary-stream   ← SSE
     *
     * @example "/api/yavi"  (Next.js)
     * @example "http://localhost:3001/api/yavi"  (Express)
     */
    apiBaseUrl: string;
    /** Called when the token is rejected (401) so the consumer can refresh. */
    onTokenExpired?: () => void;
    /** Called on any non-recoverable error. */
    onError?: (error: string) => void;
    /** Optional CSS class on the root container. */
    className?: string;
    /** Render mode. Use `bottom-right` for floating launcher behavior. */
    position?: 'inline' | 'bottom-right';
    /** Launcher button label shown when collapsed in bottom-right mode. */
    launcherLabel?: string;
    /** Optional floating panel width (number = px, string = any CSS unit). */
    floatingWidth?: number | string;
    /** Optional floating panel height (number = px, string = any CSS unit). */
    floatingHeight?: number | string;
}
interface YaviServerConfig {
    /** YAVI RAG backend — defaults to https://apirag.dev5.yavi.ai */
    yaviRagUrl?: string;
    /** YAVI structured-data backend — defaults to https://apirag.dev5.yavi.ai/structured-json-rag */
    yaviStructuredUrl?: string;
    /** MongoDB connection URI — defaults to the YAVI shared cluster */
    mongoUri?: string;
    /** Default LLM config name — defaults to 'gpt-4o-mini' */
    defaultLlmConfig?: string;
}

export type { SummaryWidgetProps as S, YaviServerConfig as Y, StreamingParams as a };
