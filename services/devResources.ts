export const API_SPEC_MOCK = {
  openapi: "3.0.0",
  info: {
    title: "Awesome Tech Failures API",
    version: "1.0.0",
    description: "Programmatic access to the failure index for AI agents and RAG pipelines."
  },
  servers: [
    { url: "https://api.awesome-failures.dev/v1" }
  ],
  paths: [
    {
      path: "/failures",
      method: "GET",
      summary: "List failure entries",
      description: "Retrieve a paginated list of tech failures with optional filtering.",
      params: [
        { name: "category", type: "string", in: "query", required: false, desc: "Filter by category (e.g., 'AI Slop')" },
        { name: "tags", type: "array", in: "query", required: false, desc: "Filter by specific tags" },
        { name: "limit", type: "integer", in: "query", required: false, desc: "Max records to return (default: 20)" }
      ]
    },
    {
      path: "/failures/{id}",
      method: "GET",
      summary: "Get failure details",
      description: "Retrieve full post-mortem details and impact analysis for a specific ID.",
      params: [
        { name: "id", type: "string", in: "path", required: true, desc: "Unique failure ID (e.g., 'crowdstrike-bsod')" }
      ]
    },
    {
      path: "/search/similarity",
      method: "POST",
      summary: "Semantic Search",
      description: "Find failures similar to a provided query vector or text description.",
      params: [],
      body: {
        query: "string",
        top_k: "integer"
      }
    }
  ]
};

export const RAG_GUIDE_CODE = `import os
from langchain.vectorstores import Pinecone
from langchain.embeddings import OpenAIEmbeddings

# 1. Initialize Embeddings
embeddings = OpenAIEmbeddings(
    model="text-embedding-3-small",
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

# 2. Connect to the Failure Index Vector Store
docsearch = Pinecone.from_existing_index(
    index_name="tech-failures-index", 
    embedding=embeddings
)

# 3. Query for relevant context (e.g., "DNS outages")
query = "What failures were caused by DNS misconfiguration?"
docs = docsearch.similarity_search(query, k=3)

# 4. Inject into Agent Context
context = "\\n".join([d.page_content for d in docs])
print(f"Retrieved {len(docs)} failure cases for context.")`;
