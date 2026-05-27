"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ChatBot: () => ChatBot,
  ChatWidget: () => ChatWidget,
  LinkedInPostGeneratorWidget: () => LinkedInPostGeneratorWidget,
  QnaWidget: () => QnaWidget,
  SummaryWidget: () => SummaryWidget,
  default: () => ChatWidget,
  useStreamingQna: () => useStreamingQna,
  useStreamingSummary: () => useStreamingSummary
});
module.exports = __toCommonJS(index_exports);

// src/widgets/chatbot/chatbot.ts
var ChatBot = class {
  constructor(config = {}) {
    this.messages = [];
    this.messageId = 0;
    this.config = {
      title: "Chat",
      placeholder: "Type a message...",
      maxMessages: 100,
      ...config
    };
  }
  addMessage(role, content) {
    const message = {
      id: `msg-${++this.messageId}`,
      role,
      content,
      timestamp: /* @__PURE__ */ new Date()
    };
    this.messages.push(message);
    if (this.messages.length > this.config.maxMessages) {
      this.messages.shift();
    }
    return message;
  }
  getMessages() {
    return [...this.messages];
  }
  clearMessages() {
    this.messages = [];
  }
  getConfig() {
    return { ...this.config };
  }
};

// src/widgets/chatbot/components/chatbox.ts
var ChatBox = class {
  constructor(props) {
    this.container = null;
    this.props = props;
  }
  render(container) {
    this.container = container;
    this.container.innerHTML = `
      <div class="chatbox">
        <div class="chatbox-header">
          <h3>${this.props.title}</h3>
        </div>
        <div class="chatbox-messages"></div>
        <div class="chatbox-input">
          <input 
            type="text" 
            class="chatbox-input-field" 
            placeholder="${this.props.placeholder}"
            aria-label="Chat message input"
          />
          <button class="chatbox-send-btn" aria-label="Send message">Send</button>
        </div>
      </div>
    `;
    this.attachEventListeners();
  }
  attachEventListeners() {
    const input = this.container?.querySelector(".chatbox-input-field");
    const button = this.container?.querySelector(".chatbox-send-btn");
    const sendMessage = () => {
      if (input.value.trim()) {
        this.props.onSend(input.value);
        input.value = "";
        input.focus();
      }
    };
    button?.addEventListener("click", sendMessage);
    input?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    });
  }
};

// src/widgets/chatbot/ChatWidget.tsx
var import_react = require("react");

// #style-inject:#style-inject
function styleInject(css, { insertAt } = {}) {
  if (!css || typeof document === "undefined") return;
  const head = document.head || document.getElementsByTagName("head")[0];
  const style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

// src/widgets/chatbot/styles/chatbot.css
styleInject('.chatbox {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  max-width: 500px;\n  border: 1px solid #e0e0e0;\n  border-radius: 8px;\n  background-color: #fff;\n  font-family:\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    Roboto,\n    Oxygen,\n    Ubuntu,\n    Cantarell,\n    sans-serif;\n}\n.chatbox-header {\n  padding: 16px;\n  border-bottom: 1px solid #e0e0e0;\n  background-color: #f5f5f5;\n}\n.chatbox-header h3 {\n  margin: 0;\n  font-size: 16px;\n  font-weight: 600;\n  color: #333;\n}\n.chatbox-messages {\n  flex: 1;\n  overflow-y: auto;\n  padding: 16px;\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.chatbox-message {\n  display: flex;\n  gap: 8px;\n}\n.chatbox-message.user {\n  justify-content: flex-end;\n}\n.chatbox-message.assistant {\n  justify-content: flex-start;\n}\n.chatbox-message-content {\n  max-width: 70%;\n  padding: 8px 12px;\n  border-radius: 8px;\n  font-size: 14px;\n  line-height: 1.4;\n  word-wrap: break-word;\n}\n.chatbox-message.user .chatbox-message-content {\n  background-color: #007bff;\n  color: white;\n}\n.chatbox-message.assistant .chatbox-message-content {\n  background-color: #e9ecef;\n  color: #333;\n}\n.chatbox-input {\n  display: flex;\n  gap: 8px;\n  padding: 12px;\n  border-top: 1px solid #e0e0e0;\n  background-color: #f9f9f9;\n}\n.chatbox-input-field {\n  flex: 1;\n  padding: 8px 12px;\n  border: 1px solid #d0d0d0;\n  border-radius: 4px;\n  font-size: 14px;\n  font-family: inherit;\n}\n.chatbox-input-field:focus {\n  outline: none;\n  border-color: #007bff;\n  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);\n}\n.chatbox-send-btn {\n  padding: 8px 16px;\n  background-color: #007bff;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: background-color 0.2s;\n}\n.chatbox-send-btn:hover {\n  background-color: #0056b3;\n}\n.chatbox-send-btn:active {\n  background-color: #004085;\n}\n.chatbox-send-btn:disabled {\n  background-color: #6c757d;\n  cursor: not-allowed;\n}\n');

// src/widgets/chatbot/ChatWidget.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var ChatWidget = ({ title = "Chat", onMessage }) => {
  const containerRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    if (!containerRef.current) return;
    const bot = new ChatBot({ title });
    const chatBox = new ChatBox({
      title,
      placeholder: "Type...",
      onSend: (message) => onMessage?.(message)
    });
    chatBox.render(containerRef.current);
  }, [title, onMessage]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: containerRef });
};

// src/widgets/summary/SummaryWidget.tsx
var import_react4 = require("react");

// src/widgets/summary/api.ts
var import_jwt_decode = require("jwt-decode");
async function fetchWidgetConfig(apiBaseUrl, widgetId, token) {
  const res = await fetch(`${apiBaseUrl}/widget/${widgetId}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store"
  });
  if (!res.ok) throw new Error(`Widget fetch failed: ${res.status}`);
  const data = await res.json();
  return data.widget ?? data;
}
function isKeycloakToken(token) {
  return "sub" in token && "azp" in token;
}
function isCustomJWTToken(token) {
  return "user_id" in token && "token_type" in token;
}
async function getServerUserIdFromAccessToken(accessToken) {
  try {
    const decoded = (0, import_jwt_decode.jwtDecode)(accessToken);
    if (isKeycloakToken(decoded)) {
      return decoded.sub;
    }
    if (isCustomJWTToken(decoded)) {
      return decoded.user_id;
    }
    return null;
  } catch (error) {
    console.error("Error decoding access token for user ID:", error);
    return null;
  }
}
async function createRagSession(apiBaseUrl, token, yaviLlmConfigName) {
  console.warn("Creating RAG session with token:", token);
  let userId = await getServerUserIdFromAccessToken(token);
  const res = await fetch(`${apiBaseUrl}/proxy/rag/rag/api/v2/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      bot_mode: "standard_v2",
      yavi_llm_config_name: "gpt-4o-mini",
      yavi_embedding_config_name: "azure-embedding-small",
      llm_parameters: {
        frequency_penalty: 0,
        presence_penalty: 0,
        temperature: 0.7,
        max_tokens: 2e3,
        top_p: 1
      },
      user_id: userId
    })
  });
  if (!res.ok) throw new Error(`Session creation failed: ${res.status}`);
  return res.json();
}
async function createStructuredSession(apiBaseUrl, token, datasetId, yaviLlmConfigName) {
  const res = await fetch(`${apiBaseUrl}/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      type: "structured",
      datasetId,
      yaviLlmConfigName
    })
  });
  if (!res.ok) throw new Error(`Structured session failed: ${res.status}`);
  return res.json();
}
async function fetchNamespaces(apiBaseUrl, workspaceId, token) {
  const res = await fetch(`${apiBaseUrl}/namespaces/${workspaceId}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store"
  });
  if (!res.ok) throw new Error(`Namespaces fetch failed: ${res.status}`);
  return res.json();
}
async function queryStructuredSummary(apiBaseUrl, token, sessionId, prompt) {
  const finalPrompt = prompt?.trim() || "summary:";
  const res = await fetch(`${apiBaseUrl}/structured-chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ sessionId, prompt: finalPrompt })
  });
  if (!res.ok) throw new Error(`Structured chat failed: ${res.status}`);
  const data = await res.json();
  return data.answer ?? data.explanation ?? "";
}
function buildFileIdToDocumentIdMap(availableFiles) {
  const map = {};
  availableFiles.forEach((f) => {
    map[f.file_id] = f.document_id ?? f.file_id;
  });
  return map;
}
function resolveDocumentIds(selectedFileIds, availableFiles) {
  const fileIdToDocId = buildFileIdToDocumentIdMap(availableFiles);
  if (selectedFileIds.length > 0) {
    return selectedFileIds.map((fileId) => fileIdToDocId[fileId]).filter(Boolean);
  }
  return availableFiles.map((f) => f.document_id ?? f.file_id).filter(Boolean);
}
function buildFileNameMap(availableFiles) {
  const map = {};
  availableFiles.forEach((f, index) => {
    const displayName = f.originalName ?? f.fileName ?? `Document ${index + 1}`;
    const docId = f.document_id ?? f.file_id;
    map[docId] = displayName;
  });
  return map;
}

// src/widgets/shared/FileSelectorDropdown.tsx
var import_react2 = require("react");

// src/widgets/shared/file-selector-dropdown.css
styleInject(".yw-dropdown {\n  position: relative;\n}\n.yw-dropdown-trigger {\n  width: 100%;\n  padding: 8px 12px;\n  font-size: 0.875rem;\n  background: #ffffff;\n  border: 1px solid #d1d5db;\n  border-radius: 6px;\n  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  transition: background 0.15s, border-color 0.15s;\n  color: #374151;\n  font-weight: 400;\n}\n.yw-dropdown-trigger:hover {\n  background: #f9fafb;\n  border-color: #9ca3af;\n}\n.yw-dropdown-trigger:focus {\n  outline: none;\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);\n}\n.yw-dropdown-trigger:disabled {\n  cursor: not-allowed;\n  opacity: 0.75;\n}\n.yw-dropdown-menu {\n  position: absolute;\n  right: 0;\n  top: calc(100% + 4px);\n  width: 384px;\n  background: #ffffff;\n  border: 1px solid #e5e7eb;\n  border-radius: 6px;\n  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);\n  z-index: 50;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n.yw-dropdown-item {\n  padding: 8px 12px;\n  border-bottom: 1px solid #f3f4f6;\n  cursor: pointer;\n  display: flex;\n  align-items: flex-start;\n  gap: 8px;\n  transition: background-color 0.1s;\n}\n.yw-dropdown-item:hover {\n  background: #f9fafb;\n}\n.yw-dropdown-item:last-child {\n  border-bottom: none;\n}\n.yw-dropdown-item--header {\n  border-bottom: 1px solid #e5e7eb;\n  background: #ffffff;\n}\n.yw-dropdown-item--header:hover {\n  background: #f9fafb;\n}\n.yw-dropdown-selectall {\n  font-size: 0.875rem;\n  font-weight: 600;\n  color: #2563eb;\n}\n.yw-dropdown-list {\n  overflow: visible;\n}\n.yw-dropdown-list--scroll {\n  max-height: 280px;\n  overflow-y: auto;\n  scrollbar-width: thin;\n  scrollbar-color: #cbd5e1 #f8fafc;\n}\n.yw-dropdown-file {\n  flex: 1;\n  min-width: 0;\n}\n.yw-dropdown-filename {\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: #111827;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.yw-dropdown-filemeta {\n  font-size: 0.75rem;\n  color: #6b7280;\n  margin-top: 2px;\n}\n.yw-dropdown-footer {\n  padding: 12px;\n  border-top: 1px solid #e5e7eb;\n  background: #f9fafb;\n  flex-shrink: 0;\n}\n.yw-dropdown-mode-label {\n  font-size: 0.75rem;\n  font-weight: 600;\n  color: #374151;\n  margin-bottom: 8px;\n  display: block;\n}\n.yw-dropdown-mode-options {\n  display: flex;\n  gap: 12px;\n}\n.yw-radio-label {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  cursor: pointer;\n  font-size: 0.75rem;\n  color: #374151;\n  font-weight: 400;\n}\n.yw-dropdown-note {\n  padding: 8px 12px;\n  border-top: 1px solid #e5e7eb;\n  font-size: 0.75rem;\n  color: #374151;\n  background: #ffffff;\n  flex-shrink: 0;\n  line-height: 1.5;\n}\n.yw-dropdown-note-bold {\n  font-weight: 700;\n  color: #111827;\n}\n.yw-checkbox,\n.yw-radio {\n  width: 16px;\n  height: 16px;\n  accent-color: #2563eb;\n  cursor: pointer;\n  flex-shrink: 0;\n  margin-top: 1px;\n}\n");

// src/widgets/shared/FileSelectorDropdown.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var ChevronDownIcon = ({ open }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
  "svg",
  {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: { transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" },
    children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("polyline", { points: "6 9 12 15 18 9" })
  }
);
function getFileId(file) {
  return file.file_id ?? file.document_id ?? null;
}
function FileSelectorDropdown({
  files,
  selectedIds,
  onChange,
  isLoading = false,
  loadingLabel = "Loading files...",
  emptyLabel = "No files found",
  mode,
  onModeChange,
  showNoSelectionNote = true
}) {
  const [open, setOpen] = (0, import_react2.useState)(false);
  const ref = (0, import_react2.useRef)(null);
  (0, import_react2.useEffect)(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const fileIds = files.map(getFileId).filter((id) => Boolean(id));
  const toggleFile = (id) => {
    onChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);
  };
  const toggleAll = () => {
    const allSelected2 = fileIds.length > 0 && fileIds.every((id) => selectedIds.includes(id));
    onChange(allSelected2 ? [] : fileIds);
  };
  const allSelected = fileIds.length > 0 && fileIds.every((id) => selectedIds.includes(id));
  const canOpen = !isLoading && files.length > 0;
  const shouldShowMode = Boolean(mode && onModeChange) && (allSelected || selectedIds.length > 1) && files.length > 1;
  const label = isLoading ? loadingLabel : files.length === 0 ? emptyLabel : selectedIds.length === 0 ? "All files" : `${selectedIds.length} file${selectedIds.length !== 1 ? "s" : ""} selected`;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "yw-dropdown", ref, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
      "button",
      {
        className: "yw-dropdown-trigger",
        onClick: () => canOpen && setOpen(!open),
        disabled: !canOpen,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: label }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ChevronDownIcon, { open })
        ]
      }
    ),
    open && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "yw-dropdown-menu", onMouseDown: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "yw-dropdown-item yw-dropdown-item--header", onClick: toggleAll, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "input",
          {
            type: "checkbox",
            checked: allSelected,
            onChange: toggleAll,
            onClick: (e) => e.stopPropagation(),
            className: "yw-checkbox"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "yw-dropdown-selectall", children: "Select All" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: `yw-dropdown-list${files.length > 3 ? " yw-dropdown-list--scroll" : ""}`, children: files.map((f, index) => {
        const fileId = getFileId(f);
        if (!fileId) return null;
        return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "yw-dropdown-item", onClick: () => toggleFile(fileId), children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "input",
            {
              type: "checkbox",
              checked: selectedIds.includes(fileId),
              onChange: () => toggleFile(fileId),
              onClick: (e) => e.stopPropagation(),
              className: "yw-checkbox"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "yw-dropdown-file", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "yw-dropdown-filename", children: f.originalName ?? f.fileName ?? fileId }),
            f.pages != null && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "yw-dropdown-filemeta", children: [
              f.pages,
              " page",
              f.pages !== 1 ? "s" : "",
              " \u2022 ",
              ((f.fileSize ?? 0) / 1024).toFixed(2),
              " KB"
            ] })
          ] })
        ] }, fileId || index);
      }) }),
      shouldShowMode && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "yw-dropdown-footer", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "yw-dropdown-mode-label", children: "Summary Mode" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "yw-dropdown-mode-options", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { className: "yw-radio-label", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "input",
              {
                type: "radio",
                value: "combine",
                checked: mode === "combine",
                onChange: () => onModeChange?.("combine"),
                className: "yw-radio"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: "Combine" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { className: "yw-radio-label", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "input",
              {
                type: "radio",
                value: "separate",
                checked: mode === "separate",
                onChange: () => onModeChange?.("separate"),
                className: "yw-radio"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: "Separate" })
          ] })
        ] })
      ] }),
      showNoSelectionNote && selectedIds.length === 0 && files.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "yw-dropdown-note", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "yw-dropdown-note-bold", children: "Note:" }),
        " No files selected. All files will be used by default."
      ] })
    ] })
  ] });
}

// src/widgets/summary/useStreamingSummary.ts
var import_react3 = require("react");
function useStreamingSummary(options) {
  const [streamedText, setStreamedText] = (0, import_react3.useState)("");
  const [isStreaming, setIsStreaming] = (0, import_react3.useState)(false);
  const [error, setError] = (0, import_react3.useState)(null);
  const abortControllerRef = (0, import_react3.useRef)(null);
  const accumulatedRef = (0, import_react3.useRef)("");
  const rafIdRef = (0, import_react3.useRef)(null);
  const reset = (0, import_react3.useCallback)(() => {
    setStreamedText("");
    setError(null);
    setIsStreaming(false);
    accumulatedRef.current = "";
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);
  const abortStreaming = (0, import_react3.useCallback)(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    setIsStreaming(false);
  }, []);
  const scheduleUpdate = (0, import_react3.useCallback)(() => {
    if (rafIdRef.current !== null) return;
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      setStreamedText(accumulatedRef.current);
    });
  }, []);
  const startStreaming = (0, import_react3.useCallback)(
    async (params) => {
      const {
        documentIds,
        token,
        customPrompt,
        yaviLlmConfigName,
        separate,
        fileNameMap,
        streamUrl
      } = params;
      accumulatedRef.current = "";
      setStreamedText("");
      setError(null);
      setIsStreaming(true);
      const controller = new AbortController();
      abortControllerRef.current = controller;
      try {
        const res = await fetch(streamUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            documentIds,
            customPrompt,
            yaviLlmConfigName,
            separate
          }),
          signal: controller.signal
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          const msg = errData?.error ?? `Request failed (${res.status})`;
          setError(msg);
          setIsStreaming(false);
          options?.onError?.(msg);
          return;
        }
        const reader = res.body?.getReader();
        if (!reader) {
          const msg = "No response body from stream endpoint";
          setError(msg);
          setIsStreaming(false);
          options?.onError?.(msg);
          return;
        }
        const decoder = new TextDecoder();
        let buffer = "";
        if (separate) {
          const documentOrder = [];
          const documentContent = {};
          const rebuildOutput = () => {
            let output = "";
            for (let i = 0; i < documentOrder.length; i++) {
              const docId = documentOrder[i];
              const name = fileNameMap?.[docId] ?? `Document ${i + 1}`;
              if (i > 0) output += "\n\n---\n\n";
              output += `### \u{1F4C4} ${name}

`;
              output += documentContent[docId] ?? "";
            }
            accumulatedRef.current = output;
            scheduleUpdate();
            options?.onChunk?.(output);
          };
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith("data: ")) continue;
              const data = trimmed.slice(6).trim();
              if (!data || data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                if (parsed.type === "document_start") {
                  const id = parsed.document_id;
                  if (!documentOrder.includes(id)) {
                    documentOrder.push(id);
                    documentContent[id] = "";
                  }
                  rebuildOutput();
                } else if (parsed.type === "document_chunk") {
                  const id = parsed.document_id;
                  if (!documentOrder.includes(id)) {
                    documentOrder.push(id);
                    documentContent[id] = "";
                  }
                  if (parsed.content) {
                    documentContent[id] += parsed.content;
                    rebuildOutput();
                  }
                } else if (parsed.type === "document_complete") {
                  const id = parsed.document_id;
                  if (parsed.final_summary) {
                    documentContent[id] = parsed.final_summary;
                    rebuildOutput();
                  }
                }
                if (parsed.error) {
                  setError(parsed.error);
                  options?.onError?.(parsed.error);
                }
              } catch {
              }
            }
          }
        } else {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith("data: ")) continue;
              const data = trimmed.slice(6).trim();
              if (!data || data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                if (typeof parsed.content === "string") {
                  accumulatedRef.current += parsed.content;
                  scheduleUpdate();
                  options?.onChunk?.(parsed.content);
                }
                if (parsed.error) {
                  setError(parsed.error);
                  options?.onError?.(parsed.error);
                }
              } catch {
              }
            }
          }
        }
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
        setStreamedText(accumulatedRef.current);
        options?.onComplete?.(accumulatedRef.current);
      } catch (err) {
        if (err?.name === "AbortError") {
          return;
        }
        const msg = err?.message ?? "Streaming failed";
        console.error("[SummaryWidget] streaming error:", msg);
        setError(msg);
        options?.onError?.(msg);
      } finally {
        setIsStreaming(false);
      }
    },
    [scheduleUpdate, options]
  );
  return { streamedText, isStreaming, error, startStreaming, abortStreaming, reset };
}

// src/widgets/summary/summary.css
styleInject('.yw-root {\n  font-family:\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    "Roboto",\n    "Oxygen",\n    "Ubuntu",\n    "Cantarell",\n    sans-serif;\n  font-size: 16px;\n  color: #111827;\n  background: #ffffff;\n  padding: 24px;\n  border-radius: 8px;\n}\n.yw-topbar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 16px;\n  padding: 0 0 16px 0;\n  border-bottom: 1px solid #e5e7eb;\n  margin-bottom: 16px;\n}\n.yw-topbar-left {\n  flex: 1;\n  min-width: 0;\n}\n.yw-topbar-right {\n  flex-shrink: 0;\n  width: 340px;\n}\n.yw-title {\n  margin: 0;\n  font-size: 1.5rem;\n  font-weight: 600;\n  color: #111827;\n  letter-spacing: -0.2px;\n}\n.yw-dropdown {\n  position: relative;\n}\n.yw-dropdown-trigger {\n  width: 100%;\n  padding: 8px 12px;\n  font-size: 0.875rem;\n  background: #ffffff;\n  border: 1px solid #d1d5db;\n  border-radius: 6px;\n  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  transition: background 0.15s, border-color 0.15s;\n  color: #374151;\n  font-weight: 400;\n}\n.yw-dropdown-trigger:hover {\n  background: #f9fafb;\n  border-color: #9ca3af;\n}\n.yw-dropdown-trigger:focus {\n  outline: none;\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);\n}\n.yw-dropdown-menu {\n  position: absolute;\n  right: 0;\n  top: calc(100% + 4px);\n  width: 384px;\n  background: #ffffff;\n  border: 1px solid #e5e7eb;\n  border-radius: 6px;\n  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);\n  z-index: 50;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n.yw-dropdown-item {\n  padding: 8px 12px;\n  border-bottom: 1px solid #f3f4f6;\n  cursor: pointer;\n  display: flex;\n  align-items: flex-start;\n  gap: 8px;\n  transition: background-color 0.1s;\n}\n.yw-dropdown-item:hover {\n  background: #f9fafb;\n}\n.yw-dropdown-item:last-child {\n  border-bottom: none;\n}\n.yw-dropdown-item--header {\n  border-bottom: 1px solid #e5e7eb;\n  background: #ffffff;\n}\n.yw-dropdown-item--header:hover {\n  background: #f9fafb;\n}\n.yw-dropdown-selectall {\n  font-size: 0.875rem;\n  font-weight: 600;\n  color: #2563eb;\n}\n.yw-dropdown-list {\n  overflow: visible;\n}\n.yw-dropdown-list--scroll {\n  max-height: 280px;\n  overflow-y: auto;\n  scrollbar-width: thin;\n  scrollbar-color: #cbd5e1 #f8fafc;\n}\n.yw-dropdown-file {\n  flex: 1;\n  min-width: 0;\n}\n.yw-dropdown-filename {\n  font-size: 0.875rem;\n  font-weight: 500;\n  color: #111827;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.yw-dropdown-filemeta {\n  font-size: 0.75rem;\n  color: #6b7280;\n  margin-top: 2px;\n}\n.yw-dropdown-footer {\n  padding: 12px;\n  border-top: 1px solid #e5e7eb;\n  background: #f9fafb;\n  flex-shrink: 0;\n}\n.yw-dropdown-mode-label {\n  font-size: 0.75rem;\n  font-weight: 600;\n  color: #374151;\n  margin-bottom: 8px;\n  display: block;\n}\n.yw-dropdown-mode-options {\n  display: flex;\n  gap: 12px;\n}\n.yw-radio-label {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  cursor: pointer;\n  font-size: 0.75rem;\n  color: #374151;\n  font-weight: 400;\n}\n.yw-dropdown-note {\n  padding: 8px 12px;\n  border-top: 1px solid #e5e7eb;\n  font-size: 0.75rem;\n  color: #374151;\n  background: #ffffff;\n  flex-shrink: 0;\n  line-height: 1.5;\n}\n.yw-dropdown-note-bold {\n  font-weight: 700;\n  color: #111827;\n}\n.yw-checkbox,\n.yw-radio {\n  width: 16px;\n  height: 16px;\n  accent-color: #2563eb;\n  cursor: pointer;\n  flex-shrink: 0;\n  margin-top: 1px;\n}\n.yw-generating {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 12px;\n  background: #f9fafb;\n  border-radius: 6px;\n  padding: 20px;\n  margin-top: 12px;\n  border: 1px solid #e5e7eb;\n}\n.yw-generating-text {\n  font-size: 0.875rem;\n  color: #6b7280;\n  margin: 0;\n  font-weight: 400;\n}\n.yw-output-wrap {\n  border: 1px solid #e5e7eb;\n  border-radius: 10px;\n  margin-top: 12px;\n  padding: 12px;\n  background: #ffffff;\n  overflow: hidden;\n}\n.yw-output-actions {\n  display: flex;\n  justify-content: flex-end;\n  gap: 6px;\n  margin-bottom: 6px;\n}\n.yw-icon-btn {\n  background: none;\n  border: 1px solid #e5e7eb;\n  padding: 6px;\n  cursor: pointer;\n  color: #6b7280;\n  border-radius: 6px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: background 0.15s, color 0.15s;\n  line-height: 1;\n}\n.yw-icon-btn:hover {\n  color: #111827;\n  background: #f3f4f6;\n  border-color: #d1d5db;\n}\n.yw-prose {\n  font-size: 0.95rem;\n  line-height: 1.8;\n  color: #334155;\n  min-height: 100px;\n}\n.yw-prose h1 {\n  font-size: 1.75rem;\n  font-weight: 800;\n  margin: 24px 0 12px;\n  color: #0f172a;\n}\n.yw-prose h2 {\n  font-size: 1.4rem;\n  font-weight: 700;\n  margin: 20px 0 10px;\n  color: #1e293b;\n}\n.yw-prose h3 {\n  font-size: 1.2rem;\n  font-weight: 700;\n  margin: 16px 0 8px;\n  color: #334155;\n}\n.yw-prose h4 {\n  font-size: 1.05rem;\n  font-weight: 700;\n  margin: 14px 0 6px;\n  color: #475569;\n}\n.yw-prose h5 {\n  font-size: 0.95rem;\n  font-weight: 700;\n  margin: 12px 0 4px;\n  color: #475569;\n}\n.yw-prose p {\n  margin: 6px 0;\n}\n.yw-prose ul {\n  list-style: disc;\n  padding-left: 28px;\n  margin: 6px 0;\n}\n.yw-prose ol {\n  list-style: decimal;\n  padding-left: 28px;\n  margin: 6px 0;\n}\n.yw-prose li {\n  margin: 4px 0;\n  line-height: 1.6;\n}\n.yw-prose hr {\n  border: none;\n  border-top: 2px solid #e2e8f0;\n  margin: 20px 0;\n}\n.yw-prose strong {\n  font-weight: 700;\n  color: #0f172a;\n}\n.yw-prose em {\n  font-style: italic;\n  color: #475569;\n}\n.yw-prose code {\n  font-family:\n    "Monaco",\n    "Menlo",\n    "Consolas",\n    monospace;\n  font-size: 0.88em;\n  background: #f1f5f9;\n  padding: 2px 6px;\n  border-radius: 4px;\n  color: #dc2626;\n}\n.yw-streaming-cursor {\n  display: inline-block;\n  width: 10px;\n  height: 18px;\n  margin-left: 4px;\n  background: #2563eb;\n  border-radius: 2px;\n  vertical-align: middle;\n  animation: blink 1s step-end infinite;\n}\n@keyframes blink {\n  0%, 100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.3;\n  }\n}\n.yw-bottom-bar {\n  margin-top: 20px;\n  padding-top: 16px;\n  border-top: 1px solid #e5e7eb;\n}\n.yw-instructions-wrap {\n  margin-bottom: 18px;\n}\n.yw-input-label {\n  display: block;\n  font-size: 0.75rem;\n  font-weight: 600;\n  color: #374151;\n  margin-bottom: 6px;\n  text-transform: uppercase;\n  letter-spacing: 0.4px;\n}\n.yw-prompt-input {\n  width: 100%;\n  font-family: inherit;\n  font-size: 0.875rem;\n  padding: 10px 12px;\n  border: 1px solid #d1d5db;\n  border-radius: 6px;\n  background: #ffffff;\n  color: #111827;\n  resize: vertical;\n  min-height: 80px;\n  box-sizing: border-box;\n  transition: border-color 0.15s, box-shadow 0.15s;\n  line-height: 1.5;\n}\n.yw-prompt-input:focus {\n  outline: none;\n  border-color: #2563eb;\n  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);\n}\n.yw-char-count {\n  display: flex;\n  justify-content: flex-end;\n  margin-top: 6px;\n  font-size: 0.8rem;\n  color: #64748b;\n  font-weight: 500;\n}\n.yw-generate-row {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 10px;\n  margin-top: 12px;\n}\n.yw-model-select {\n  font-size: 0.875rem;\n  padding: 8px 10px;\n  border: 1px solid #d1d5db;\n  border-radius: 6px;\n  background: #ffffff;\n  color: #374151;\n  cursor: pointer;\n  min-width: 130px;\n  transition: border-color 0.15s;\n}\n.yw-model-select:hover {\n  border-color: #9ca3af;\n  background: #f9fafb;\n}\n.yw-model-select:focus {\n  outline: none;\n  border-color: #2563eb;\n  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);\n}\n.yw-btn {\n  padding: 8px 20px;\n  font-size: 0.875rem;\n  font-weight: 500;\n  border: none;\n  border-radius: 6px;\n  background: #2563eb;\n  color: #ffffff;\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 6px;\n  transition: background 0.15s, opacity 0.15s;\n  white-space: nowrap;\n}\n.yw-btn:hover:not(:disabled) {\n  background: #1d4ed8;\n}\n.yw-btn:active:not(:disabled) {\n  background: #1e40af;\n}\n.yw-btn:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.yw-loader {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 12px;\n  min-height: 200px;\n  color: #6b7280;\n  font-size: 0.875rem;\n  flex-direction: column;\n}\n.yw-error {\n  padding: 12px 16px;\n  background: #fef2f2;\n  color: #991b1b;\n  border: 1px solid #fca5a5;\n  border-radius: 6px;\n  font-size: 0.875rem;\n  line-height: 1.6;\n}\n.yw-spinner {\n  display: inline-block;\n  width: 20px;\n  height: 20px;\n  border: 2px solid #e5e7eb;\n  border-top-color: #2563eb;\n  border-radius: 50%;\n  animation: spin 0.75s linear infinite;\n  flex-shrink: 0;\n}\n@keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n@media (max-width: 640px) {\n  .yw-topbar {\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 16px;\n  }\n  .yw-topbar-right {\n    width: 100%;\n  }\n  .yw-dropdown-menu {\n    width: 100%;\n  }\n  .yw-generate-row {\n    flex-direction: column;\n    align-items: stretch;\n  }\n  .yw-model-select,\n  .yw-btn {\n    width: 100%;\n  }\n}\n.yw-file-selector-top {\n  flex-shrink: 0;\n  min-width: 300px;\n}\n.yw-file-selector {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.yw-file-list {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.yw-file-item {\n  display: flex;\n  align-items: flex-start;\n  gap: 10px;\n  cursor: pointer;\n  padding: 8px;\n  border-radius: 6px;\n  transition: all 0.2s;\n}\n.yw-file-item:hover {\n  background-color: #f1f5f9;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);\n}\n.yw-file-name {\n  font-size: 0.9rem;\n  font-weight: 500;\n  color: #0f172a;\n}\n.yw-file-meta {\n  font-size: 0.8rem;\n  color: #64748b;\n  margin-left: auto;\n}\n.yw-mode-row {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  padding-top: 10px;\n}\n.yw-title {\n  margin: 0 0 6px 0;\n  font-size: 1.75rem;\n  font-weight: 800;\n  color: #0f172a;\n  letter-spacing: -0.5px;\n}\n.yw-description {\n  margin: 0;\n  font-size: 0.9rem;\n  color: #64748b;\n  line-height: 1.6;\n}\n.yw-section {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.yw-input-label {\n  font-size: 0.9rem;\n  font-weight: 700;\n  color: #0f172a;\n  text-transform: uppercase;\n  letter-spacing: 0.4px;\n}\n.yw-prompt-input {\n  font-family: inherit;\n  font-size: 0.95rem;\n  padding: 12px 14px;\n  border: 1.5px solid #cbd5e1;\n  border-radius: 8px;\n  background: #ffffff;\n  color: #1a202c;\n  resize: vertical;\n  min-height: 100px;\n  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);\n  line-height: 1.5;\n}\n.yw-prompt-input:focus {\n  outline: none;\n  border-color: #2563eb;\n  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);\n  background: #f0f7ff;\n}\n.yw-action-row {\n  display: flex;\n  gap: 10px;\n  margin: 0;\n}\n.yw-btn {\n  padding: 10px 24px;\n  font-size: 0.9rem;\n  font-weight: 700;\n  border: none;\n  border-radius: 8px;\n  background:\n    linear-gradient(\n      135deg,\n      #2563eb 0%,\n      #1d4ed8 100%);\n  color: #ffffff;\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);\n  white-space: nowrap;\n  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);\n  letter-spacing: 0.3px;\n}\n.yw-btn:hover:not(:disabled) {\n  transform: translateY(-2px);\n  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35);\n  background:\n    linear-gradient(\n      135deg,\n      #1d4ed8 0%,\n      #1e40af 100%);\n}\n.yw-btn:active:not(:disabled) {\n  transform: translateY(0);\n}\n.yw-btn:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);\n}\n.yw-action-btn {\n  padding: 8px 14px;\n  font-size: 0.8rem;\n  font-weight: 600;\n  border: 1.5px solid #cbd5e1;\n  background: #ffffff;\n  color: #1a202c;\n  cursor: pointer;\n  border-radius: 6px;\n  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);\n  text-transform: uppercase;\n  letter-spacing: 0.3px;\n}\n.yw-action-btn:hover {\n  background-color: #f1f5f9;\n  border-color: #94a3b8;\n}\n.yw-action-btn:active {\n  background-color: #e2e8f0;\n}\n.yw-loader,\n.yw-loading {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 14px;\n  padding: 28px;\n  color: #64748b;\n  font-size: 0.95rem;\n  flex-direction: column;\n}\n.yw-loader {\n  min-height: 300px;\n}\n.yw-loading {\n  background: #f8fafc;\n  border-radius: 8px;\n  border: 1px solid #e2e8f0;\n}\n.yw-error {\n  padding: 14px 16px;\n  background: #fee2e2;\n  color: #7f1d1d;\n  border: 1.5px solid #fca5a5;\n  border-radius: 8px;\n  font-size: 0.9rem;\n  font-weight: 500;\n  line-height: 1.6;\n}\n.yw-spinner {\n  display: inline-block;\n  width: 22px;\n  height: 22px;\n  border: 3px solid #e2e8f0;\n  border-top-color: #2563eb;\n  border-radius: 50%;\n  animation: spin 1s linear infinite;\n}\n@keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.yw-output {\n  border-radius: 10px;\n  background: #ffffff;\n  border: 1.5px solid #e2e8f0;\n  overflow: hidden;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);\n}\n.yw-output-toolbar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 14px 16px;\n  border-bottom: 1px solid #e2e8f0;\n  background:\n    linear-gradient(\n      180deg,\n      #f8fafc 0%,\n      #ffffff 100%);\n  border-radius: 10px 10px 0 0;\n  gap: 10px;\n}\n.yw-output-title {\n  font-weight: 700;\n  font-size: 0.95rem;\n  color: #0f172a;\n  text-transform: uppercase;\n  letter-spacing: 0.4px;\n}\n.yw-output-actions {\n  display: flex;\n  gap: 8px;\n}\n.yw-output-body {\n  padding: 20px;\n  font-size: 0.95rem;\n  line-height: 1.8;\n  color: #334155;\n  overflow-x: auto;\n  position: relative;\n}\n.yw-output-body h3,\n.yw-output-body h4,\n.yw-output-body h5 {\n  margin: 18px 0 10px 0;\n  font-weight: 700;\n  color: #0f172a;\n}\n.yw-output-body h3 {\n  font-size: 1.2rem;\n}\n.yw-output-body h4 {\n  font-size: 1.05rem;\n}\n.yw-output-body h5 {\n  font-size: 0.95rem;\n}\n.yw-output-body ul {\n  list-style: disc;\n  margin: 10px 0;\n  padding-left: 28px;\n}\n.yw-output-body li {\n  margin: 6px 0;\n  line-height: 1.7;\n}\n.yw-output-body p {\n  margin: 10px 0;\n  line-height: 1.8;\n}\n.yw-output-body hr {\n  margin: 18px 0;\n  border: none;\n  border-top: 2px solid #e2e8f0;\n}\n.yw-output-body strong {\n  font-weight: 700;\n  color: #0f172a;\n}\n.yw-output-body em {\n  font-style: italic;\n  color: #475569;\n}\n.yw-output-body code {\n  background: #f1f5f9;\n  color: #dc2626;\n  padding: 3px 8px;\n  border-radius: 4px;\n  font-family:\n    "Monaco",\n    "Menlo",\n    "Consolas",\n    monospace;\n  font-size: 0.85em;\n}\n.yw-streaming-cursor {\n  display: inline-block;\n  width: 2px;\n  height: 1em;\n  background: #2563eb;\n  margin-left: 4px;\n  animation: blink 1s step-end infinite;\n}\n@keyframes blink {\n  0%, 49% {\n    opacity: 1;\n  }\n  50%, 100% {\n    opacity: 0;\n  }\n}\n@media (max-width: 768px) {\n  .yw-header-top {\n    flex-direction: column;\n    gap: 16px;\n  }\n  .yw-file-selector-top {\n    width: 100%;\n    min-width: unset;\n  }\n  .yw-action-row {\n    flex-direction: column;\n  }\n  .yw-btn {\n    width: 100%;\n  }\n  .yw-output-toolbar {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n  .yw-output-actions {\n    width: 100%;\n  }\n}\n.yw-header {\n  margin-bottom: 16px;\n}\n.yw-title {\n  margin: 0 0 4px 0;\n  font-size: 1.25rem;\n  font-weight: 700;\n  color: inherit;\n}\n.yw-description {\n  margin: 0;\n  font-size: 0.875rem;\n  color: #6b7280;\n}\n.yw-section {\n  margin-bottom: 16px;\n}\n.yw-input-label {\n  display: block;\n  font-size: 0.8125rem;\n  font-weight: 600;\n  color: #374151;\n  margin-bottom: 6px;\n}\n.yw-prompt-row {\n  display: flex;\n  gap: 8px;\n  margin-bottom: 16px;\n}\n.yw-prompt-input {\n  width: 100%;\n  padding: 8px 12px;\n  border: 1px solid #d1d5db;\n  border-radius: 8px;\n  font-size: 0.875rem;\n  font-family: inherit;\n  outline: none;\n  transition: border-color 0.15s, box-shadow 0.15s;\n  background: #ffffff;\n}\n.yw-prompt-input:focus {\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);\n}\n.yw-action-row {\n  display: flex;\n  gap: 8px;\n  margin-bottom: 16px;\n  margin-top: 8px;\n}\n.yw-btn {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  padding: 10px 20px;\n  border-radius: 8px;\n  border: none;\n  font-size: 0.875rem;\n  font-weight: 600;\n  cursor: pointer;\n  transition: opacity 0.15s, filter 0.15s;\n  background: #3b82f6;\n  color: #ffffff;\n  white-space: nowrap;\n}\n.yw-btn:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n.yw-btn:not(:disabled):hover {\n  filter: brightness(1.1);\n}\n.yw-btn-secondary {\n  background: #f3f4f6;\n  color: #374151;\n}\n.yw-file-selector {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.yw-file-selector-label {\n  font-size: 0.8125rem;\n  font-weight: 600;\n  color: #374151;\n  margin-bottom: 6px;\n  display: block;\n}\n.yw-floating-shell {\n  position: fixed;\n  right: 16px;\n  bottom: 16px;\n  z-index: 9999;\n}\n.yw-floating-launcher {\n  width: 56px;\n  height: 56px;\n  border-radius: 999px;\n  border: none;\n  background:\n    linear-gradient(\n      135deg,\n      #2563eb 0%,\n      #1d4ed8 100%);\n  color: #ffffff;\n  font-size: 1rem;\n  font-weight: 700;\n  cursor: pointer;\n  box-shadow: 0 12px 24px rgba(37, 99, 235, 0.35);\n}\n.yw-floating-panel {\n  width: min(420px, calc(100vw - 24px));\n  height: min(680px, calc(100vh - 24px));\n  background: #ffffff;\n  border: 1px solid #dbe4f2;\n  border-radius: 14px;\n  box-shadow: 0 20px 50px rgba(2, 6, 23, 0.2);\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n}\n.yw-floating-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  padding: 10px 12px;\n  background: #eff6ff;\n  border-bottom: 1px solid #dbeafe;\n}\n.yw-floating-title {\n  font-size: 0.9rem;\n  color: #1e3a8a;\n}\n.yw-floating-close {\n  border: none;\n  background: transparent;\n  color: #1e3a8a;\n  width: 28px;\n  height: 28px;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 1rem;\n  line-height: 1;\n}\n.yw-floating-close:hover {\n  background: #dbeafe;\n}\n.yw-floating-body {\n  flex: 1;\n  overflow: auto;\n}\n@media (max-width: 640px) {\n  .yw-floating-shell {\n    right: 10px;\n    left: 10px;\n    bottom: 10px;\n  }\n  .yw-floating-panel {\n    width: 100%;\n    height: min(78vh, calc(100vh - 20px));\n  }\n}\n.yw-file-selector > button {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  width: 100%;\n  padding: 8px 12px;\n  border: 1px solid #d1d5db;\n  border-radius: 8px;\n  background: #ffffff;\n  font-size: 0.8125rem;\n  cursor: pointer;\n  transition: border-color 0.15s, background 0.15s;\n}\n.yw-file-selector > button:hover {\n  background: #f9fafb;\n  border-color: #9ca3af;\n}\n.yw-file-list {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  border: 1px solid #e5e7eb;\n  border-radius: 8px;\n  max-height: 240px;\n  overflow-y: auto;\n  background: #ffffff;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);\n}\n.yw-file-item {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 8px 12px;\n  border-bottom: 1px solid #f3f4f6;\n  font-size: 0.8125rem;\n  cursor: pointer;\n  transition: background 0.1s;\n}\n.yw-file-item:last-child {\n  border-bottom: none;\n}\n.yw-file-item:hover {\n  background: #f9fafb;\n}\n.yw-file-item input[type=checkbox] {\n  flex-shrink: 0;\n  width: 16px;\n  height: 16px;\n  cursor: pointer;\n}\n.yw-file-name {\n  flex: 1;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-weight: 500;\n}\n.yw-file-meta {\n  font-size: 0.75rem;\n  color: #9ca3af;\n  white-space: nowrap;\n}\n.yw-mode-row {\n  display: flex;\n  gap: 16px;\n  margin-top: 8px;\n  font-size: 0.8125rem;\n  padding: 8px 12px;\n  background: #f9fafb;\n  border-top: 1px solid #e5e7eb;\n}\n.yw-mode-row label {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  cursor: pointer;\n  font-weight: 500;\n}\n.yw-mode-row input[type=radio] {\n  flex-shrink: 0;\n  cursor: pointer;\n}\n.yw-loading {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 12px;\n  padding: 24px;\n  background: #f9fafb;\n  border-radius: 8px;\n  border: 1px solid #e5e7eb;\n  color: #6b7280;\n  font-size: 0.875rem;\n  margin-bottom: 16px;\n}\n.yw-output {\n  margin-top: 16px;\n  border: 1px solid #e5e7eb;\n  border-radius: 8px;\n  overflow: hidden;\n  background: #ffffff;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);\n}\n.yw-output-toolbar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  padding: 12px 16px;\n  background: #f9fafb;\n  border-bottom: 1px solid #e5e7eb;\n}\n.yw-output-title {\n  font-size: 0.8125rem;\n  font-weight: 600;\n  color: #374151;\n}\n.yw-output-actions {\n  display: flex;\n  gap: 6px;\n}\n.yw-action-btn {\n  background: none;\n  border: 1px solid #d1d5db;\n  border-radius: 6px;\n  padding: 4px 10px;\n  font-size: 0.75rem;\n  cursor: pointer;\n  color: #374151;\n  transition: background 0.15s, border-color 0.15s;\n  white-space: nowrap;\n}\n.yw-action-btn:hover {\n  background: #f3f4f6;\n  border-color: #9ca3af;\n}\n.yw-action-btn:active {\n  background: #e5e7eb;\n}\n.yw-output-body {\n  padding: 16px;\n  font-size: 0.9375rem;\n  line-height: 1.6;\n  overflow-y: auto;\n  max-height: 480px;\n}\n.yw-output-body h4 {\n  margin: 1em 0 0.4em;\n  font-size: 1rem;\n  font-weight: 700;\n  color: inherit;\n}\n.yw-output-body h5 {\n  margin: 0.8em 0 0.3em;\n  font-size: 0.9375rem;\n  font-weight: 600;\n  color: inherit;\n}\n.yw-output-body h3 {\n  margin: 1.2em 0 0.4em;\n  font-size: 1.0625rem;\n  font-weight: 700;\n  color: inherit;\n}\n.yw-output-body ul {\n  padding-left: 1.25em;\n  margin: 0.4em 0;\n  list-style-type: disc;\n}\n.yw-output-body li {\n  margin: 0.2em 0;\n}\n.yw-output-body p {\n  margin: 0.5em 0;\n}\n.yw-output-body hr {\n  border: none;\n  border-top: 1px solid #e5e7eb;\n  margin: 1em 0;\n}\n.yw-output-body strong {\n  font-weight: 700;\n}\n.yw-output-body em {\n  font-style: italic;\n}\n.yw-output-body code {\n  background: #f3f4f6;\n  border: 1px solid #e5e7eb;\n  border-radius: 4px;\n  padding: 1px 4px;\n  font-size: 0.875em;\n  font-family:\n    "Monaco",\n    "Menlo",\n    "Ubuntu Mono",\n    monospace;\n}\n.yw-streaming-cursor {\n  display: inline-block;\n  width: 2px;\n  height: 1em;\n  background: #3b82f6;\n  margin-left: 4px;\n  animation: yw-blink 0.8s ease-in-out infinite;\n}\n@keyframes yw-blink {\n  0%, 49%, 100% {\n    opacity: 1;\n  }\n  50%, 99% {\n    opacity: 0;\n  }\n}\n.yw-loader {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 48px 0;\n  gap: 12px;\n  color: #6b7280;\n  font-size: 0.875rem;\n}\n.yw-spinner {\n  width: 32px;\n  height: 32px;\n  border: 3px solid #e5e7eb;\n  border-top-color: #3b82f6;\n  border-radius: 50%;\n  animation: yw-spin 0.8s linear infinite;\n}\n@keyframes yw-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.yw-error {\n  background: #fef2f2;\n  border: 1px solid #fecaca;\n  border-radius: 8px;\n  padding: 16px;\n  color: #dc2626;\n  font-size: 0.875rem;\n}\n');

// src/widgets/summary/SummaryWidget.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var CopyIcon = () => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" }),
  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })
] });
var DownloadIcon = () => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("polyline", { points: "7 10 12 15 17 10" }),
  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("line", { x1: "12", y1: "15", x2: "12", y2: "3" })
] });
function renderMarkdown(text) {
  return text.replace(/^##### (.+)$/gm, "<h5>$1</h5>").replace(/^#### (.+)$/gm, "<h4>$1</h4>").replace(/^### (.+)$/gm, "<h3>$1</h3>").replace(/^---$/gm, "<hr/>").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/`([^`]+)`/g, "<code>$1</code>").replace(/^[-*] (.+)$/gm, "<li>$1</li>").replace(/(<li>[\s\S]*?<\/li>)(?!\s*<li>)/g, "<ul>$1</ul>").replace(/^(?!<[a-zA-Z])(.+)$/gm, "<p>$1</p>").replace(/<p>\s*<\/p>/g, "");
}
function SummaryWidget({
  widgetId,
  token,
  apiBaseUrl,
  onTokenExpired,
  onError,
  className,
  position = "inline",
  launcherLabel = "S",
  floatingWidth,
  floatingHeight
}) {
  const base = apiBaseUrl.replace(/\/$/, "");
  const streamUrl = `${base}/summary-stream`;
  const [loading, setLoading] = (0, import_react4.useState)(true);
  const [initError, setInitError] = (0, import_react4.useState)(null);
  const [widget, setWidget] = (0, import_react4.useState)(null);
  const [sessionId, setSessionId] = (0, import_react4.useState)(null);
  const [availableFiles, setAvailableFiles] = (0, import_react4.useState)([]);
  const [selectedFileIds, setSelectedFileIds] = (0, import_react4.useState)([]);
  const [summaryMode, setSummaryMode] = (0, import_react4.useState)("combine");
  const [userPrompt, setUserPrompt] = (0, import_react4.useState)("");
  const [answer, setAnswer] = (0, import_react4.useState)("");
  const [isGenerating, setIsGenerating] = (0, import_react4.useState)(false);
  const [isCopied, setIsCopied] = (0, import_react4.useState)(false);
  const [selectedModel, setSelectedModel] = (0, import_react4.useState)("");
  const [isOpen, setIsOpen] = (0, import_react4.useState)(position !== "bottom-right");
  const sessionRef = (0, import_react4.useRef)(null);
  const summaryRef = (0, import_react4.useRef)(null);
  (0, import_react4.useEffect)(() => {
    setIsOpen(position !== "bottom-right");
  }, [position]);
  const { streamedText, isStreaming, startStreaming, reset: resetStream } = useStreamingSummary({
    onComplete: (full) => {
      setAnswer(full);
      setIsGenerating(false);
    },
    onError: (err) => {
      console.error("[SummaryWidget] streaming error:", err);
      if (err.includes("401")) onTokenExpired?.();
      onError?.(err);
      setIsGenerating(false);
    }
  });
  (0, import_react4.useEffect)(() => {
    let cancelled = false;
    const init = async () => {
      try {
        setLoading(true);
        setInitError(null);
        const doc = await fetchWidgetConfig(base, widgetId, token);
        if (cancelled) return;
        setWidget(doc);
        const cfg2 = doc.config;
        const models2 = Array.isArray(cfg2.allowModels) ? cfg2.allowModels : cfg2.allowModels ? [cfg2.allowModels] : ["gpt-4o-mini"];
        const model = models2[0] ?? "gpt-4o-mini";
        setSelectedModel(model);
        setSummaryMode(cfg2.summaryMode ?? "combine");
        setSelectedFileIds(cfg2.selectedFileIds ?? []);
        const ns = cfg2.dataSources?.[0]?.configdetails?.namespace;
        const wsId = cfg2.workspaceId;
        let nsFiles = [];
        if (ns && wsId) {
          try {
            console.log("[SummaryWidget] init() \u2192 fetchNamespaces()", { ns, wsId });
            const nsData = await fetchNamespaces(base, wsId, token);
            const match = nsData.find((n) => n.namespace === ns);
            if (match) {
              nsFiles = match.source;
              setAvailableFiles(nsFiles);
            }
          } catch {
          }
        }
        const source = cfg2.dataSources?.[0];
        let sid = null;
        if (source?.selectedSource === "UnStructured") {
          const r = await createRagSession(base, token, model);
          sid = r.session_id;
        } else if (source?.selectedSource === "Structured" || source?.configdetails?.datasetId || source?.datasetId) {
          const datasetId = source.configdetails?.datasetId ?? source.datasetId ?? "";
          const r = await createStructuredSession(base, token, datasetId, model);
          sid = r.sessionId ?? r.session_id ?? null;
        } else {
          try {
            const r = await createRagSession(base, token, model);
            sid = r.session_id;
          } catch {
          }
        }
        if (sid) {
          setSessionId(sid);
          sessionRef.current = sid;
        }
        if (cancelled) return;
        await runSummary(doc, sid, cfg2.selectedFileIds ?? [], nsFiles);
      } catch (err) {
        if (!cancelled) {
          const msg = err?.message ?? "Failed to load widget";
          setInitError(msg);
          onError?.(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    init();
    return () => {
      cancelled = true;
    };
  }, [widgetId, token]);
  const runSummary = (0, import_react4.useCallback)(
    async (doc, sid, fileIds, files) => {
      if (!doc) return;
      setIsGenerating(true);
      resetStream();
      setAnswer("");
      const cfg2 = doc.config;
      const model = selectedModel || ((Array.isArray(cfg2.allowModels) ? cfg2.allowModels[0] : cfg2.allowModels) ?? "gpt-4o-mini");
      const prompt = userPrompt.trim() || cfg2.apiprompt || "";
      const source = cfg2.dataSources?.[0];
      const isSeparate = summaryMode === "separate";
      const resolvedFiles = files && files.length > 0 ? files : availableFiles;
      try {
        if (source?.selectedSource === "Structured") {
          const text = await queryStructuredSummary(base, token, sid ?? "", prompt || "summary:");
          setAnswer(text);
          setIsGenerating(false);
          return;
        } else if (source?.selectedSource === "UnStructured" || !source?.selectedSource) {
          let docIds = resolveDocumentIds(fileIds, resolvedFiles);
          if (docIds.length === 0) {
            setAnswer("No documents found. Please check your data source configuration.");
            setIsGenerating(false);
            return;
          }
          let fileNameMap = {};
          if (isSeparate) {
            fileNameMap = buildFileNameMap(resolvedFiles);
          }
          await startStreaming({
            documentIds: docIds,
            token,
            customPrompt: prompt,
            yaviLlmConfigName: model,
            separate: isSeparate,
            fileNameMap: isSeparate ? fileNameMap : void 0,
            streamUrl
          });
        } else {
          console.warn("[SummaryWidget] runSummary() \u2192 unsupported source type", source?.selectedSource);
          setAnswer("Unsupported data source type. Please check widget configuration.");
          setIsGenerating(false);
        }
      } catch (err) {
        console.error("[SummaryWidget] runSummary() \u2192 error", err);
        onError?.(err?.message ?? "Summary generation failed");
        setIsGenerating(false);
      }
    },
    [base, token, streamUrl, userPrompt, summaryMode, selectedModel, availableFiles, startStreaming, resetStream, onError]
  );
  const handleGenerate = () => {
    if (!widget) return;
    runSummary(widget, sessionRef.current, selectedFileIds);
  };
  const handleCopy = async () => {
    if (!summaryRef.current) return;
    try {
      const html = summaryRef.current.innerHTML;
      const plain = summaryRef.current.innerText;
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([plain], { type: "text/plain" })
        })
      ]);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2e3);
    } catch {
      const text = answer || streamedText;
      if (text) navigator.clipboard.writeText(text);
    }
  };
  const handleDownload = () => {
    const text = answer || streamedText;
    if (!text) return;
    const el = document.createElement("a");
    el.href = URL.createObjectURL(new Blob([text], { type: "text/markdown" }));
    el.download = `${widget?.config?.widget_title ?? "summary"}.md`;
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  };
  const isFloating = position === "bottom-right";
  const cfg = widget?.config ?? {};
  const displayText = isStreaming ? streamedText : answer;
  const isWorking = isGenerating || isStreaming;
  const models = Array.isArray(cfg.allowModels) ? cfg.allowModels : cfg.allowModels ? [cfg.allowModels] : [];
  const content = loading ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "yw-root", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "yw-loader", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "yw-spinner" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: "Loading widget\u2026" })
  ] }) }) : initError ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "yw-root", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "yw-error", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { children: initError }) }) }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
    "div",
    {
      className: "yw-root",
      style: {
        backgroundColor: cfg.backgroundcolor ?? "#ffffff",
        color: cfg.fontcolor ?? "#1f2937",
        fontSize: cfg.fontSize ? `${cfg.fontSize}px` : void 0,
        padding: "13px"
      },
      children: [
        (cfg.widget_title || availableFiles.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "yw-topbar", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "yw-topbar-left", children: cfg.widget_title && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { className: "yw-title", style: { color: cfg.fontcolor ?? "#1f2937" }, children: cfg.widget_title }) }),
          availableFiles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "yw-topbar-right", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            FileSelectorDropdown,
            {
              files: availableFiles,
              selectedIds: selectedFileIds,
              onChange: setSelectedFileIds,
              mode: summaryMode,
              onModeChange: setSummaryMode
            }
          ) })
        ] }),
        isWorking && !displayText && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "yw-generating", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "yw-spinner" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "yw-generating-text", children: "Generating summary..." })
        ] }),
        displayText && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "yw-output-wrap", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "yw-output-actions", children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              "button",
              {
                className: "yw-icon-btn",
                title: isCopied ? "Copied!" : "Copy",
                onClick: handleCopy,
                style: cfg.buttoncolor && cfg.buttoncolor !== "#3B82F6" ? { color: cfg.buttoncolor } : void 0,
                children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(CopyIcon, {})
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              "button",
              {
                className: "yw-icon-btn",
                title: "Download",
                onClick: handleDownload,
                style: cfg.buttoncolor && cfg.buttoncolor !== "#3B82F6" ? { color: cfg.buttoncolor } : void 0,
                children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(DownloadIcon, {})
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "div",
            {
              ref: summaryRef,
              className: "yw-prose",
              dangerouslySetInnerHTML: { __html: renderMarkdown(displayText) }
            }
          ),
          isStreaming && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "yw-streaming-cursor" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "yw-bottom-bar", children: [
          cfg.allowuserprompt && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "yw-instructions-wrap", children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("label", { className: "yw-input-label", htmlFor: "yw-instructions", children: "Instructions for Summary" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              "textarea",
              {
                id: "yw-instructions",
                className: "yw-prompt-input",
                rows: 2,
                maxLength: 1500,
                placeholder: "Add instructions for the summary\u2026",
                value: userPrompt,
                onChange: (e) => setUserPrompt(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === "Enter" && !e.shiftKey && sessionId && !isWorking) {
                    e.preventDefault();
                    handleGenerate();
                  }
                }
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "yw-char-count", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { style: { color: userPrompt.length >= 1500 ? "#ef4444" : void 0 }, children: [
              userPrompt.length,
              "/1500 characters"
            ] }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "yw-generate-row", children: [
            models.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              "select",
              {
                className: "yw-model-select",
                value: selectedModel,
                onChange: (e) => setSelectedModel(e.target.value),
                children: models.map((m) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: m, children: m }, m))
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              "button",
              {
                className: "yw-btn",
                disabled: isWorking || !sessionId,
                onClick: handleGenerate,
                style: {
                  backgroundColor: cfg.buttoncolor ?? "#3b82f6",
                  color: "#ffffff"
                },
                children: !sessionId ? "Please wait..." : isWorking ? "Generating..." : "Generate"
              }
            )
          ] })
        ] })
      ]
    }
  );
  if (!isFloating) {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: className ?? "", children: content });
  }
  const panelStyle = {};
  if (floatingWidth) panelStyle.width = typeof floatingWidth === "number" ? `${floatingWidth}px` : floatingWidth;
  if (floatingHeight) panelStyle.height = typeof floatingHeight === "number" ? `${floatingHeight}px` : floatingHeight;
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: `yw-floating-shell ${className ?? ""}`, children: [
    !isOpen && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      "button",
      {
        type: "button",
        className: "yw-floating-launcher",
        onClick: () => setIsOpen(true),
        "aria-label": "Open summary widget",
        title: "Open summary widget",
        children: launcherLabel
      }
    ),
    isOpen && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "yw-floating-panel", style: panelStyle, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "yw-floating-header", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("strong", { className: "yw-floating-title", children: cfg.widget_title ?? "Summary" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "button",
          {
            type: "button",
            className: "yw-floating-close",
            onClick: () => setIsOpen(false),
            "aria-label": "Close summary widget",
            children: "x"
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "yw-floating-body", children: content })
    ] })
  ] });
}

// src/widgets/qna/QnaWidget.tsx
var import_react5 = require("react");

// src/widgets/qna/api.ts
var import_jwt_decode2 = require("jwt-decode");
async function fetchWidgetConfig2(apiBaseUrl, widgetId, token) {
  const res = await fetch(`${apiBaseUrl}/widget/${widgetId}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store"
  });
  if (!res.ok) throw new Error(`Widget fetch failed: ${res.status}`);
  const data = await res.json();
  return data.widget ?? data;
}
function isKeycloakToken2(token) {
  return "sub" in token && "azp" in token;
}
function isCustomJWTToken2(token) {
  return "user_id" in token && "token_type" in token;
}
async function getServerUserIdFromAccessToken2(accessToken) {
  try {
    const decoded = (0, import_jwt_decode2.jwtDecode)(accessToken);
    if (isKeycloakToken2(decoded)) {
      return decoded.sub;
    }
    if (isCustomJWTToken2(decoded)) {
      return decoded.user_id;
    }
    return null;
  } catch (error) {
    console.error("Error decoding access token for user ID:", error);
    return null;
  }
}
async function createRagSession2(apiBaseUrl, token, yaviLlmConfigName) {
  console.warn("Creating RAG session for QnA with token:", token);
  const userId = await getServerUserIdFromAccessToken2(token);
  const res = await fetch(`${apiBaseUrl}/proxy/rag/rag/api/v2/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      bot_mode: "standard_v2",
      yavi_llm_config_name: yaviLlmConfigName ?? "gpt-4o-mini",
      yavi_embedding_config_name: "azure-embedding-small",
      llm_parameters: {
        frequency_penalty: 0,
        presence_penalty: 0,
        temperature: 0.7,
        max_tokens: 2e3,
        top_p: 1
      },
      user_id: userId
    })
  });
  if (!res.ok) throw new Error(`Session creation failed: ${res.status}`);
  return res.json();
}
async function createStructuredSession2(apiBaseUrl, token, datasetId, yaviLlmConfigName) {
  console.warn("Creating structured session for QnA with datasetId:", datasetId);
  const userId = await getServerUserIdFromAccessToken2(token);
  const res = await fetch(`${apiBaseUrl}/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      dataset_id: datasetId,
      yavi_llm_config_name: yaviLlmConfigName ?? "gpt-4o-mini",
      yavi_embedding_config_name: "azure-embedding-small",
      llm_parameters: {
        frequency_penalty: 0,
        presence_penalty: 0,
        temperature: 0.7,
        max_tokens: 2e3,
        top_p: 1
      },
      user_id: userId
    })
  });
  if (!res.ok) throw new Error(`Structured session failed: ${res.status}`);
  return res.json();
}
async function fetchNamespaces2(apiBaseUrl, workspaceId, token) {
  const res = await fetch(`${apiBaseUrl}/namespaces/${workspaceId}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store"
  });
  if (!res.ok) throw new Error(`Namespaces fetch failed: ${res.status}`);
  return res.json();
}
async function queryStructuredQnA(apiBaseUrl, token, sessionId, question, customPrompt, addToHistory = true, useSystemPrompt = true) {
  const trimmedQuestion = question?.trim() || "";
  const baseInstruction = "You are an expert document analyst and strategic research assistant. Provide a well-structured markdown summary. Use h4 (####) for all section headings. Headings must be strictly consistent throughout the output. Use the exact same heading style, level, and wording for similar sections. Do not rename, reformat, or vary headings.";
  const finalQuestion = `${baseInstruction}${trimmedQuestion}`;
  const finalCustomPrompt = customPrompt?.trim() ? `${baseInstruction}: ${customPrompt}` : `You are an expert document analyst and strategic research assistant.
Your task is to analyze the provided document and generate a structured, insight-rich summary.

Organize the summary with clear sections and structure.

{text}

COMPREHENSIVE SUMMARY:

Provide a well-structured markdown summary with the following sections exactly as written below. Do not rename, reorder, add, remove, or vary the headings. Use the same heading style and wording consistently throughout the output.

#### Main Themes
[Identify and describe 2-4 overarching themes that emerge from the content]

#### Key Points
[List the most important points as bullet items, organized by topic if applicable]

#### Important Findings
[Highlight critical insights, conclusions, or notable information discovered]

#### Summary
[Brief overall summary synthesizing the above sections]

Instructions:
- Headings must be strictly consistent.
- Use exactly these headings: "#### Main Themes", "#### Key Points", "#### Important Findings", and "#### Summary".
- Do not use alternate heading levels, synonyms, bolded titles, or extra section titles.
- Strictly follow the specified word limit. If a word limit is given, ensure the content contains only that exact number of words.

OUTPUT STRUCTURE (USE EXACTLY THIS FORMAT):

##### Final Executive Summary
(Short high-level takeaway)`;
  const res = await fetch(`${apiBaseUrl}/structured-chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      sessionId,
      question: finalQuestion,
      add_to_history: addToHistory,
      use_system_prompt: useSystemPrompt,
      custom_prompt: finalCustomPrompt,
      // Keep legacy key so older route implementations still work.
      prompt: trimmedQuestion || "summary:"
    })
  });
  if (!res.ok) throw new Error(`Structured QnA query failed: ${res.status}`);
  const data = await res.json();
  return data.answer ?? data.explanation ?? data.result ?? "";
}
async function queryQnA(apiBaseUrl, token, sessionId, question, documentIds, namespace, topK, customPrompt) {
  const res = await fetch(`${apiBaseUrl}/qna-chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      sessionId,
      question,
      documentIds,
      namespace,
      topK,
      customPrompt
    })
  });
  if (!res.ok) throw new Error(`QnA query failed: ${res.status}`);
  const data = await res.json();
  return data.answer ?? data.result ?? "";
}

// src/widgets/qna/qna.css
styleInject('.yw-qna-widget {\n  display: flex;\n  flex-direction: column;\n  gap: 1.5rem;\n  padding: 1.5rem;\n  background: #fff;\n  border-radius: 0.5rem;\n  font-family:\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    Roboto,\n    "Helvetica Neue",\n    Arial,\n    sans-serif;\n  color: #1f2937;\n}\n.yw-qna-widget--loading {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 200px;\n}\n.yw-qna-widget--error {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 100px;\n}\n.yw-qna-title {\n  font-size: 1.75rem;\n  font-weight: 700;\n  margin: 0;\n  color: #111827;\n}\n.yw-qna-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n}\n.yw-qna-file-section {\n  flex-shrink: 0;\n}\n.yw-qna-file-dropdown {\n  position: relative;\n}\n.yw-qna-file-button {\n  width: 100%;\n  padding: 0.75rem;\n  background: #fff;\n  border: 1px solid #d1d5db;\n  border-radius: 0.375rem;\n  font-size: 0.875rem;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  transition: all 0.2s;\n}\n.yw-qna-file-button:hover {\n  background-color: #f9fafb;\n  border-color: #9ca3af;\n}\n.yw-qna-file-button:focus {\n  outline: none;\n  ring: 2px;\n  ring-color: #3b82f6;\n  ring-offset: 2px;\n}\n.yw-qna-chevron {\n  display: inline-block;\n  font-size: 0.875rem;\n  transition: transform 0.2s ease;\n}\n.yw-qna-chevron--open {\n  transform: rotate(180deg);\n}\n.yw-qna-file-list {\n  position: absolute;\n  right: 0;\n  top: calc(100% + 0.25rem);\n  width: 24rem;\n  max-width: 100vw;\n  background: #fff;\n  border: 1px solid #e5e7eb;\n  border-radius: 0.375rem;\n  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);\n  z-index: 50;\n  max-height: 24rem;\n  overflow-y: auto;\n}\n.yw-qna-file-item {\n  padding: 0.75rem;\n  border-bottom: 1px solid #f3f4f6;\n  display: flex;\n  align-items: flex-start;\n  gap: 0.5rem;\n  cursor: pointer;\n  transition: background-color 0.15s;\n}\n.yw-qna-file-item:hover {\n  background-color: #f9fafb;\n}\n.yw-qna-file-item:last-child {\n  border-bottom: none;\n}\n.yw-qna-file-select-all {\n  border-bottom: 1px solid #e5e7eb;\n  background-color: #f3f4f6;\n}\n.yw-qna-checkbox {\n  width: 1rem;\n  height: 1rem;\n  margin-top: 0.125rem;\n  accent-color: #3b82f6;\n  cursor: pointer;\n}\n.yw-qna-file-info {\n  flex: 1;\n  min-width: 0;\n}\n.yw-qna-file-name {\n  font-weight: 500;\n  font-size: 0.875rem;\n  color: #111827;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.yw-qna-file-meta {\n  font-size: 0.75rem;\n  color: #6b7280;\n  margin-top: 0.125rem;\n}\n.yw-qna-file-label {\n  font-size: 0.875rem;\n  font-weight: 600;\n  color: #2563eb;\n}\n.yw-qna-qa-section {\n  display: flex;\n  flex-direction: column;\n  gap: 1.5rem;\n  padding: 1rem;\n  background: #fff;\n  border-radius: 0.5rem;\n  border: 1px solid #e5e7eb;\n}\n.yw-qna-question-block {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  padding-bottom: 1rem;\n  border-bottom: 1px solid #e5e7eb;\n}\n.yw-qna-question-block:last-child {\n  border-bottom: none;\n  padding-bottom: 0;\n}\n.yw-qna-question-title {\n  font-size: 1rem;\n  font-weight: 600;\n  color: #000000;\n  margin: 0;\n}\n.yw-qna-loading-state,\n.yw-qna-waiting-state,\n.yw-qna-initializing {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  font-size: 0.875rem;\n  color: #3b82f6;\n  padding: 0.75rem;\n}\n.yw-qna-spinner,\n.yw-qna-spinner-mini {\n  display: inline-block;\n  width: 1.25rem;\n  height: 1.25rem;\n  border: 2px solid #3b82f6;\n  border-top-color: transparent;\n  border-radius: 50%;\n  animation: yw-qna-spin 1s linear infinite;\n}\n.yw-qna-spinner-mini {\n  width: 1rem;\n  height: 1rem;\n  border-width: 2px;\n}\n@keyframes yw-qna-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.yw-qna-answer-block {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n.yw-qna-answer-text {\n  font-size: 0.95rem;\n  line-height: 1.6;\n  color: #374151;\n  white-space: pre-wrap;\n  word-wrap: break-word;\n}\n.yw-qna-file-answers {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n.yw-qna-file-answer {\n  border: 1px solid #e5e7eb;\n  border-radius: 0.375rem;\n  padding: 1rem;\n  background: #f9fafb;\n}\n.yw-qna-file-answer-name {\n  font-size: 0.875rem;\n  font-weight: 600;\n  color: #1e40af;\n  margin-bottom: 0.5rem;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.yw-qna-references {\n  margin-top: 1rem;\n  padding-top: 1rem;\n  border-top: 1px solid #e5e7eb;\n}\n.yw-qna-references-toggle {\n  background: none;\n  border: none;\n  color: #2563eb;\n  font-size: 0.875rem;\n  font-weight: 500;\n  cursor: pointer;\n  padding: 0;\n  text-decoration: underline;\n  transition: color 0.2s;\n}\n.yw-qna-references-toggle:hover {\n  color: #1d4ed8;\n}\n.yw-qna-reference-list {\n  margin-top: 0.75rem;\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n.yw-qna-reference-item {\n  border: 1px solid #e5e7eb;\n  border-radius: 0.375rem;\n  overflow: hidden;\n}\n.yw-qna-reference-header {\n  width: 100%;\n  padding: 0.75rem;\n  background: #f9fafb;\n  border: none;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  transition: background-color 0.15s;\n  text-align: left;\n}\n.yw-qna-reference-header:hover {\n  background-color: #f3f4f6;\n}\n.yw-qna-reference-info {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  flex: 1;\n  min-width: 0;\n}\n.yw-qna-reference-index {\n  font-size: 0.75rem;\n  font-weight: 600;\n  color: #4b5563;\n}\n.yw-qna-reference-source {\n  font-size: 0.75rem;\n  color: #6b7280;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.yw-qna-reference-score {\n  font-size: 0.75rem;\n  color: #6b7280;\n  white-space: nowrap;\n}\n.yw-qna-reference-content {\n  padding: 0.75rem;\n  background: #fff;\n  border-top: 1px solid #e5e7eb;\n  font-size: 0.875rem;\n  line-height: 1.5;\n  color: #374151;\n  max-height: 300px;\n  overflow-y: auto;\n  white-space: pre-wrap;\n  word-wrap: break-word;\n}\n.yw-qna-controls {\n  display: flex;\n  gap: 1rem;\n  align-items: center;\n  padding-top: 1rem;\n  border-top: 1px solid #e5e7eb;\n  flex-wrap: wrap;\n}\n.yw-qna-model-select {\n  padding: 0.5rem 0.75rem;\n  border: 1px solid #d1d5db;\n  border-radius: 0.375rem;\n  font-size: 0.875rem;\n  cursor: pointer;\n  background: #fff;\n  color: #374151;\n  transition: all 0.2s;\n}\n.yw-qna-model-select:hover {\n  border-color: #9ca3af;\n}\n.yw-qna-model-select:focus {\n  outline: none;\n  border-color: #3b82f6;\n}\n.yw-qna-generate-button {\n  padding: 0.625rem 1.5rem;\n  background-color: #3b82f6;\n  color: #fff;\n  border: none;\n  border-radius: 0.375rem;\n  font-size: 0.875rem;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s;\n  white-space: nowrap;\n}\n.yw-qna-generate-button:hover:not(:disabled) {\n  background-color: #2563eb;\n}\n.yw-qna-generate-button:disabled {\n  background-color: #d1d5db;\n  color: #6b7280;\n  cursor: not-allowed;\n}\n.yw-qna-error-message {\n  padding: 1rem;\n  background-color: #fee2e2;\n  color: #991b1b;\n  border-radius: 0.375rem;\n  border: 1px solid #fecaca;\n  margin: 0;\n}\n@media (max-width: 640px) {\n  .yw-qna-widget {\n    padding: 1rem;\n    gap: 1rem;\n  }\n  .yw-qna-title {\n    font-size: 1.5rem;\n  }\n  .yw-qna-file-list {\n    width: 100vw;\n    left: -1rem;\n    right: auto;\n  }\n  .yw-qna-controls {\n    flex-direction: column;\n  }\n  .yw-qna-model-select,\n  .yw-qna-generate-button {\n    width: 100%;\n  }\n  .yw-qna-qa-section {\n    padding: 0.75rem;\n  }\n}\n.yw-floating-shell {\n  position: fixed;\n  right: 16px;\n  bottom: 16px;\n  z-index: 9999;\n}\n.yw-floating-launcher {\n  width: 56px;\n  height: 56px;\n  border-radius: 999px;\n  border: none;\n  background:\n    linear-gradient(\n      135deg,\n      #2563eb 0%,\n      #1d4ed8 100%);\n  color: #ffffff;\n  font-size: 1rem;\n  font-weight: 700;\n  cursor: pointer;\n  box-shadow: 0 12px 24px rgba(37, 99, 235, 0.35);\n}\n.yw-floating-panel {\n  width: min(460px, calc(100vw - 24px));\n  height: min(700px, calc(100vh - 24px));\n  background: #ffffff;\n  border: 1px solid #dbe4f2;\n  border-radius: 14px;\n  box-shadow: 0 20px 50px rgba(2, 6, 23, 0.2);\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n}\n.yw-floating-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  padding: 10px 12px;\n  background: #eff6ff;\n  border-bottom: 1px solid #dbeafe;\n}\n.yw-floating-title {\n  font-size: 0.9rem;\n  color: #1e3a8a;\n}\n.yw-floating-close {\n  border: none;\n  background: transparent;\n  color: #1e3a8a;\n  width: 28px;\n  height: 28px;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 1rem;\n  line-height: 1;\n}\n.yw-floating-close:hover {\n  background: #dbeafe;\n}\n.yw-floating-body {\n  flex: 1;\n  overflow: auto;\n}\n@media (max-width: 640px) {\n  .yw-floating-shell {\n    right: 10px;\n    left: 10px;\n    bottom: 10px;\n  }\n  .yw-floating-panel {\n    width: 100%;\n    height: min(78vh, calc(100vh - 20px));\n  }\n}\n');

// src/widgets/qna/QnaWidget.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
var ReferenceItem = ({ reference, index, isExpanded, onToggle }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "yw-qna-reference-item", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { onClick: onToggle, className: "yw-qna-reference-header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "yw-qna-reference-info", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "yw-qna-reference-index", children: [
          "Reference ",
          index + 1
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "yw-qna-reference-source", children: [
          "\u2022 ",
          reference.source
        ] }),
        reference.similarity_score && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "yw-qna-reference-score", children: [
          "\u2022 ",
          (reference.similarity_score * 100).toFixed(0),
          "% match"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: `yw-qna-chevron ${isExpanded ? "yw-qna-chevron--open" : ""}`, children: "\u25BC" })
    ] }),
    isExpanded && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "yw-qna-reference-content", children: reference.content })
  ] });
};
function QnaWidget({
  widgetId,
  token,
  apiBaseUrl,
  onTokenExpired,
  onError,
  className,
  position = "inline",
  launcherLabel = "Q",
  floatingWidth,
  floatingHeight
}) {
  const [widget, setWidget] = (0, import_react5.useState)(null);
  const [loading, setLoading] = (0, import_react5.useState)(true);
  const [error, setError] = (0, import_react5.useState)(null);
  const [availableFiles, setAvailableFiles] = (0, import_react5.useState)([]);
  const [isLoadingFiles, setIsLoadingFiles] = (0, import_react5.useState)(true);
  const [selectedFileIds, setSelectedFileIds] = (0, import_react5.useState)([]);
  const [sessionId, setSessionId] = (0, import_react5.useState)(null);
  const [questions, setQuestions] = (0, import_react5.useState)([]);
  const [answers, setAnswers] = (0, import_react5.useState)({});
  const [isProcessing, setIsProcessing] = (0, import_react5.useState)(false);
  const [currentlyProcessing, setCurrentlyProcessing] = (0, import_react5.useState)(null);
  const [selectedModel, setSelectedModel] = (0, import_react5.useState)("gpt-4o-mini");
  const [expandedRefs, setExpandedRefs] = (0, import_react5.useState)({});
  const [isOpen, setIsOpen] = (0, import_react5.useState)(position !== "bottom-right");
  const [dataSourceType, setDataSourceType] = (0, import_react5.useState)(null);
  const [resolvedNamespace, setResolvedNamespace] = (0, import_react5.useState)(null);
  (0, import_react5.useEffect)(() => {
    setIsOpen(position !== "bottom-right");
  }, [position]);
  (0, import_react5.useEffect)(() => {
    let isMounted = true;
    const init = async () => {
      try {
        setLoading(true);
        const doc = await fetchWidgetConfig2(apiBaseUrl, widgetId, token);
        if (!isMounted) return;
        const innerConfig = doc.config ?? doc;
        setWidget(innerConfig);
        const rawQuestions = Array.isArray(innerConfig.questions) && innerConfig.questions.length > 0 ? innerConfig.questions : Array.isArray(innerConfig.checkboxes) ? innerConfig.checkboxes.map((cb) => cb.label || cb) : [];
        if (rawQuestions.length > 0) setQuestions(rawQuestions);
        const models = innerConfig.allowModels;
        if (models && (Array.isArray(models) ? models.length > 0 : models)) {
          const first = Array.isArray(models) ? models[0] : String(models).split(",")[0];
          if (first) setSelectedModel(first.trim());
        }
        setSelectedFileIds(innerConfig.selectedFileIds ?? []);
        const dataSource = innerConfig.dataSources?.[0] ?? doc?.dataSources?.[0];
        const selectedSource = dataSource?.selectedSource ?? "UnStructured";
        setDataSourceType(selectedSource);
        const namespace = dataSource?.configdetails?.namespace ?? dataSource?.namespace ?? innerConfig?.namespace ?? doc?.namespace;
        const workspaceId = innerConfig.workspaceId ?? doc.workspaceId;
        if (selectedSource === "UnStructured" && workspaceId) {
          try {
            console.warn("[QnaWidget] Fetching namespaces with workspaceId:", workspaceId, "and token:", token, "and apiBaseUrl:", apiBaseUrl);
            const namespaces = await fetchNamespaces2(apiBaseUrl, workspaceId, token);
            if (!isMounted) return;
            let resolvedFiles = [];
            let effectiveNamespace = namespace ?? null;
            if (namespace) {
              const matchedNamespace = namespaces.find((ns) => ns.namespace === namespace);
              console.warn("[QnaWidget] Resolved namespaces:", namespaces, "Matched namespace:", matchedNamespace);
              if (matchedNamespace) {
                resolvedFiles = matchedNamespace.source;
                effectiveNamespace = matchedNamespace.namespace ?? namespace;
              }
            }
            if (resolvedFiles.length === 0) {
              resolvedFiles = namespaces.flatMap((ns) => ns.source ?? ns.files ?? []);
              effectiveNamespace = effectiveNamespace ?? namespaces[0]?.namespace ?? null;
            }
            setAvailableFiles(resolvedFiles);
            setResolvedNamespace(effectiveNamespace);
          } catch (nsErr) {
            console.warn("[QnaWidget] namespace fetch failed (non-fatal):", nsErr);
          } finally {
            if (isMounted) setIsLoadingFiles(false);
          }
        } else if (isMounted) {
          setResolvedNamespace(namespace ?? null);
          setIsLoadingFiles(false);
        }
        let session;
        if (selectedSource === "Structured") {
          const datasetId = dataSource?.datasetId ?? dataSource?.configdetails?.datasetId;
          if (!datasetId) {
            throw new Error("Structured data source requires datasetId");
          }
          console.warn("[QnaWidget] Creating structured session with datasetId:", datasetId);
          session = await createStructuredSession2(apiBaseUrl, token, datasetId, innerConfig.allowModels?.[0]);
        } else {
          console.warn("[QnaWidget] Creating unstructured RAG session");
          session = await createRagSession2(apiBaseUrl, token, innerConfig.allowModels?.[0]);
        }
        if (!isMounted) return;
        const sessionIdValue = session?.sessionId || session?.session_id;
        setSessionId(sessionIdValue);
      } catch (err) {
        if (!isMounted) return;
        const message = err instanceof Error ? err.message : "Failed to initialize widget";
        setError(message);
        onError?.(message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    if (token && widgetId) init();
    return () => {
      isMounted = false;
    };
  }, [token, widgetId, apiBaseUrl, onError]);
  const extractSourcesAndReferences = (text) => {
    let rawText = text || "";
    if (typeof rawText === "string") {
      rawText = rawText.replace(/^"|"$/g, "").trim();
    }
    let bBoxSplitIndex = rawText?.indexOf("\n\nb_box");
    if (bBoxSplitIndex === -1) {
      bBoxSplitIndex = rawText?.indexOf("b_box");
    }
    if (bBoxSplitIndex !== -1 && bBoxSplitIndex !== void 0) {
      let mainText = rawText?.substring(0, bBoxSplitIndex).trim();
      let bboxData = rawText?.slice(bBoxSplitIndex);
      mainText = mainText.replace(/\\n/g, "\n");
      bboxData = bboxData.replace(/^\s*b_box\s*/, "").trim();
      try {
        const refs = JSON.parse(bboxData);
        return {
          text: mainText,
          references: Array.isArray(refs) ? refs.map((ref, index) => ({
            id: index + 1,
            source: ref.metadata?.filename || "Document",
            page: index + 1,
            content: ref.metadata?.text || `Reference ${index + 1}`,
            coords: ref,
            similarity_score: ref.similarity_score,
            chunk_id: ref.chunk_id
          })) : []
        };
      } catch {
        return { text: mainText, references: [] };
      }
    }
    const cleanText = rawText.replace(/\\n/g, "\n");
    return { text: cleanText || "No answer available.", references: [] };
  };
  const handleGenerateAnswers = (0, import_react5.useCallback)(async () => {
    if (!sessionId || questions.length === 0) return;
    setIsProcessing(true);
    setAnswers({});
    try {
      if (dataSourceType === "Structured") {
        for (const question of questions) {
          setCurrentlyProcessing(question);
          try {
            const source = widget?.dataSources?.[0];
            const namespace = source?.configdetails?.namespace ?? source?.namespace;
            const apiResponse = await queryStructuredQnA(
              apiBaseUrl,
              token,
              sessionId,
              question,
              widget?.apiprompt
            );
            const { text, references } = extractSourcesAndReferences(apiResponse);
            setAnswers((prev) => ({
              ...prev,
              [question]: { text, references }
            }));
          } catch (err) {
            console.error("Error processing question:", question, err);
            setAnswers((prev) => ({
              ...prev,
              [question]: { text: "Error retrieving answer.", references: [] }
            }));
          }
        }
      } else {
        const documentIds = selectedFileIds.length > 0 ? selectedFileIds : availableFiles.map((f) => f.file_id || f.document_id);
        const hasMultipleFiles = selectedFileIds.length > 1 && availableFiles.length > 1;
        for (const question of questions) {
          setCurrentlyProcessing(question);
          try {
            if (hasMultipleFiles) {
              const fileAnswers = [];
              for (const fileId of selectedFileIds) {
                const file = availableFiles.find((f) => (f.file_id || f.document_id) === fileId);
                const fileName = file ? file.originalName || file.fileName : fileId;
                const source = widget?.dataSources?.[0];
                const namespace = source?.configdetails?.namespace ?? source?.namespace ?? resolvedNamespace;
                if (!namespace) {
                  fileAnswers.push({ fileId, fileName, text: "No namespace configured for this Q&A source.", references: [] });
                  continue;
                }
                try {
                  const apiResponse = await queryQnA(
                    apiBaseUrl,
                    token,
                    sessionId,
                    question,
                    [fileId],
                    namespace,
                    widget?.topK,
                    widget?.apiprompt
                  );
                  const { text, references } = extractSourcesAndReferences(apiResponse);
                  fileAnswers.push({ fileId, fileName, text, references });
                  setAnswers((prev) => ({
                    ...prev,
                    [question]: { text: "", references: [], fileAnswers: [...fileAnswers] }
                  }));
                } catch (err) {
                  console.error("Error processing file:", fileId, err);
                  fileAnswers.push({ fileId, fileName, text: "Error retrieving answer.", references: [] });
                }
              }
            } else {
              const source = widget?.dataSources?.[0];
              const namespace = source?.configdetails?.namespace ?? source?.namespace ?? resolvedNamespace;
              if (!namespace) {
                setAnswers((prev) => ({
                  ...prev,
                  [question]: { text: "No namespace configured for this Q&A source.", references: [] }
                }));
                continue;
              }
              const apiResponse = await queryQnA(
                apiBaseUrl,
                token,
                sessionId,
                question,
                documentIds,
                namespace,
                widget?.topK,
                widget?.apiprompt
              );
              const { text, references } = extractSourcesAndReferences(apiResponse);
              setAnswers((prev) => ({
                ...prev,
                [question]: { text, references }
              }));
            }
          } catch (err) {
            console.error("Error processing question:", question, err);
            setAnswers((prev) => ({
              ...prev,
              [question]: { text: "Error retrieving answer.", references: [] }
            }));
          }
        }
      }
    } finally {
      setCurrentlyProcessing(null);
      setIsProcessing(false);
    }
  }, [sessionId, questions, selectedFileIds, availableFiles, token, apiBaseUrl, selectedModel, widget, dataSourceType, resolvedNamespace]);
  const isFloating = position === "bottom-right";
  const content = loading ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "yw-qna-widget yw-qna-widget--loading", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "yw-qna-spinner" }) }) : error ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "yw-qna-widget yw-qna-widget--error", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "yw-qna-error-message", children: error }) }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "yw-qna-widget", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "yw-qna-header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { className: "yw-qna-title", children: widget?.widget_title || "Q&A" }),
      dataSourceType === "UnStructured" && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "yw-qna-file-section", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        FileSelectorDropdown,
        {
          files: availableFiles,
          selectedIds: selectedFileIds,
          onChange: setSelectedFileIds,
          isLoading: isLoadingFiles,
          emptyLabel: "No files found",
          showNoSelectionNote: false
        }
      ) })
    ] }),
    questions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "yw-qna-qa-section", children: questions.map((question, qIdx) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "yw-qna-question-block", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "yw-qna-question-title", children: [
        "Q",
        qIdx + 1,
        ": ",
        question
      ] }),
      currentlyProcessing === question && !answers[question] ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "yw-qna-loading-state", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "yw-qna-spinner-mini" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: "Generating answer..." })
      ] }) : answers[question] ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "yw-qna-answer-block", children: answers[question].fileAnswers && answers[question].fileAnswers.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "yw-qna-file-answers", children: answers[question].fileAnswers.map((fa) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "yw-qna-file-answer", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "yw-qna-file-answer-name", children: [
          "\u{1F4C4} ",
          fa.fileName
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "yw-qna-answer-text", children: fa.text }),
        fa.references && fa.references.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "yw-qna-references", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
            "button",
            {
              className: "yw-qna-references-toggle",
              onClick: () => {
                const key = `${qIdx}-file-${fa.fileId}`;
                setExpandedRefs((prev) => ({ ...prev, [key]: !prev[key] }));
              },
              children: [
                expandedRefs[`${qIdx}-file-${fa.fileId}`] ? "Hide" : "Show",
                " References (",
                Math.min(8, fa.references.length),
                ")"
              ]
            }
          ),
          expandedRefs[`${qIdx}-file-${fa.fileId}`] && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "yw-qna-reference-list", children: fa.references.slice(0, 8).map((ref, rIdx) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
            ReferenceItem,
            {
              reference: ref,
              index: rIdx,
              isExpanded: expandedRefs[`${qIdx}-file-${fa.fileId}-ref-${rIdx}`],
              onToggle: () => {
                const key = `${qIdx}-file-${fa.fileId}-ref-${rIdx}`;
                setExpandedRefs((prev) => ({ ...prev, [key]: !prev[key] }));
              }
            },
            `${qIdx}-file-${fa.fileId}-ref-${rIdx}`
          )) })
        ] })
      ] }, fa.fileId)) }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "yw-qna-answer-text", children: answers[question].text }),
        answers[question].references && answers[question].references.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "yw-qna-references", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
            "button",
            {
              className: "yw-qna-references-toggle",
              onClick: () => {
                const key = `${qIdx}`;
                setExpandedRefs((prev) => ({ ...prev, [key]: !prev[key] }));
              },
              children: [
                expandedRefs[`${qIdx}`] ? "Hide" : "Show",
                " References (",
                Math.min(8, answers[question].references.length),
                ")"
              ]
            }
          ),
          expandedRefs[`${qIdx}`] && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "yw-qna-reference-list", children: answers[question].references.slice(0, 8).map((ref, rIdx) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
            ReferenceItem,
            {
              reference: ref,
              index: rIdx,
              isExpanded: expandedRefs[`${qIdx}-ref-${rIdx}`],
              onToggle: () => {
                const key = `${qIdx}-ref-${rIdx}`;
                setExpandedRefs((prev) => ({ ...prev, [key]: !prev[key] }));
              }
            },
            `${qIdx}-ref-${rIdx}`
          )) })
        ] })
      ] }) }) : isProcessing ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "yw-qna-waiting-state", children: "Waiting to process..." }) : null
    ] }, qIdx)) }),
    questions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "yw-qna-controls", children: [
      widget?.allowModels && Array.isArray(widget.allowModels) && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("select", { value: selectedModel, onChange: (e) => setSelectedModel(e.target.value), className: "yw-qna-model-select", children: widget.allowModels.map((model) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: model.trim(), children: model.trim() }, model.trim())) }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { onClick: handleGenerateAnswers, disabled: isProcessing || !sessionId, className: "yw-qna-generate-button", children: isProcessing ? `Generating... (${Object.keys(answers).length}/${questions.length})` : !sessionId ? "Initializing..." : "Generate Answers" })
    ] }),
    !sessionId && !loading && questions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "yw-qna-initializing", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "yw-qna-spinner-mini" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: "Initializing session..." })
    ] })
  ] });
  if (!isFloating) {
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: className || "", children: content });
  }
  const panelStyle = {};
  if (floatingWidth) panelStyle.width = typeof floatingWidth === "number" ? `${floatingWidth}px` : floatingWidth;
  if (floatingHeight) panelStyle.height = typeof floatingHeight === "number" ? `${floatingHeight}px` : floatingHeight;
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: `yw-floating-shell ${className || ""}`, children: [
    !isOpen && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      "button",
      {
        type: "button",
        className: "yw-floating-launcher",
        onClick: () => setIsOpen(true),
        "aria-label": "Open QnA widget",
        title: "Open QnA widget",
        children: launcherLabel
      }
    ),
    isOpen && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "yw-floating-panel", style: panelStyle, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "yw-floating-header", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { className: "yw-floating-title", children: widget?.widget_title ?? "Q&A" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "button",
          {
            type: "button",
            className: "yw-floating-close",
            onClick: () => setIsOpen(false),
            "aria-label": "Close QnA widget",
            children: "x"
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "yw-floating-body", children: content })
    ] })
  ] });
}

// src/widgets/qna/useStreamingQna.ts
var import_react6 = require("react");
function useStreamingQna(options) {
  const [streamedText, setStreamedText] = (0, import_react6.useState)("");
  const [isStreaming, setIsStreaming] = (0, import_react6.useState)(false);
  const [error, setError] = (0, import_react6.useState)(null);
  const [references, setReferences] = (0, import_react6.useState)([]);
  const abortControllerRef = (0, import_react6.useRef)(null);
  const accumulatedRef = (0, import_react6.useRef)("");
  const rafIdRef = (0, import_react6.useRef)(null);
  const referencesRef = (0, import_react6.useRef)([]);
  const reset = (0, import_react6.useCallback)(() => {
    setStreamedText("");
    setError(null);
    setIsStreaming(false);
    setReferences([]);
    accumulatedRef.current = "";
    referencesRef.current = [];
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);
  const abortStreaming = (0, import_react6.useCallback)(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    setIsStreaming(false);
  }, []);
  const scheduleUpdate = (0, import_react6.useCallback)(() => {
    if (rafIdRef.current !== null) return;
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      setStreamedText(accumulatedRef.current);
      if (referencesRef.current.length > 0) {
        setReferences([...referencesRef.current]);
        options?.onReferences?.(referencesRef.current);
      }
    });
  }, [options]);
  const startStreaming = (0, import_react6.useCallback)(
    async (params) => {
      const {
        question,
        documentIds,
        token,
        customPrompt,
        yaviLlmConfigName,
        fileNameMap,
        streamUrl,
        topK,
        temperature
      } = params;
      accumulatedRef.current = "";
      referencesRef.current = [];
      setStreamedText("");
      setReferences([]);
      setError(null);
      setIsStreaming(true);
      const controller = new AbortController();
      abortControllerRef.current = controller;
      try {
        const res = await fetch(streamUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            question,
            documentIds,
            customPrompt,
            yaviLlmConfigName,
            topK: topK ?? 10,
            temperature: temperature ?? 0.7
          }),
          signal: controller.signal
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          const msg = errData?.error ?? `Request failed (${res.status})`;
          setError(msg);
          setIsStreaming(false);
          options?.onError?.(msg);
          return;
        }
        const reader = res.body?.getReader();
        if (!reader) {
          const msg = "No response body from stream endpoint";
          setError(msg);
          setIsStreaming(false);
          options?.onError?.(msg);
          return;
        }
        const decoder = new TextDecoder();
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: ")) continue;
            const data = trimmed.slice(6).trim();
            if (!data || data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === "answer_chunk" || parsed.content) {
                const content = parsed.content ?? parsed.text ?? "";
                if (content) {
                  accumulatedRef.current += content;
                  scheduleUpdate();
                  options?.onChunk?.(content);
                }
              }
              if (parsed.type === "references" && parsed.references) {
                const newRefs = Array.isArray(parsed.references) ? parsed.references : [parsed.references];
                newRefs.forEach((ref) => {
                  if (ref && ref.document_id && !referencesRef.current.some((r) => r.document_id === ref.document_id && r.chunk_id === ref.chunk_id)) {
                    referencesRef.current.push({
                      document_id: ref.document_id,
                      filename: fileNameMap?.[ref.document_id] ?? ref.filename ?? "Unknown",
                      content: ref.content ?? "",
                      similarity_score: ref.similarity_score,
                      page: ref.page,
                      chunk_id: ref.chunk_id,
                      metadata: ref.metadata
                    });
                  }
                });
                scheduleUpdate();
              }
              if (parsed.type === "metadata" && parsed.metadatas) {
                const metadataRefs = Object.values(parsed.metadatas).flat();
                metadataRefs.forEach((ref) => {
                  if (ref?.metadata?.document_id) {
                    const docId = ref.metadata.document_id;
                    if (!referencesRef.current.some((r) => r.document_id === docId)) {
                      referencesRef.current.push({
                        document_id: docId,
                        filename: fileNameMap?.[docId] ?? ref.metadata.filename ?? "Unknown",
                        content: ref.metadata.content ?? ref.text ?? "",
                        similarity_score: ref.similarity_score,
                        page: ref.metadata.page,
                        metadata: ref.metadata
                      });
                    }
                  }
                });
                scheduleUpdate();
              }
              if (parsed.error) {
                setError(parsed.error);
                options?.onError?.(parsed.error);
              }
            } catch {
            }
          }
        }
        setIsStreaming(false);
        options?.onComplete?.(accumulatedRef.current);
      } catch (err) {
        if (err.name !== "AbortError") {
          const msg = err.message ?? "Streaming error occurred";
          setError(msg);
          options?.onError?.(msg);
        }
        setIsStreaming(false);
      }
    },
    [options, scheduleUpdate]
  );
  return {
    streamedText,
    isStreaming,
    error,
    references,
    startStreaming,
    abortStreaming,
    reset
  };
}

// src/widgets/linkedinpost/LinkedInPostGeneratorWidget.tsx
var import_react7 = require("react");

// src/widgets/linkedinpost/api.ts
async function fetchWidgetConfig3(apiBaseUrl, widgetId, token) {
  const res = await fetch(`${apiBaseUrl}/widget/${widgetId}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store"
  });
  if (!res.ok) throw new Error(`Widget fetch failed: ${res.status}`);
  const data = await res.json();
  return data.widget ?? data;
}
async function createRagSession3(apiBaseUrl, token, yaviLlmConfigName = "gpt-4o-mini") {
  const res = await fetch(`${apiBaseUrl}/proxy/rag/rag/api/v2/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      bot_mode: "standard_v2",
      yavi_llm_config_name: yaviLlmConfigName,
      yavi_embedding_config_name: "azure-embedding-small",
      llm_parameters: {
        frequency_penalty: 0,
        presence_penalty: 0,
        temperature: 0.7,
        max_tokens: 2e3,
        top_p: 1
      }
    })
  });
  if (!res.ok) throw new Error(`Session creation failed: ${res.status}`);
  return res.json();
}
async function createStructuredSession3(apiBaseUrl, token, datasetId, yaviLlmConfigName = "gpt-4o-mini") {
  const res = await fetch(`${apiBaseUrl}/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      type: "structured",
      datasetId,
      yaviLlmConfigName
    })
  });
  if (!res.ok) throw new Error(`Structured session failed: ${res.status}`);
  return res.json();
}
async function fetchNamespaces3(apiBaseUrl, workspaceId, token) {
  const res = await fetch(`${apiBaseUrl}/namespaces/${workspaceId}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store"
  });
  if (!res.ok) throw new Error(`Namespaces fetch failed: ${res.status}`);
  return res.json();
}
function resolveDocumentIds3(selectedFileIds, availableFiles) {
  const fallbackAll = availableFiles.map((f) => f.document_id ?? f.file_id).filter(Boolean);
  if (!selectedFileIds.length) return fallbackAll;
  const byFileId = /* @__PURE__ */ new Map();
  availableFiles.forEach((f) => {
    byFileId.set(f.file_id, f.document_id ?? f.file_id);
  });
  return selectedFileIds.map((id) => byFileId.get(id) ?? id).filter(Boolean);
}
function buildLinkedInPrompt(config) {
  const {
    postType = "standard",
    lengthTarget = "medium",
    tone = "professional",
    authorPersona = "professional",
    audienceTarget = "general",
    contentFocus = "insights",
    mandatoryHashtags = [],
    blockedHashtags = [],
    hashtagCount = 3,
    includeEmojis = true,
    includeCallToAction = true,
    customInstructions = ""
  } = config;
  const charLimit = lengthTarget === "short" ? 700 : lengthTarget === "long" ? 3e3 : 1500;
  const wordLimit = lengthTarget === "short" ? 100 : lengthTarget === "long" ? 450 : 225;
  return `You are a professional LinkedIn content creator. Generate a ${postType} LinkedIn post based on the provided content.

**CRITICAL LENGTH CONSTRAINT (MUST FOLLOW):**
- HARD MAXIMUM: ${charLimit} characters (including spaces, hashtags, and emojis)
- Aim for approximately ${wordLimit} words or fewer
- This is a STRICT limit. The post MUST be under ${charLimit} characters total. Do NOT exceed this under any circumstances.

**SPECIFICATIONS:**
- Tone: ${tone}
- Author Persona: ${authorPersona}
- Target Audience: ${audienceTarget}
- Content Focus: ${contentFocus}

**INSTRUCTIONS:**
1. Extract key insights from source content
2. Start with a strong hook in the first 2 lines
3. Use line breaks for readability
4. ${includeEmojis ? "Include relevant professional emojis sparingly" : "Do not use emojis"}
5. Base all claims on actual content
6. Make it engaging and mobile-optimized

**HASHTAGS:**
- Include exactly ${hashtagCount} hashtags at the end${mandatoryHashtags.length ? `
- Must include: ${mandatoryHashtags.join(", ")}` : ""}${blockedHashtags.length ? `
- Never use: ${blockedHashtags.join(", ")}` : ""}
${includeCallToAction ? "\n**CTA:** Include a brief call-to-action" : ""}${customInstructions ? `

**CUSTOM INSTRUCTIONS:** ${customInstructions}` : ""}

**OUTPUT:** Generate only ready-to-publish LinkedIn post text.`;
}
function extractPostText(payload) {
  if (!payload) return "";
  if (typeof payload === "string") return payload;
  if (Array.isArray(payload?.summaries) && payload.summaries.length > 0) {
    const first = payload.summaries[0];
    if (typeof first === "string") return first;
    if (typeof first?.summary === "string") return first.summary;
  }
  if (typeof payload?.summary === "string") return payload.summary;
  if (typeof payload?.postContent === "string") return payload.postContent;
  if (typeof payload?.answer === "string") return payload.answer;
  return "";
}
async function generateLinkedInPostFromDocuments(apiBaseUrl, token, documentIds, config, yaviLlmConfigName = "gpt-4o-mini") {
  const prompt = buildLinkedInPrompt(config);
  const res = await fetch(`${apiBaseUrl}/proxy/rag/rag/api/v1/summary`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      custom_prompt: prompt,
      document_ids: documentIds,
      separate: false,
      yavi_llm_config_name: yaviLlmConfigName
    })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LinkedIn generation failed (${res.status}): ${text}`);
  }
  const data = await res.json();
  const post = extractPostText(data);
  if (!post.trim()) throw new Error("Generated post is empty");
  return post;
}
async function generateLinkedInPostFromStructuredData(apiBaseUrl, token, sessionId, config) {
  const prompt = buildLinkedInPrompt(config);
  const res = await fetch(`${apiBaseUrl}/structured-chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ sessionId, prompt })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Structured LinkedIn generation failed (${res.status}): ${text}`);
  }
  const data = await res.json();
  const post = extractPostText(data);
  if (!post.trim()) throw new Error("Generated post is empty");
  return post;
}

// src/lib/markdown.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
function renderMarkdown2(content) {
  if (!content) return null;
  const elements = [];
  const lines = content.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = renderInlineMarkdown(headingMatch[2]);
      const HeadingTag = `h${level}`;
      elements.push(
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          HeadingTag,
          {
            style: {
              marginTop: "0.8em",
              marginBottom: "0.4em",
              lineHeight: 1.4
            },
            children: text
          },
          `heading-${i}`
        )
      );
      i++;
      continue;
    }
    if (line.trim().startsWith("```")) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      elements.push(
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          "pre",
          {
            style: {
              background: "#f5f5f5",
              padding: "12px",
              borderRadius: "6px",
              overflow: "auto",
              fontSize: "0.9em",
              margin: "0.8em 0"
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("code", { children: codeLines.join("\n") })
          },
          `code-${i}`
        )
      );
      continue;
    }
    if (line.trim().startsWith(">")) {
      const quoteLines = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(
          lines[i].replace(/^\s*>\s*/, "")
        );
        i++;
      }
      elements.push(
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          "blockquote",
          {
            style: {
              borderLeft: "4px solid #ccc",
              paddingLeft: "12px",
              margin: "0.8em 0",
              color: "#666",
              fontStyle: "italic"
            },
            children: renderMarkdown2(quoteLines.join("\n"))
          },
          `quote-${i}`
        )
      );
      continue;
    }
    if (line.trim().match(/^[-*+]\s+/) || line.trim().match(/^\d+\.\s+/)) {
      const listItems = [];
      const isOrdered = !!line.trim().match(/^\d+\./);
      while (i < lines.length && (lines[i].trim().match(/^[-*+]\s+/) || lines[i].trim().match(/^\d+\.\s+/))) {
        listItems.push(
          lines[i].replace(/^[-*+]\s+|\d+\.\s+/, "").trim()
        );
        i++;
      }
      const ListTag = isOrdered ? "ol" : "ul";
      elements.push(
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          ListTag,
          {
            style: {
              margin: "0.8em 0",
              paddingLeft: "20px",
              lineHeight: 1.7
            },
            children: listItems.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("li", { children: renderInlineMarkdown(item) }, idx))
          },
          `list-${i}`
        )
      );
      continue;
    }
    if (!line.trim()) {
      i++;
      continue;
    }
    const paragraphLines = [];
    while (i < lines.length && lines[i].trim() && !lines[i].match(/^#{1,6}\s+/) && !lines[i].trim().startsWith("```") && !lines[i].trim().startsWith(">") && !lines[i].trim().match(/^[-*+]\s+/) && !lines[i].trim().match(/^\d+\.\s+/)) {
      paragraphLines.push(lines[i]);
      i++;
    }
    if (paragraphLines.length > 0) {
      elements.push(
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          "p",
          {
            style: {
              margin: "0.8em 0",
              whiteSpace: "pre-wrap",
              lineHeight: 1.7
            },
            children: renderInlineMarkdown(
              paragraphLines.join("\n")
            )
          },
          `para-${i}`
        )
      );
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_jsx_runtime5.Fragment, { children: elements });
}
function renderInlineMarkdown(text) {
  if (!text) return null;
  const elements = [];
  let remaining = text;
  let key = 0;
  const patterns = [
    {
      regex: /^\[([^\]]+)\]\(([^)]+)\)/,
      render: (match) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "a",
        {
          href: match[2],
          target: "_blank",
          rel: "noopener noreferrer",
          style: {
            color: "#3b82f6",
            textDecoration: "underline"
          },
          children: match[1]
        },
        key++
      )
    },
    {
      regex: /^\*\*(.*?)\*\*/,
      render: (match) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "strong",
        {
          style: { fontWeight: 700 },
          children: match[1]
        },
        key++
      )
    },
    {
      regex: /^__(.*?)__/,
      render: (match) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "strong",
        {
          style: { fontWeight: 700 },
          children: match[1]
        },
        key++
      )
    },
    {
      regex: /^\*(.*?)\*/,
      render: (match) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "em",
        {
          style: { fontStyle: "italic" },
          children: match[1]
        },
        key++
      )
    },
    {
      regex: /^_(.*?)_/,
      render: (match) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "em",
        {
          style: { fontStyle: "italic" },
          children: match[1]
        },
        key++
      )
    },
    {
      regex: /^~~(.*?)~~/,
      render: (match) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "del",
        {
          style: {
            textDecoration: "line-through"
          },
          children: match[1]
        },
        key++
      )
    },
    {
      regex: /^`([^`]+)`/,
      render: (match) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "code",
        {
          style: {
            background: "#f0f0f0",
            padding: "2px 6px",
            borderRadius: "3px",
            fontFamily: "monospace",
            fontSize: "0.9em"
          },
          children: match[1]
        },
        key++
      )
    }
  ];
  while (remaining.length > 0) {
    let matched = false;
    for (const pattern of patterns) {
      const match = remaining.match(pattern.regex);
      if (match) {
        elements.push(pattern.render(match));
        remaining = remaining.slice(
          match[0].length
        );
        matched = true;
        break;
      }
    }
    if (!matched) {
      elements.push(remaining[0]);
      remaining = remaining.slice(1);
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_jsx_runtime5.Fragment, { children: elements });
}

// src/widgets/linkedinpost/linkedinpost.css
styleInject('.ylg-root {\n  width: 100%;\n}\n.ylg-page-bg {\n  background:\n    linear-gradient(\n      135deg,\n      #eff6ff 0%,\n      #ffffff 52%,\n      #f5f3ff 100%);\n  padding: 24px 12px;\n}\n.ylg-container {\n  max-width: 980px;\n  margin: 0 auto;\n}\n.ylg-top-row {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 16px;\n  margin-bottom: 16px;\n}\n.ylg-title {\n  margin: 0;\n  font-size: 1.85rem;\n  line-height: 1.2;\n  font-weight: 700;\n  color: #111827;\n}\n.ylg-file-dd {\n  width: 320px;\n}\n.ylg-card {\n  background: #ffffff;\n  border-radius: 14px;\n  padding: 20px;\n  border: 1px solid #e5e7eb;\n}\n.ylg-card--elevated {\n  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);\n}\n.ylg-card--flat {\n  box-shadow: none;\n}\n.ylg-card--outlined {\n  border: 2px solid #3b82f6;\n  box-shadow: none;\n}\n.ylg-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  border-bottom: 1px solid #e5e7eb;\n  padding-bottom: 14px;\n}\n.ylg-header-left {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.ylg-badge {\n  width: 46px;\n  height: 46px;\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      135deg,\n      #3b82f6 0%,\n      #1d4ed8 100%);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: #ffffff;\n}\n.ylg-badge svg {\n  width: 24px;\n  height: 24px;\n}\n.ylg-header-left h3 {\n  margin: 0;\n  font-size: 1.03rem;\n  color: #111827;\n}\n.ylg-header-left p {\n  margin: 2px 0 0;\n  color: #6b7280;\n  font-size: 0.86rem;\n}\n.ylg-icon-actions {\n  display: flex;\n  gap: 8px;\n}\n.ylg-icon-actions button {\n  border: 1px solid #d1d5db;\n  border-radius: 8px;\n  background: #fff;\n  color: #374151;\n  font-size: 0.8rem;\n  padding: 7px 10px;\n  cursor: pointer;\n}\n.ylg-icon-actions button:hover {\n  background: #f9fafb;\n}\n.ylg-meta {\n  margin-top: 12px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 10px;\n  background: #f9fafb;\n  border-radius: 10px;\n  padding: 10px 12px;\n  color: #4b5563;\n  font-size: 0.88rem;\n}\n.ylg-meta-left {\n  display: flex;\n  gap: 14px;\n  align-items: center;\n}\n.ylg-safe {\n  color: #16a34a;\n}\n.ylg-warn {\n  color: #d97706;\n}\n.ylg-danger {\n  color: #dc2626;\n}\n.ylg-hash-count {\n  color: #2563eb;\n}\n.ylg-content-box {\n  margin-top: 12px;\n  border: 1px solid #e5e7eb;\n  border-radius: 10px;\n  padding: 16px;\n  background: #ffffff;\n  min-height: 200px;\n}\n.ylg-content {\n  white-space: pre-wrap;\n  line-height: 1.7;\n  color: #1f2937;\n}\n.ylg-markdown {\n  white-space: normal;\n  word-break: break-word;\n  overflow-wrap: break-word;\n}\n.ylg-markdown h1,\n.ylg-markdown h2,\n.ylg-markdown h3,\n.ylg-markdown h4,\n.ylg-markdown h5,\n.ylg-markdown h6 {\n  font-weight: 600;\n  margin: 1em 0 0.5em 0;\n  color: #111827;\n}\n.ylg-markdown h1 {\n  font-size: 1.6em;\n}\n.ylg-markdown h2 {\n  font-size: 1.4em;\n}\n.ylg-markdown h3 {\n  font-size: 1.25em;\n}\n.ylg-markdown h4 {\n  font-size: 1.1em;\n}\n.ylg-markdown h5 {\n  font-size: 1em;\n}\n.ylg-markdown h6 {\n  font-size: 0.9em;\n}\n.ylg-markdown p {\n  margin: 0.6em 0;\n}\n.ylg-markdown strong {\n  font-weight: 700;\n  color: #111827;\n}\n.ylg-markdown em {\n  font-style: italic;\n  color: #374151;\n}\n.ylg-markdown del {\n  color: #9ca3af;\n}\n.ylg-markdown code {\n  background: #f5f5f5;\n  padding: 2px 6px;\n  border-radius: 3px;\n  font-family: "Courier New", monospace;\n  font-size: 0.9em;\n  color: #d1495b;\n}\n.ylg-markdown pre {\n  background: #f5f5f5;\n  padding: 12px;\n  border-radius: 6px;\n  overflow: auto;\n  margin: 0.8em 0;\n  font-size: 0.9em;\n}\n.ylg-markdown pre code {\n  background: none;\n  padding: 0;\n  border-radius: 0;\n  color: #1f2937;\n}\n.ylg-markdown blockquote {\n  border-left: 4px solid #ccc;\n  padding-left: 12px;\n  margin: 0.8em 0;\n  color: #666;\n  font-style: italic;\n}\n.ylg-markdown ul,\n.ylg-markdown ol {\n  margin: 0.8em 0;\n  padding-left: 24px;\n}\n.ylg-markdown li {\n  margin: 0.4em 0;\n}\n.ylg-markdown a {\n  color: #3b82f6;\n  text-decoration: underline;\n  cursor: pointer;\n}\n.ylg-markdown a:hover {\n  color: #2563eb;\n  text-decoration: none;\n}\n.ylg-editor {\n  width: 100%;\n  min-height: 300px;\n  box-sizing: border-box;\n  border: 1px solid #93c5fd;\n  border-radius: 10px;\n  padding: 12px;\n  font: inherit;\n  line-height: 1.6;\n}\n.ylg-editor:focus {\n  outline: none;\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.16);\n}\n.ylg-source {\n  margin-top: 10px;\n  border-radius: 8px;\n  background: #eff6ff;\n  color: #4b5563;\n  padding: 9px 10px;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 0.78rem;\n}\n.ylg-source-label {\n  font-weight: 700;\n}\n.ylg-source-time {\n  margin-left: auto;\n}\n.ylg-actions {\n  margin-top: 14px;\n  border-top: 1px solid #e5e7eb;\n  padding-top: 14px;\n  display: flex;\n  justify-content: space-between;\n  gap: 10px;\n}\n.ylg-actions-left,\n.ylg-actions-right {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n.ylg-btn {\n  border: none;\n  border-radius: 8px;\n  padding: 9px 14px;\n  font-size: 0.86rem;\n  font-weight: 600;\n  cursor: pointer;\n}\n.ylg-btn-muted {\n  background: #e5e7eb;\n  color: #374151;\n}\n.ylg-btn-save {\n  background: #16a34a;\n  color: #ffffff;\n}\n.ylg-btn-linkedin {\n  background: #2563eb;\n  color: #ffffff;\n}\n.ylg-btn-regen {\n  background: #ea580c;\n  color: #ffffff;\n}\n.ylg-btn:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.ylg-btn:hover:not(:disabled) {\n  filter: brightness(1.05);\n}\n.ylg-loading-wrap,\n.ylg-error-wrap {\n  min-height: 180px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.ylg-error-wrap {\n  color: #b91c1c;\n  background: #fef2f2;\n  border: 1px solid #fecaca;\n  border-radius: 10px;\n  padding: 10px;\n}\n.ylg-spinner {\n  width: 26px;\n  height: 26px;\n  border-radius: 999px;\n  border: 3px solid #dbeafe;\n  border-top-color: #2563eb;\n  animation: ylg-spin 0.8s linear infinite;\n}\n.ylg-spinner--small {\n  width: 18px;\n  height: 18px;\n  border-width: 2px;\n}\n@keyframes ylg-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.ylg-floating-loader {\n  position: fixed;\n  bottom: 20px;\n  right: 20px;\n  background: #ffffff;\n  border: 1px solid #d1d5db;\n  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);\n  border-radius: 10px;\n  padding: 10px 12px;\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  z-index: 200;\n}\n.ylg-floating-shell {\n  position: fixed;\n  right: 16px;\n  bottom: 16px;\n  z-index: 9999;\n}\n.ylg-floating-launcher {\n  width: 56px;\n  height: 56px;\n  border-radius: 999px;\n  border: none;\n  background:\n    linear-gradient(\n      135deg,\n      #2563eb 0%,\n      #1d4ed8 100%);\n  color: #ffffff;\n  font-size: 1rem;\n  font-weight: 700;\n  cursor: pointer;\n  box-shadow: 0 12px 24px rgba(37, 99, 235, 0.35);\n}\n.ylg-floating-panel {\n  width: min(540px, calc(100vw - 24px));\n  height: min(760px, calc(100vh - 24px));\n  background: #ffffff;\n  border: 1px solid #dbe4f2;\n  border-radius: 14px;\n  box-shadow: 0 20px 50px rgba(2, 6, 23, 0.2);\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n}\n.ylg-floating-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  padding: 10px 12px;\n  background: #eff6ff;\n  border-bottom: 1px solid #dbeafe;\n}\n.ylg-floating-title {\n  font-size: 0.9rem;\n  color: #1e3a8a;\n}\n.ylg-floating-close {\n  border: none;\n  background: transparent;\n  color: #1e3a8a;\n  width: 28px;\n  height: 28px;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 1rem;\n  line-height: 1;\n}\n.ylg-floating-close:hover {\n  background: #dbeafe;\n}\n.ylg-floating-body {\n  flex: 1;\n  overflow: auto;\n}\n@media (max-width: 900px) {\n  .ylg-top-row {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n  .ylg-file-dd {\n    width: 100%;\n  }\n  .ylg-actions {\n    flex-direction: column;\n  }\n  .ylg-actions-right {\n    width: 100%;\n  }\n  .ylg-btn-linkedin,\n  .ylg-btn-regen {\n    flex: 1;\n  }\n}\n@media (max-width: 640px) {\n  .ylg-page-bg {\n    padding: 12px 8px;\n  }\n  .ylg-title {\n    font-size: 1.45rem;\n  }\n  .ylg-meta {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n  .ylg-meta-left {\n    flex-wrap: wrap;\n    gap: 8px;\n  }\n  .ylg-floating-shell {\n    right: 10px;\n    left: 10px;\n    bottom: 10px;\n  }\n  .ylg-floating-panel {\n    width: 100%;\n    height: min(82vh, calc(100vh - 20px));\n  }\n}\n');

// src/widgets/linkedinpost/LinkedInPostGeneratorWidget.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
var LinkedInIcon = () => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("svg", { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" }) });
function toDisplayName(file) {
  return file.originalName ?? file.original_file_name ?? file.fileName ?? file.filename ?? file.file_id;
}
function stripMarkdown(md) {
  return md.replace(/^#{1,6}\s+(.+)$/gm, "$1").replace(/\*\*(.+?)\*\*/g, "$1").replace(/__(.+?)__/g, "$1").replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "$1").replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, "$1").replace(/~~(.+?)~~/g, "$1").replace(/^[\-*+]\s+/gm, "\u2022 ").replace(/\[([^\]]+)\]\(([^\)]+)\)/g, "$1 ($2)").replace(/```[\s\S]*?```/g, (m) => m.replace(/```\w*\n?/g, "").trim()).replace(/`([^`]+)`/g, "$1").replace(/^>\s+/gm, "").replace(/<[^>]*>/g, "").replace(/\n{3,}/g, "\n\n").trim();
}
function maxChars(lengthTarget) {
  if (lengthTarget === "short") return 700;
  if (lengthTarget === "long") return 3e3;
  return 1500;
}
function LinkedInPostGeneratorWidget({
  widgetId,
  token,
  apiBaseUrl,
  onTokenExpired,
  onError,
  className,
  position = "inline",
  launcherLabel = "in",
  floatingWidth,
  floatingHeight
}) {
  const base = apiBaseUrl.replace(/\/$/, "");
  const [loading, setLoading] = (0, import_react7.useState)(true);
  const [error, setError] = (0, import_react7.useState)(null);
  const [widget, setWidget] = (0, import_react7.useState)(null);
  const [sessionId, setSessionId] = (0, import_react7.useState)(null);
  const [availableFiles, setAvailableFiles] = (0, import_react7.useState)([]);
  const [selectedFileIds, setSelectedFileIds] = (0, import_react7.useState)([]);
  const [post, setPost] = (0, import_react7.useState)(null);
  const [fetchingFresh, setFetchingFresh] = (0, import_react7.useState)(false);
  const [isEditing, setIsEditing] = (0, import_react7.useState)(false);
  const [editedContent, setEditedContent] = (0, import_react7.useState)("");
  const [isCopied, setIsCopied] = (0, import_react7.useState)(false);
  const [isOpen, setIsOpen] = (0, import_react7.useState)(position !== "bottom-right");
  const postRef = (0, import_react7.useRef)(null);
  const hasAutoFetched = (0, import_react7.useRef)(false);
  (0, import_react7.useEffect)(() => {
    setIsOpen(position !== "bottom-right");
  }, [position]);
  const config = widget?.config ?? {};
  const postContent = isEditing ? editedContent : post?.postContent ?? config.samplePost ?? "Your AI-generated LinkedIn post will appear here.";
  const charLimit = maxChars(config.lengthTarget);
  const charCount = postContent.length;
  const selectedModel = (0, import_react7.useMemo)(() => {
    const models = config.allowModels;
    if (Array.isArray(models) && models.length > 0) return models[0];
    if (typeof models === "string" && models.trim()) return models;
    return "gpt-4o-mini";
  }, [config.allowModels]);
  (0, import_react7.useEffect)(() => {
    let disposed = false;
    const init = async () => {
      try {
        setLoading(true);
        setError(null);
        const doc = await fetchWidgetConfig3(base, widgetId, token);
        if (disposed) return;
        setWidget(doc);
        const source = doc.config?.dataSources?.[0];
        const namespace = source?.configdetails?.namespace;
        const workspaceId = doc.config?.workspaceId;
        if (namespace && workspaceId) {
          const ns = await fetchNamespaces3(base, workspaceId, token);
          if (disposed) return;
          const found = ns.find((n) => n.namespace === namespace);
          const files = found?.source ?? [];
          setAvailableFiles(files);
          const saved = doc.config?.selectedFileIds ?? [];
          if (saved.length > 0) {
            setSelectedFileIds(saved);
          } else {
            setSelectedFileIds(files.map((f) => f.file_id || f.document_id).filter(Boolean));
          }
        }
        let sid = null;
        if (source?.selectedSource === "Structured" || source?.configdetails?.datasetId || source?.datasetId) {
          const datasetId = source?.configdetails?.datasetId ?? source?.datasetId ?? "";
          if (datasetId) {
            const session = await createStructuredSession3(base, token, datasetId, selectedModel);
            sid = session.sessionId ?? session.session_id ?? null;
          }
        } else if (source?.selectedSource === "UnStructured" || !source?.selectedSource) {
          const session = await createRagSession3(base, token, selectedModel);
          sid = session.session_id ?? null;
        }
        if (disposed) return;
        setSessionId(sid);
      } catch (err) {
        const message = err?.message ?? "Failed to initialize LinkedIn widget";
        if (!disposed) {
          setError(message);
          onError?.(message);
        }
      } finally {
        if (!disposed) setLoading(false);
      }
    };
    init();
    return () => {
      disposed = true;
    };
  }, [base, widgetId, token, selectedModel, onError]);
  const generatePost = (0, import_react7.useCallback)(async () => {
    if (!widget) return;
    try {
      setFetchingFresh(true);
      const source = widget.config?.dataSources?.[0];
      let text = "";
      if (source?.selectedSource === "Structured") {
        if (!sessionId) throw new Error("Session not ready for structured generation");
        text = await generateLinkedInPostFromStructuredData(base, token, sessionId, widget.config);
      } else {
        const docIds = resolveDocumentIds3(selectedFileIds, availableFiles);
        if (!docIds.length) throw new Error("No valid document found for post generation.");
        text = await generateLinkedInPostFromDocuments(base, token, docIds, widget.config, selectedModel);
      }
      const hashtags = text.match(/#[\w]+/g) || [];
      const sourceName = availableFiles.length > 0 ? toDisplayName(availableFiles[0]) : void 0;
      const nextPost = {
        postContent: text,
        postType: widget.config?.postType || "standard",
        lengthTarget: widget.config?.lengthTarget || "medium",
        tone: widget.config?.tone || "professional",
        characterCount: text.length,
        hashtags,
        source: {
          filename: sourceName,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      };
      setPost(nextPost);
      setEditedContent(text);
      setIsEditing(false);
    } catch (err) {
      const msg = err?.message ?? "Could not generate LinkedIn post";
      if (msg.includes("401")) onTokenExpired?.();
      onError?.(msg);
      setError(msg);
    } finally {
      setFetchingFresh(false);
    }
  }, [widget, sessionId, base, token, selectedFileIds, availableFiles, selectedModel, onError, onTokenExpired]);
  (0, import_react7.useEffect)(() => {
    if (loading || hasAutoFetched.current || !widget) return;
    const source = widget.config?.dataSources?.[0];
    if (source?.selectedSource === "Structured" && !sessionId) return;
    hasAutoFetched.current = true;
    void generatePost();
  }, [loading, widget, sessionId, generatePost]);
  const copyPost = async () => {
    try {
      const text = stripMarkdown(postContent);
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1600);
    } catch {
      onError?.("Failed to copy to clipboard");
    }
  };
  const downloadPost = () => {
    const text = stripMarkdown(postContent);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    a.download = `linkedin-post-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  const shareToLinkedIn = async () => {
    const text = stripMarkdown(postContent);
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
    try {
      await navigator.clipboard.writeText(text);
    } catch {
    }
  };
  const saveEdit = () => {
    const next = editedContent.trim() ? editedContent : postContent;
    setPost((prev) => ({
      postContent: next,
      postType: prev?.postType ?? "standard",
      lengthTarget: prev?.lengthTarget ?? "medium",
      tone: prev?.tone ?? "professional",
      characterCount: next.length,
      hashtags: next.match(/#[\w]+/g) || [],
      source: prev?.source
    }));
    setIsEditing(false);
  };
  const content = loading ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "ylg-loading-wrap", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "ylg-spinner" }) }) : error ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "ylg-error-wrap", children: error }) : /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "ylg-root", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "ylg-page-bg", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ylg-container", children: [
    (config.widget_title || availableFiles.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ylg-top-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h1", { className: "ylg-title", children: config.widget_title ?? "LinkedIn Post Generator" }),
      availableFiles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "ylg-file-dd", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        FileSelectorDropdown,
        {
          files: availableFiles,
          selectedIds: selectedFileIds,
          onChange: setSelectedFileIds,
          showNoSelectionNote: true
        }
      ) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: `ylg-card ylg-card--${config.cardStyle ?? "elevated"}`, children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ylg-header", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ylg-header-left", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "ylg-badge", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(LinkedInIcon, {}) }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h3", { children: "LinkedIn Post Generator" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { children: "AI-Powered Content" })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ylg-icon-actions", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { onClick: copyPost, title: isCopied ? "Copied" : "Copy", children: isCopied ? "Copied" : "Copy" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { onClick: downloadPost, title: "Download", children: "Download" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ylg-meta", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ylg-meta-left", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { children: [
            "\u{1F4DD} ",
            post?.postType ?? config.postType ?? "standard"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { children: [
            "\u270D\uFE0F ",
            post?.tone ?? config.tone ?? "professional"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: charCount > charLimit ? "ylg-danger" : charCount > charLimit * 0.85 ? "ylg-warn" : "ylg-safe", children: [
            charCount,
            " / ",
            charLimit,
            " chars"
          ] })
        ] }),
        !!post?.hashtags?.length && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "ylg-hash-count", children: [
          "#",
          post.hashtags.length,
          " hashtags"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "ylg-content-box", children: isEditing ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        "textarea",
        {
          value: editedContent,
          onChange: (e) => setEditedContent(e.target.value),
          className: "ylg-editor"
        }
      ) : /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { ref: postRef, className: "ylg-content ylg-markdown", children: renderMarkdown2(postContent) }) }),
      post?.source?.filename && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ylg-source", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ylg-source-label", children: "\u{1F4C4} Source:" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: post.source.filename }),
        post.source.timestamp && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ylg-source-time", children: new Date(post.source.timestamp).toLocaleString() })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ylg-actions", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ylg-actions-left", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { className: "ylg-btn ylg-btn-muted", onClick: () => {
            if (isEditing) {
              setEditedContent(post?.postContent ?? "");
              setIsEditing(false);
            } else {
              setEditedContent(post?.postContent ?? postContent);
              setIsEditing(true);
            }
          }, children: isEditing ? "Cancel" : "Edit" }),
          isEditing && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { className: "ylg-btn ylg-btn-save", onClick: saveEdit, children: "Save" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ylg-actions-right", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { className: "ylg-btn ylg-btn-linkedin", onClick: shareToLinkedIn, children: "Share to LinkedIn" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { className: "ylg-btn ylg-btn-regen", onClick: () => void generatePost(), disabled: fetchingFresh, children: fetchingFresh ? "Generating..." : "Regenerate" })
        ] })
      ] })
    ] }),
    fetchingFresh && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ylg-floating-loader", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "ylg-spinner ylg-spinner--small" }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "Generating LinkedIn post..." })
    ] })
  ] }) }) });
  if (position !== "bottom-right") {
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: className ?? "", children: content });
  }
  const panelStyle = {};
  if (floatingWidth) panelStyle.width = typeof floatingWidth === "number" ? `${floatingWidth}px` : floatingWidth;
  if (floatingHeight) panelStyle.height = typeof floatingHeight === "number" ? `${floatingHeight}px` : floatingHeight;
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: `ylg-floating-shell ${className ?? ""}`, children: [
    !isOpen && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      "button",
      {
        type: "button",
        className: "ylg-floating-launcher",
        onClick: () => setIsOpen(true),
        "aria-label": "Open LinkedIn post widget",
        title: "Open LinkedIn post widget",
        children: launcherLabel
      }
    ),
    isOpen && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ylg-floating-panel", style: panelStyle, children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ylg-floating-header", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("strong", { className: "ylg-floating-title", children: config.widget_title ?? "LinkedIn Post Generator" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          "button",
          {
            type: "button",
            className: "ylg-floating-close",
            onClick: () => setIsOpen(false),
            "aria-label": "Close LinkedIn post widget",
            children: "x"
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "ylg-floating-body", children: content })
    ] })
  ] });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ChatBot,
  ChatWidget,
  LinkedInPostGeneratorWidget,
  QnaWidget,
  SummaryWidget,
  useStreamingQna,
  useStreamingSummary
});
//# sourceMappingURL=index.cjs.map