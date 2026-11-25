# Government Scheme Advisor — Frontend

A React and Vite prototype for the Phase 1 project presentation. It demonstrates the citizen journey: describe a situation, review the information identified by the system, then explore schemes and eligibility. The current frontend is a visual prototype and does not yet call the backend.

## Project structure

```text
frontend/
├── public/                         Static files served as-is
├── src/
│   ├── components/                 Shared page sections
│   │   ├── HowItWorks.jsx
│   │   ├── PageIntro.jsx
│   │   ├── SiteFooter.jsx
│   │   └── SiteHeader.jsx
│   ├── features/
│   │   └── scheme-finder/          Scheme input and demo interaction
│   │       └── SchemeFinder.jsx
│   ├── App.jsx                     Page layout and language attribute
│   ├── i18n.js                     English and Hindi interface text
│   ├── index.css                   Global styles and responsive layout
│   └── main.jsx                    React entry point
├── index.html                      Page title and metadata
├── package.json                    Dependencies and scripts
└── vite.config.js                  Vite configuration
```

## Run locally

From this directory:

```bash
npm install
npm run dev
```

The language menu switches between English and Hindi. Submitting the description shows a demo message; attribute extraction, eligibility matching, and scheme recommendations will be connected when the backend API is ready.
