# Local RAG Chat Service (no OpenAI)

This is a minimal local Retrieval-Augmented-Generation (RAG) service that uses:

- `sentence-transformers` (embeddings)
- `faiss` (vector search)
- `transformers` (text generation, e.g., `google/flan-t5-small`)
- `FastAPI` + `uvicorn`

It does NOT call OpenAI or other hosted LLM providers — everything runs locally.

Warning: generation models can be large and may require GPU for reasonable performance. `flan-t5-small` is comparatively small but still may be slow on CPU.

Install (prefer a virtualenv):

```bash
cd python-service
pip install -r requirements.txt
```

Run:

```bash
uvicorn app:app --host 0.0.0.0 --port 8800 --reload
```

Endpoints:

- `POST /add_doc` — add a document (JSON: `{ "text": "...", "title": "..." }`). The service will chunk text, compute embeddings and store them in a FAISS index under `python-service/data/`.
- `POST /chat` — chat query (JSON: `{ "query": "...", "k": 4, "role": "frontend-developer" }`). Returns generated answer and matching hits.
- `GET /status` — shows number of indexed chunks.

Example add document:

```bash
curl -X POST http://localhost:8800/add_doc -H "Content-Type: application/json" -d '{"title":"Sample resume","text":"Senior frontend developer with React experience..."}'
```

Example chat:

```bash
curl -X POST http://localhost:8800/chat -H "Content-Type: application/json" -d '{"query":"What React libraries do they know?","k":3,"role":"frontend-developer"}'
```

Notes & next steps:

- For production, consider using a managed vector DB (Pinecone, Milvus, Weaviate) and a hosted LLM or an optimized local runtime.
- Add PII redaction before sending chunks to the model.
- Add streaming responses for improved UX.
