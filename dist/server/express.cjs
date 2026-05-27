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

// src/server/express.ts
var express_exports = {};
__export(express_exports, {
  createExpressRouter: () => createExpressRouter
});
module.exports = __toCommonJS(express_exports);
var import_module = require("module");
var DEFAULTS = {
  yaviRagUrl: "https://apirag.dev5.yavi.ai",
  yaviStructuredUrl: "https://apirag.dev5.yavi.ai/structured-json-rag",
  mongoUri: "mongodb://localhost:27017/new_ui",
  defaultLlmConfig: "gpt-4o-mini"
};
function createExpressRouter(config = {}) {
  const {
    yaviRagUrl = DEFAULTS.yaviRagUrl,
    yaviStructuredUrl = DEFAULTS.yaviStructuredUrl,
    mongoUri = DEFAULTS.mongoUri,
    defaultLlmConfig = DEFAULTS.defaultLlmConfig
  } = config;
  const nodeRequire = (0, import_module.createRequire)(`${process.cwd()}/package.json`);
  const expressModule = nodeRequire("express");
  const router = expressModule.Router();
  const getToken = (req) => (req.headers["authorization"] ?? "").replace("Bearer ", "");
  const unauthorized = (res) => res.status(401).json({ error: "Unauthorized" });
  router.get("/widget/:id", async (req, res, next) => {
    const token = getToken(req);
    if (!token) return unauthorized(res);
    try {
      const result = await getWidgetById(req.params.id, mongoUri);
      res.json(result);
    } catch (e) {
      next(e);
    }
  });
  router.get("/namespaces/:workspaceId", async (req, res, next) => {
    const token = getToken(req);
    if (!token) return unauthorized(res);
    try {
      const result = await getNamespacesByWorkspace(
        req.params.workspaceId,
        token,
        mongoUri
      );
      res.json(result);
    } catch (e) {
      next(e);
    }
  });
  router.post("/session", async (req, res, next) => {
    const token = getToken(req);
    if (!token) return unauthorized(res);
    try {
      const {
        type,
        yaviLlmConfigName,
        yavi_llm_config_name,
        datasetId,
        dataset_id,
        llm_parameters,
        user_id
      } = req.body;
      const resolvedDatasetId = datasetId ?? dataset_id;
      const model = yaviLlmConfigName ?? defaultLlmConfig;
      const structuredModel = yaviLlmConfigName ?? yavi_llm_config_name ?? defaultLlmConfig;
      const sessionType = type ?? (resolvedDatasetId ? "structured" : "unstructured");
      let userId = "";
      try {
        const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString("utf8"));
        userId = payload.sub ?? "";
      } catch {
      }
      if (sessionType === "structured") {
        if (!resolvedDatasetId) {
          return res.status(400).json({ error: "datasetId required" });
        }
        const r2 = await fetch(`${yaviStructuredUrl}/api/v2/session`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            dataset_id: resolvedDatasetId,
            yavi_llm_config_name: structuredModel,
            yavi_embedding_config_name: process.env.AZURE_YAVI_EMBEDDING_CONFIG_NAME ?? "azure-embedding-small",
            llm_parameters: llm_parameters ?? { temperature: 0.7, max_tokens: 2e3 },
            user_id: user_id ?? userId
          })
        });
        res.status(r2.status).json(await r2.json());
        return;
      }
      const r = await fetch(`${yaviRagUrl}/rag/api/v2/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          bot_mode: "standard_v2",
          yavi_llm_config_name: model,
          llm_parameters: { frequency_penalty: 0, presence_penalty: 0, temperature: 0.7, max_tokens: 2e3, top_p: 1 },
          user_id: userId
        })
      });
      res.status(r.status).json(await r.json());
    } catch (e) {
      next(e);
    }
  });
  router.post("/summary-stream", async (req, res, next) => {
    const token = getToken(req);
    if (!token) return unauthorized(res);
    const { documentIds, customPrompt, yaviLlmConfigName, separate } = req.body;
    if (!documentIds?.length) {
      return res.status(400).json({ error: "documentIds required" });
    }
    const separateFlag = separate ?? false;
    const model = yaviLlmConfigName ?? defaultLlmConfig;
    const promptToUse = buildSummaryPrompt(customPrompt, separateFlag);
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();
    try {
      const upstream = await fetch(`${yaviRagUrl}/content_generation/api/v1/summary`, {
        method: "POST",
        headers: {
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
      });
      if (!upstream.ok) {
        const err = await upstream.text();
        res.write(`data: ${JSON.stringify({ error: err })}

`);
        res.end();
        return;
      }
      const reader = upstream.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
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
            if (json === "[DONE]") res.write("data: [DONE]\n\n");
            continue;
          }
          try {
            const parsed = JSON.parse(json);
            if (separateFlag) {
              const valid = ["document_start", "document_chunk", "document_complete", "session_complete"];
              if (valid.includes(parsed.type)) res.write(`data: ${JSON.stringify(parsed)}

`);
            } else {
              if (parsed.type === "chunk" && parsed.content) {
                res.write(`data: ${JSON.stringify({ content: parsed.content })}

`);
              }
            }
          } catch {
          }
        }
      }
      res.write("data: [DONE]\n\n");
      res.end();
    } catch (e) {
      next(e);
    }
  });
  router.post("/structured-chat", async (req, res, next) => {
    const token = getToken(req);
    if (!token) return unauthorized(res);
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
    } = req.body;
    if (!sessionId) return res.status(400).json({ error: "sessionId required" });
    try {
      const r = await fetch(`${yaviStructuredUrl}/api/v2/session/${sessionId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          question: question?.trim() || `You are an expert document analyst. Provide a structured markdown summary. ${prompt ?? ""}`,
          add_to_history: add_to_history ?? addToHistory ?? false,
          use_system_prompt: use_system_prompt ?? useSystemPrompt ?? true,
          custom_prompt: custom_prompt ?? customPrompt ?? buildStructuredPrompt(prompt ?? question)
        })
      });
      const data = await r.json();
      res.json({ answer: data?.explanation ?? data?.answer ?? "" });
    } catch (e) {
      next(e);
    }
  });
  router.post("/qna-chat", async (req, res, next) => {
    const token = getToken(req);
    if (!token) return unauthorized(res);
    const {
      sessionId,
      question,
      documentIds,
      namespace,
      topK,
      customPrompt
    } = req.body;
    if (!sessionId || !question) {
      return res.status(400).json({ error: "sessionId and question are required" });
    }
    if (!namespace) {
      return res.status(400).json({ error: "namespace is required for qna-chat" });
    }
    try {
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
        return res.status(upstream.status).json({ error: text });
      }
      const data = JSON.parse(text);
      const finalText = data?.final_answer_text || "No answer available.";
      const allRefs = data?.metadatas ? Object.values(data.metadatas).flat() : [];
      const answer = allRefs.length > 0 ? `${finalText}

b_box${JSON.stringify(allRefs)}` : finalText;
      res.json({ answer });
    } catch (e) {
      next(e);
    }
  });
  router.get(/^\/proxy\/rag\/(.*)$/, async (req, res, next) => {
    const token = getToken(req);
    if (!token) return unauthorized(res);
    try {
      const path = req.params[0] || "";
      const qs = req.url.split("?")[1] ? `?${req.url.split("?")[1]}` : "";
      const targetUrl = `${yaviRagUrl}/${path}${qs}`;
      const r = await fetch(targetUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      });
      const text = await r.text();
      res.status(r.status).setHeader("Content-Type", r.headers.get("Content-Type") || "application/json");
      res.write(text);
      res.end();
    } catch (e) {
      next(e);
    }
  });
  router.get(/^\/proxy\/structured\/(.*)$/, async (req, res, next) => {
    const token = getToken(req);
    if (!token) return unauthorized(res);
    try {
      const path = req.params[0] || "";
      const qs = req.url.split("?")[1] ? `?${req.url.split("?")[1]}` : "";
      const targetUrl = `${yaviStructuredUrl}/${path}${qs}`;
      const r = await fetch(targetUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      });
      const text = await r.text();
      res.status(r.status).setHeader("Content-Type", r.headers.get("Content-Type") || "application/json");
      res.write(text);
      res.end();
    } catch (e) {
      next(e);
    }
  });
  router.post(/^\/proxy\/rag\/(.*)$/, async (req, res, next) => {
    const token = getToken(req);
    if (!token) return unauthorized(res);
    try {
      const path = req.params[0] || "";
      const qs = req.url.split("?")[1] ? `?${req.url.split("?")[1]}` : "";
      const targetUrl = `${yaviRagUrl}/${path}${qs}`;
      const r = await fetch(targetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(req.body)
      });
      const text = await r.text();
      res.status(r.status).setHeader("Content-Type", r.headers.get("Content-Type") || "application/json");
      res.write(text);
      res.end();
    } catch (e) {
      next(e);
    }
  });
  router.post(/^\/proxy\/structured\/(.*)$/, async (req, res, next) => {
    const token = getToken(req);
    if (!token) return unauthorized(res);
    try {
      const path = req.params[0] || "";
      const qs = req.url.split("?")[1] ? `?${req.url.split("?")[1]}` : "";
      const targetUrl = `${yaviStructuredUrl}/${path}${qs}`;
      const r = await fetch(targetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(req.body)
      });
      const text = await r.text();
      res.status(r.status).setHeader("Content-Type", r.headers.get("Content-Type") || "application/json");
      res.write(text);
      res.end();
    } catch (e) {
      next(e);
    }
  });
  return router;
}
async function connectMongo(uri) {
  const { MongoClient } = await import("mongodb");
  const client = new MongoClient(uri);
  await client.connect();
  return client;
}
async function getWidgetById(id, mongoUri) {
  const client = await connectMongo(mongoUri);
  try {
    const { ObjectId } = await import("mongodb");
    const db = client.db();
    const collections = [db.collection("widgets"), db.collection("widgetconfigs")];
    let doc = null;
    const isObjectId = /^[a-f\d]{24}$/i.test(id);
    for (const col of collections) {
      if (doc) break;
      if (isObjectId) {
        doc = await col.findOne({ _id: new ObjectId(id) });
      }
      if (!doc) {
        doc = await col.findOne({ $or: [{ widgetId: id }, { id }] });
      }
    }
    if (!doc) return { success: false, message: "Widget not found" };
    return {
      success: true,
      widget: {
        ...doc.widgetData ?? doc,
        _id: doc._id.toString(),
        structuredDataConfig: doc.structuredDataConfig ?? null
      }
    };
  } finally {
    await client.close();
  }
}
async function getNamespacesByWorkspace(workspaceId, token, mongoUri) {
  let userId = "";
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString("utf8"));
    userId = payload.sub ?? "";
  } catch {
  }
  const client = await connectMongo(mongoUri);
  try {
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
        $project: { _id: 0, namespace: "$_id", workspaceName: 1, fileCount: "$count", source: "$sources" }
      }
    ];
    return await client.db().collection("userfiles").aggregate(pipeline).toArray();
  } finally {
    await client.close();
  }
}
function buildSummaryPrompt(custom, separate) {
  if (custom?.trim()) {
    return `You are an expert document analyst. Provide a well-structured markdown summary using #### headings. ${custom}`;
  }
  return `You are an expert document analyst and strategic research assistant.

{text}

Provide a well-structured markdown summary:

#### Main Themes
#### Key Points
#### Important Findings
#### Summary
##### Final Executive Summary`;
}
function buildStructuredPrompt(custom) {
  return `You are an expert document analyst. Generate a structured markdown summary:

#### Main Themes
#### Key Points
#### Important Findings
#### Summary
##### Final Executive Summary

${custom ?? ""}`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createExpressRouter
});
//# sourceMappingURL=express.cjs.map