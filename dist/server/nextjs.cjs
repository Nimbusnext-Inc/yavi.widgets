"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/server/nextjs.ts
var nextjs_exports = {};
__export(nextjs_exports, {
  createNextjsHandlers: () => createNextjsHandlers
});
module.exports = __toCommonJS(nextjs_exports);
async function connectMongo(uri) {
  const { MongoClient } = await import("mongodb");
  const client = new MongoClient(uri);
  await client.connect();
  return client;
}
var DEFAULTS = {
  yaviRagUrl: "https://apirag.dev5.yavi.ai",
  yaviStructuredUrl: "https://apirag.dev5.yavi.ai/structured-json-rag",
  mongoUri: "mongodb://localhost:27017/new_ui",
  defaultLlmConfig: "gpt-4o-mini"
};
function createNextjsHandlers(config = {}) {
  const {
    yaviRagUrl = DEFAULTS.yaviRagUrl,
    yaviStructuredUrl = DEFAULTS.yaviStructuredUrl,
    mongoUri = DEFAULTS.mongoUri,
    defaultLlmConfig = DEFAULTS.defaultLlmConfig
  } = config;
  async function GET(request) {
    const url = new URL(request.url);
    const segments = url.pathname.replace(/^.*\/api\/yavi\//, "").split("/");
    const token = request.headers.get("Authorization")?.replace("Bearer ", "") ?? "";
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (segments[0] === "widget" && segments[1]) {
      return handleGetWidget(segments[1], mongoUri);
    }
    if (segments[0] === "namespaces" && segments[1]) {
      return handleGetNamespaces(segments[1], token, mongoUri);
    }
    if (segments[0] === "proxy" && segments[1] === "rag") {
      const pathSegments = segments.slice(2);
      const forwardPath = "/" + pathSegments.join("/");
      const qs = url.search;
      return handleProxyRequest(
        `${yaviRagUrl}${forwardPath}${qs}`,
        token,
        "GET"
      );
    }
    if (segments[0] === "proxy" && segments[1] === "structured") {
      const pathSegments = segments.slice(2);
      const forwardPath = "/" + pathSegments.join("/");
      const qs = url.search;
      return handleProxyRequest(
        `${yaviStructuredUrl}${forwardPath}${qs}`,
        token,
        "GET"
      );
    }
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  async function POST(request) {
    console.warn("Received POST request to YAVI handler:", request.url);
    const url = new URL(request.url);
    const segments = url.pathname.replace(/^.*\/api\/yavi\//, "").split("/");
    const token = request.headers.get("Authorization")?.replace("Bearer ", "") ?? "";
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (segments[0] === "session") {
      return handleCreateSession(request, token, yaviRagUrl, yaviStructuredUrl, defaultLlmConfig);
    }
    if (segments[0] === "summary-stream") {
      return handleSummaryStream(request, token, yaviRagUrl, defaultLlmConfig);
    }
    if (segments[0] === "structured-chat") {
      return handleStructuredChat(request, token, yaviStructuredUrl);
    }
    if (segments[0] === "qna-chat") {
      return handleQnaChat(request, token, yaviRagUrl);
    }
    if (segments[0] === "proxy" && segments[1] === "rag") {
      const pathSegments = segments.slice(2);
      const forwardPath = "/" + pathSegments.join("/");
      const qs = new URL(request.url).search;
      const body = await request.text();
      return handleProxyRequest(
        `${yaviRagUrl}${forwardPath}${qs}`,
        token,
        "POST",
        body
      );
    }
    if (segments[0] === "proxy" && segments[1] === "structured") {
      const pathSegments = segments.slice(2);
      const forwardPath = "/" + pathSegments.join("/");
      const qs = new URL(request.url).search;
      const body = await request.text();
      return handleProxyRequest(
        `${yaviStructuredUrl}${forwardPath}${qs}`,
        token,
        "POST",
        body
      );
    }
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return { GET, POST };
}
async function handleGetWidget(id, mongoUri) {
  const client = await connectMongo(mongoUri);
  try {
    const db = client.db();
    const collections = [db.collection("widgets"), db.collection("widgetconfigs")];
    let doc = null;
    const isObjectId = /^[a-f\d]{24}$/i.test(id);
    const { ObjectId } = await import("mongodb");
    for (const col of collections) {
      if (doc) break;
      if (isObjectId) {
        doc = await col.findOne({ _id: new ObjectId(id) });
      }
      if (!doc) {
        doc = await col.findOne({ $or: [{ widgetId: id }, { id }] });
      }
    }
    if (!doc) return Response.json({ error: "Widget not found" }, { status: 404 });
    const widget = {
      ...doc.widgetData ?? doc,
      _id: doc._id.toString(),
      structuredDataConfig: doc.structuredDataConfig ?? null
    };
    return Response.json({ success: true, widget });
  } finally {
    await client.close();
  }
}
async function handleGetNamespaces(workspaceId, token, mongoUri) {
  let userId = "";
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString("utf8")
    );
    userId = payload.sub ?? "";
  } catch {
  }
  const client = await connectMongo(mongoUri);
  try {
    const db = client.db();
    const userFiles = db.collection("userfiles");
    const fileProcessings = db.collection("fileprocessings");
    const pipeline = [
      { $match: { workspaceId, userId } },
      { $addFields: { fileIdString: { $toString: "$_id" } } },
      {
        $lookup: {
          from: "fileprocessings",
          localField: "fileIdString",
          foreignField: "fileId",
          as: "processingData"
        }
      },
      { $unwind: { path: "$processingData", preserveNullAndEmptyArrays: false } },
      {
        $match: {
          "processingData.processingstep": {
            $elemMatch: { step: "vectorizing", status: "completed" }
          },
          "processingData.api_responses.vectorizing.namespace": { $exists: true, $ne: null },
          "processingData.api_responses.vectorizing.response_body.vector_status": "completed"
        }
      },
      {
        $group: {
          _id: "$processingData.api_responses.vectorizing.namespace",
          count: { $sum: 1 },
          workspaceName: { $first: "$workspaceName" },
          sources: {
            $push: {
              embedding_id: "$processingData.api_responses.vectorizing.response_body.vector_id",
              file_id: "$processingData.yaviFileId",
              document_id: "$processingData.api_responses.extraction.response_body.document_id",
              fileName: "$fileName",
              originalName: "$original_file_name",
              fileSize: "$file_size",
              pages: "$pages"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          namespace: "$_id",
          workspaceName: 1,
          fileCount: "$count",
          source: "$sources"
        }
      }
    ];
    void fileProcessings;
    const result = await userFiles.aggregate(pipeline).toArray();
    return Response.json(result);
  } finally {
    await client.close();
  }
}
async function handleCreateSession(request, token, yaviRagUrl, yaviStructuredUrl, defaultLlmConfig) {
  const body = await request.json();
  const {
    type,
    yaviLlmConfigName,
    yavi_llm_config_name,
    datasetId,
    dataset_id,
    llm_parameters,
    user_id
  } = body;
  const resolvedDatasetId = datasetId ?? dataset_id;
  const model = yaviLlmConfigName ?? defaultLlmConfig;
  const structuredModel = yaviLlmConfigName ?? yavi_llm_config_name ?? defaultLlmConfig;
  const sessionType = type ?? (resolvedDatasetId ? "structured" : "unstructured");
  let userId = "";
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString("utf8")
    );
    userId = payload.sub ?? "";
  } catch {
  }
  if (sessionType === "structured") {
    if (!resolvedDatasetId) {
      return Response.json({ error: "datasetId required for structured session" }, { status: 400 });
    }
    const res2 = await fetch(`${yaviStructuredUrl}/api/v2/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        dataset_id: resolvedDatasetId,
        yavi_llm_config_name: structuredModel,
        yavi_embedding_config_name: process.env.AZURE_YAVI_EMBEDDING_CONFIG_NAME ?? "azure-embedding-small",
        llm_parameters: llm_parameters ?? { temperature: 0.7, max_tokens: 2e3 },
        user_id: user_id ?? userId
      })
    });
    const data2 = await res2.json();
    return Response.json(data2, { status: res2.status });
  }
  const res = await fetch(`${yaviRagUrl}/rag/api/v2/session`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      bot_mode: "standard_v2",
      yavi_llm_config_name: model,
      llm_parameters: { frequency_penalty: 0, presence_penalty: 0, temperature: 0.7, max_tokens: 2e3, top_p: 1 },
      user_id: userId
    })
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
async function handleSummaryStream(request, token, yaviRagUrl, defaultLlmConfig) {
  const body = await request.json();
  const { documentIds, customPrompt, yaviLlmConfigName, separate } = body;
  if (!documentIds?.length) {
    return Response.json({ error: "documentIds required" }, { status: 400 });
  }
  const separateFlag = separate ?? false;
  const model = yaviLlmConfigName ?? defaultLlmConfig;
  const promptToUse = buildSummaryPrompt(customPrompt, separateFlag);
  const upstream = await fetch(
    `${yaviRagUrl}/content_generation/api/v1/summary`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        custom_prompt: promptToUse,
        document_ids: documentIds,
        separate: separateFlag,
        streaming: true,
        yavi_llm_config_name: model
      })
    }
  );
  if (!upstream.ok) {
    const err = await upstream.text();
    return Response.json({ error: err }, { status: upstream.status });
  }
  if (!upstream.body) {
    return Response.json({ error: "No upstream body" }, { status: 502 });
  }
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const enc = new TextEncoder();
  const dec = new TextDecoder();
  (async () => {
    const reader = upstream.body.getReader();
    let buf = "";
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          let json = line.trim();
          if (!json) continue;
          if (json.startsWith("data: ")) json = json.slice(6).trim();
          if (!json || json === "[DONE]") {
            if (json === "[DONE]") await writer.write(enc.encode("data: [DONE]\n\n"));
            continue;
          }
          try {
            const parsed = JSON.parse(json);
            if (separateFlag) {
              const validType = ["document_start", "document_chunk", "document_complete", "session_complete"];
              if (validType.includes(parsed.type)) {
                await writer.write(enc.encode(`data: ${JSON.stringify(parsed)}

`));
              }
            } else {
              if (parsed.type === "chunk" && parsed.content) {
                await writer.write(enc.encode(`data: ${JSON.stringify({ content: parsed.content })}

`));
              }
            }
          } catch {
          }
        }
      }
      await writer.write(enc.encode("data: [DONE]\n\n"));
    } catch (e) {
      await writer.write(enc.encode(`data: ${JSON.stringify({ error: String(e) })}

`));
    } finally {
      await writer.close().catch(() => {
      });
    }
  })();
  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no"
    }
  });
}
async function handleStructuredChat(request, token, yaviStructuredUrl) {
  const {
    sessionId,
    prompt,
    question,
    customPrompt,
    custom_prompt,
    addToHistory,
    add_to_history,
    useSystemPrompt,
    use_system_prompt
  } = await request.json();
  if (!sessionId) return Response.json({ error: "sessionId required" }, { status: 400 });
  const res = await fetch(`${yaviStructuredUrl}/api/v2/session/${sessionId}/chat`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      question: question?.trim() || `You are an expert document analyst. Provide a structured markdown summary. ${prompt ?? ""}`,
      add_to_history: add_to_history ?? addToHistory ?? false,
      use_system_prompt: use_system_prompt ?? useSystemPrompt ?? true,
      custom_prompt: custom_prompt ?? customPrompt ?? buildStructuredPrompt(prompt ?? question)
    })
  });
  const data = await res.json();
  return Response.json(
    { answer: data?.explanation ?? data?.answer ?? "" },
    { status: res.status }
  );
}
async function handleQnaChat(request, token, yaviRagUrl) {
  const {
    sessionId,
    question,
    documentIds,
    namespace,
    topK,
    customPrompt
  } = await request.json();
  if (!sessionId || !question) {
    return Response.json({ error: "sessionId and question are required" }, { status: 400 });
  }
  if (!namespace) {
    return Response.json({ error: "namespace is required for qna-chat" }, { status: 400 });
  }
  const vectorStore = {
    context_variable: "context1",
    query: question,
    rag_processor: { top_k: topK ?? 25 },
    vector_db_config: {
      connection_string: "",
      dimensions: 1536,
      namespace,
      vector_db_type: "neondb"
    }
  };
  if (documentIds && documentIds.length > 0) {
    vectorStore.filter_by = {
      document_id: {
        $in: documentIds
      }
    };
  }
  const baseQuestion = customPrompt ? `${question}

${customPrompt}` : question;
  const payload = {
    add_to_history: false,
    use_base_system_prompt: true,
    prompt: `${baseQuestion} 

{{context1}}. Do not include context references.`,
    vector_stores: [vectorStore]
  };
  const upstream = await fetch(`${yaviRagUrl}/rag/api/v2/chat/${sessionId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  const text = await upstream.text();
  if (!upstream.ok) {
    return Response.json({ error: text }, { status: upstream.status });
  }
  const data = JSON.parse(text);
  const finalText = data?.final_answer_text || "No answer available.";
  const allRefs = data?.metadatas ? Object.values(data.metadatas).flat() : [];
  const answer = allRefs.length > 0 ? `${finalText}

b_box${JSON.stringify(allRefs)}` : finalText;
  return Response.json({ answer });
}
async function handleProxyRequest(targetUrl, token, method = "GET", body) {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        accept: "application/json"
      }
    };
    if (body && method === "POST") {
      options.body = body;
    }
    const res = await fetch(targetUrl, options);
    const resBody = await res.text();
    return new Response(resBody, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "application/json"
      }
    });
  } catch (error) {
    console.error("[Proxy] Error forwarding request:", error);
    return Response.json(
      { error: "Proxy request failed", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
function buildSummaryPrompt(custom, separate) {
  if (custom?.trim()) {
    return `You are an expert document analyst and strategic research assistant. Provide a well-structured markdown summary. Use h4 (####) for all section headings. ${custom}`;
  }
  return `You are an expert document analyst and strategic research assistant.
Your task is to analyze the provided document and generate a structured, insight-rich summary.

{text}

COMPREHENSIVE SUMMARY:

Provide a well-structured markdown summary with the following sections exactly as written below.

#### Main Themes
[Identify and describe 2-4 overarching themes]

#### Key Points
[List the most important points as bullet items]

#### Important Findings
[Highlight critical insights and notable information]

#### Summary
[Brief overall synthesis]

##### Final Executive Summary
(Short high-level takeaway)`;
}
function buildStructuredPrompt(custom) {
  return `You are an expert document analyst and strategic research assistant.
Generate a structured markdown summary with these exact sections:

#### Main Themes
#### Key Points
#### Important Findings
#### Summary
##### Final Executive Summary

${custom ?? ""}`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createNextjsHandlers
});
//# sourceMappingURL=nextjs.cjs.map