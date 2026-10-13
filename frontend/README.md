# Government Scheme Advisor — Frontend

A small React interface for the Phase 1 project evaluation. The current screen demonstrates the intended citizen journey: describe a situation, review the details the system picked up, and explore scheme recommendations.

## Project structure

```text
frontend/
├── public/             Static files served as-is
├── src/
│   ├── assets/         Images and other imported assets
│   ├── App.jsx         Main page and its local interactions
│   ├── i18n.js         English and Hindi interface text
│   ├── index.css       Global styles and responsive layout
│   └── main.jsx        React entry point
├── index.html          Page metadata and mount element
├── package.json        Dependencies and development scripts
└── vite.config.js      Vite configuration
```

## Run locally

From this directory:

```bash
npm install
npm run dev
```

The language menu switches between English and Hindi. Scheme results and profile details shown in this Phase 1 screen are sample UI; backend API integration is planned for a later project phase.
