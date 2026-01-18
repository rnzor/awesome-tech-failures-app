# Deployment Guide

This guide covers how to deploy the **Awesome Tech Failures** web application and ensure the AI Agent layer is publicly accessible.

## 1. Static Build Strategy

This application is built with Vite/React. You must generate a static build to host it on platforms like Vercel, Netlify, or GitHub Pages.

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

This will create a `dist/` folder containing the compiled HTML, CSS, and JavaScript.

## 2. Serving the AI Agent Layer

External AI agents (like GPT Actions or custom LangChain bots) expect to access the raw data files via standard URLs. 

**Requirement:** The `/agent` folder from your repository must be served from the root of your domain.

### For Vercel / Netlify / Vite:
1. Move your `agent/` folder (containing `entries.ndjson`, `api_spec.yaml`, etc.) into the `public/` directory of this project.
   - Source: `repo_root/agent/`
   - Destination: `repo_root/public/agent/`

2. After deployment, verify access:
   - `https://your-domain.com/agent/entries.ndjson`
   - `https://your-domain.com/agent/api_spec.yaml`

### Why this matters?
This allows you to provide a `instructions.txt` to any AI agent with a single line:
> "Read the policy at https://awesome-failures.dev/agent/api_spec.yaml to understand how to query the failure index."

## 3. Deployment Configuration

### Vercel (`vercel.json`)
If you need specific headers (like CORS for the agent files):

```json
{
  "headers": [
    {
      "source": "/agent/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Content-Type", "value": "text/plain" }
      ]
    }
  ]
}
```

### Netlify (`netlify.toml`)

```toml
[[headers]]
  for = "/agent/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

## 4. Continuous Deployment
Connect your GitHub repository to Vercel/Netlify. Every push to `main` will trigger a build. Ensure the `agent` folder is tracked in git and located inside `public/` so it is included in the final build output.
