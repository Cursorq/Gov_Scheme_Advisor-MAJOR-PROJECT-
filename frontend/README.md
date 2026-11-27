# Government Scheme Advisor — Frontend

React and Vite web interface for the Phase I prototype. The flow follows the project report: conversational input, optional PDF or text upload, follow-up questions, editable profile confirmation, and explainable scheme results with source details.

## Structure

```text
frontend/
├── public/                         Static assets
├── src/
│   ├── components/                 Shared site header and footer
│   ├── data/demoData.js            Clearly labeled synthetic preview data
│   ├── features/
│   │   ├── advisor/                Conversation and profile review
│   │   └── schemes/                Results and scheme detail page
│   ├── services/assistantApi.js    FastAPI request functions
│   ├── App.jsx                     Routes and language metadata
│   ├── i18n.js                     English and Hindi interface text
│   ├── index.css                   Global and responsive styles
│   └── main.jsx                    React entry point
├── .env.example                    Optional backend URL
└── package.json                    Dependencies and scripts
```

## Run locally

```bash
npm install
npm run dev
```

With the API running, copy `.env.example` to `.env.local` and set `VITE_API_BASE_URL` to the FastAPI base URL. Restart Vite after changing this value.

## API contract for backend integration

The frontend uses these endpoints, configured in `src/services/assistantApi.js`:

- `POST /assistant/query` — `multipart/form-data`: `message`, `language`, optional `session_id`, optional `file` (PDF/TXT). Expected JSON includes `session_id`, `stage`, and either `message`/`question`, `quick_replies`, `profile`, or `schemes`/`answer`.
- `POST /assistant/confirm-profile` — JSON: `session_id`, edited `profile`, and `language`. Returns `schemes` and an optional Markdown `answer`.
- `GET /schemes/{scheme_id}` — returns scheme details for the detail page.
- `POST /assistant/feedback` — JSON: `session_id`, `rating` (`helpful` or `not_helpful`), and `language`.

Supported query stages are `follow_up`, `profile_confirmation`, and `recommendations`. A profile object uses `age`, `gender`, `state`, `category`, `occupation`, `income`, `education`, `purpose`, plus any scheme-specific fields. Scheme results should include `id`, `name`, `category`, `status`, `summary`, `criteria` (`label`, `status`, `description`), `benefits`, `documents`, and official source fields (`official_url`, `official_source`). Status values are `highly_relevant`, `potentially_relevant`, `requires_more_information`, and `not_relevant`; criterion status values are `matched`, `not_matched`, and `unknown`.

Example `profile_confirmation` response:

```json
{
  "session_id": "temporary-session-id",
  "stage": "profile_confirmation",
  "message": "Please review the details I found.",
  "profile": {
    "age": 22,
    "gender": "female",
    "state": "Uttarakhand",
    "category": "general",
    "occupation": "student",
    "income": 200000,
    "education": "undergraduate",
    "purpose": "education"
  }
}
```

The repository currently has a command-line RAG demo in the project root, not an HTTP API. The browser cannot safely or directly call that Python script, Ollama, or Pinecone. Once the FastAPI service exposes the endpoints above, set the API URL and the frontend will send conversations and uploads to it.

The “Preview sample flow” is local UI demonstration data based on `data/knowledge.txt`. EFGP and Exemplia are fictional test data, not real government schemes. The report says the final service does not require accounts; the frontend therefore has no sign-in or sign-up page. The preview does not save user data.
