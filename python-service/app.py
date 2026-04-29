import os
import json
import uuid
from typing import List

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from sentence_transformers import SentenceTransformer
import faiss
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
os.makedirs(DATA_DIR, exist_ok=True)

INDEX_FILE = os.path.join(DATA_DIR, 'faiss.index')
META_FILE = os.path.join(DATA_DIR, 'metadata.json')

app = FastAPI(title='Local RAG Chat Service')

# Initialize embedding model
EMBED_MODEL_NAME = 'sentence-transformers/all-MiniLM-L6-v2'
embedder = SentenceTransformer(EMBED_MODEL_NAME)
EMBED_DIM = embedder.get_sentence_embedding_dimension()

# Initialize or load FAISS index and metadata
if os.path.exists(INDEX_FILE) and os.path.exists(META_FILE):
    index = faiss.read_index(INDEX_FILE)
    with open(META_FILE, 'r', encoding='utf-8') as f:
        metadata = json.load(f)
else:
    index = faiss.IndexFlatL2(EMBED_DIM)
    metadata = {}

# Initialize generator (text2text)
GEN_MODEL = 'google/flan-t5-small'
tokenizer = AutoTokenizer.from_pretrained(GEN_MODEL)
model = AutoModelForSeq2SeqLM.from_pretrained(GEN_MODEL)
generator = pipeline('text2text-generation', model=model, tokenizer=tokenizer)


def save_index():
    faiss.write_index(index, INDEX_FILE)
    with open(META_FILE, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)


def chunk_text(text: str, size: int = 800):
    if not text:
        return []
    chunks = []
    start = 0
    while start < len(text):
        chunks.append(text[start:start+size])
        start += size
    return chunks


class AddDocRequest(BaseModel):
    id: str = None
    title: str = None
    text: str


class ChatRequest(BaseModel):
    query: str
    k: int = 4
    role: str = 'general'


@app.post('/add_doc')
def add_doc(req: AddDocRequest):
    if not req.text:
        raise HTTPException(status_code=400, detail='text required')

    doc_id = req.id or str(uuid.uuid4())
    chunks = chunk_text(req.text)

    for i, chunk in enumerate(chunks):
        emb = embedder.encode(chunk)
        emb = emb.reshape(1, -1).astype('float32')
        index.add(emb)
        idx = int(index.ntotal) - 1
        metadata[str(idx)] = {'doc_id': doc_id, 'title': req.title or doc_id, 'text': chunk}

    save_index()
    return {'status': 'ok', 'doc_id': doc_id, 'chunks_added': len(chunks)}


@app.post('/chat')
def chat(req: ChatRequest):
    if index.ntotal == 0:
        return {'response': 'No documents indexed yet. Add docs via /add_doc.'}

    q_emb = embedder.encode(req.query).astype('float32')
    q_emb = q_emb.reshape(1, -1)
    D, I = index.search(q_emb, req.k)
    hits = []
    context_parts = []
    for score, idx in zip(D[0], I[0]):
        key = str(int(idx))
        meta = metadata.get(key)
        if meta:
            hits.append({'id': key, 'score': float(score), 'title': meta.get('title')})
            context_parts.append(meta.get('text'))

    context = '\n\n'.join(context_parts)

    system = f"You are an interviewer assistant for role: {req.role}. Use the context below to answer the question concisely and cite sources by their title. If the answer is not in context, say you don't know."
    prompt = system + '\n\nContext:\n' + context + '\n\nQuestion: ' + req.query + '\nAnswer:'

    # Generate a short answer
    gen = generator(prompt, max_length=256, do_sample=False)
    answer = gen[0]['generated_text'] if gen else ''

    return {'response': answer, 'hits': hits}


@app.get('/status')
def status():
    return {'indexed_chunks': int(index.ntotal)}
