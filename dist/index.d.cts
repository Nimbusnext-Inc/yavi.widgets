import React from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';
import { S as SummaryWidgetProps, a as StreamingParams } from './types-DfKGVrNy.cjs';

/**
 * ChatBot Widget
 * A simple widget for managing chatbot interactions
 */
interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}
interface ChatBotConfig {
    title?: string;
    placeholder?: string;
    maxMessages?: number;
}
declare class ChatBot {
    private messages;
    private config;
    private messageId;
    constructor(config?: ChatBotConfig);
    addMessage(role: 'user' | 'assistant', content: string): ChatMessage;
    getMessages(): ChatMessage[];
    clearMessages(): void;
    getConfig(): ChatBotConfig;
}

declare const ChatWidget: React.FC<{
    title?: string;
    onMessage?: (msg: string) => void;
}>;

declare function SummaryWidget({ widgetId, token, apiBaseUrl, onTokenExpired, onError, className, position, launcherLabel, floatingWidth, floatingHeight, }: SummaryWidgetProps): react_jsx_runtime.JSX.Element;

interface UseStreamingSummaryOptions {
    onChunk?: (chunk: string) => void;
    onComplete?: (fullText: string) => void;
    onError?: (error: string) => void;
}
interface UseStreamingSummaryReturn {
    streamedText: string;
    isStreaming: boolean;
    error: string | null;
    startStreaming: (params: StreamingParams) => Promise<void>;
    abortStreaming: () => void;
    reset: () => void;
}
declare function useStreamingSummary(options?: UseStreamingSummaryOptions): UseStreamingSummaryReturn;

interface DataSourceConfigDetails$1 {
    namespace?: string;
    datasetId?: string;
    file_id?: string;
    sources?: Array<{
        document_id: string;
        [key: string]: any;
    }>;
    [key: string]: any;
}
interface DataSource$1 {
    selectedSource?: 'UnStructured' | 'Structured' | string;
    selectedfileId?: string;
    datasetId?: string;
    configdetails?: DataSourceConfigDetails$1;
    [key: string]: any;
}
interface QnaWidgetConfig {
    widget_title?: string;
    widget_description?: string;
    apiprompt?: string;
    dataSources?: DataSource$1[];
    allowModels?: string[];
    selectedFileIds?: string[];
    allowuserprompt?: boolean;
    allowDataSource?: boolean;
    allowFileUpload?: boolean;
    allowReferences?: boolean;
    buttoncolor?: string;
    backgroundcolor?: string;
    fontcolor?: string;
    fontSize?: number;
    questions?: string[];
    checkboxes?: Array<{
        label: string;
        checked: boolean;
    }>;
    workspaceId?: string;
    refreshToken?: string;
    topK?: number;
    temperature?: number;
    maxTokens?: number;
    [key: string]: any;
}
interface QnaStreamingParams {
    question: string;
    documentIds: string[];
    fileNameMap?: Record<string, string>;
    token: string;
    customPrompt?: string;
    yaviLlmConfigName?: string;
    streamUrl: string;
    sessionId: string;
    topK?: number;
    temperature?: number;
}
interface Reference {
    id?: number;
    source?: string;
    page?: number;
    content?: string;
    coords?: any;
    similarity_score?: number;
    chunk_id?: string;
    document_id?: string;
    filename?: string;
    metadata?: any;
    [key: string]: any;
}
interface FileAnswer {
    fileId: string;
    fileName: string;
    text: string;
    references: Reference[];
}
interface QnaWidgetProps {
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
     *   POST {apiBaseUrl}/qna-stream   ← SSE
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

declare function QnaWidget({ widgetId, token, apiBaseUrl, onTokenExpired, onError, className, position, launcherLabel, floatingWidth, floatingHeight, }: QnaWidgetProps): react_jsx_runtime.JSX.Element;

interface UseStreamingQnaOptions {
    onChunk?: (chunk: string) => void;
    onComplete?: (fullText: string) => void;
    onError?: (error: string) => void;
    onReferences?: (references: Reference[]) => void;
}
interface UseStreamingQnaReturn {
    streamedText: string;
    isStreaming: boolean;
    error: string | null;
    references: Reference[];
    startStreaming: (params: QnaStreamingParams) => Promise<void>;
    abortStreaming: () => void;
    reset: () => void;
}
declare function useStreamingQna(options?: UseStreamingQnaOptions): UseStreamingQnaReturn;

interface DataSourceConfigDetails {
    namespace?: string;
    datasetId?: string;
    file_id?: string;
    filename?: string;
    [key: string]: any;
}
interface DataSource {
    selectedSource?: 'UnStructured' | 'Structured' | string;
    selectedfileId?: string;
    datasetId?: string;
    filename?: string;
    configdetails?: DataSourceConfigDetails;
    [key: string]: any;
}
interface LinkedInPostWidgetConfig {
    widget_title?: string;
    widget_description?: string;
    dataSources?: DataSource[];
    allowModels?: string[] | string;
    selectedFileIds?: string[];
    workspaceId?: string;
    buttoncolor?: string;
    backgroundColor?: string;
    textColor?: string;
    cardStyle?: 'elevated' | 'flat' | 'outlined' | string;
    samplePost?: string;
    postType?: string;
    lengthTarget?: 'short' | 'medium' | 'long' | string;
    tone?: string;
    authorPersona?: string;
    audienceTarget?: string;
    contentFocus?: string;
    mandatoryHashtags?: string[];
    blockedHashtags?: string[];
    hashtagCount?: number;
    includeEmojis?: boolean;
    includeCallToAction?: boolean;
    customInstructions?: string;
    [key: string]: any;
}
interface LinkedInPostData {
    postContent: string;
    postType: string;
    lengthTarget: string;
    tone: string;
    characterCount: number;
    hashtags: string[];
    source?: {
        filename?: string;
        timestamp?: string;
    };
}
interface LinkedInPostGeneratorWidgetProps {
    widgetId: string;
    token: string;
    apiBaseUrl: string;
    onTokenExpired?: () => void;
    onError?: (error: string) => void;
    className?: string;
    position?: 'inline' | 'bottom-right';
    launcherLabel?: string;
    floatingWidth?: number | string;
    floatingHeight?: number | string;
}

declare function LinkedInPostGeneratorWidget({ widgetId, token, apiBaseUrl, onTokenExpired, onError, className, position, launcherLabel, floatingWidth, floatingHeight, }: LinkedInPostGeneratorWidgetProps): react_jsx_runtime.JSX.Element;

export { ChatBot, type ChatBotConfig, type ChatMessage, ChatWidget, type FileAnswer, type LinkedInPostData, LinkedInPostGeneratorWidget, type LinkedInPostGeneratorWidgetProps, type LinkedInPostWidgetConfig, QnaWidget, type QnaWidgetConfig, type QnaWidgetProps, type Reference, SummaryWidget, SummaryWidgetProps, ChatWidget as default, useStreamingQna, useStreamingSummary };
