# AWSP AI Dashboard

This project is a simple React and Vite based prototype dashboard that visualizes mock network KPI data.

## Prerequisites

- **Node.js 18+** (Vite 5 requires Node 18 or newer)
- npm (comes with Node)

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

To generate a production build:

```bash
npm run build
```

## Tabs

The dashboard uses internal tabs rather than separate routes:

- **Live Map & KPI** – original map view with KPI table
- **AI Insights** – heuristic analysis and recommended actions
- **Task List** – track remediation tasks
- **Conversational UI** – combined chat assistant and eNodeB search
- **Issue Summary** – alarm counts and failure groups
- **User Insights** – feature usage and login charts
- **End-to-End View** – interactive network path with market → site → eNB → sector drilldown
  - Node popovers show KPIs, health score and 7‑day trends
  - Links change color based on severity with interference/congestion chips

Run `npm run dev` and open the root path to get started. The chat icon in the
bottom-right opens the same Conversational UI overlay from any tab.

Click the chat icon in the bottom-right to open a chatbot-style panel. The overlay appears as a small window anchored to the corner so the main map stays visible underneath.

The React UI comes with a growing list of preset questions stored in
[`src/data/questions.js`](src/data/questions.js). Each entry has a set of
keywords so the assistant can match phrases like "high latency" or "packet loss"
and respond with mock insights.
The End-to-End drilldown options use the hierarchy defined in
[`src/data/enb_details.json`](src/data/enb_details.json).

## Mock Data

Sample site metrics are stored in [`src/data/sites.json`](src/data/sites.json). Each entry represents a network site with fields such as `geoId`, `enodeb`, `sector`, current KPI value, and severity. The coordinates included in the file allow the map view to show markers for each site.
The app selects the first entry in [`src/data/states.json`](src/data/states.json) as the initial region, so the map loads zoomed in on that state by default. The zoom level has been increased for a closer view of sites when the page first loads.

## Features

- **Interactive map** – displays site markers using React‑Leaflet
- **KPI table with filters** – view, sort and filter sites by impact categories
- **AI insights** – heuristic predictions and recommended actions for the selected site
- **Task workflow** – create, view and remove tasks; tasks are persisted in local storage
- **Impact tracking** – each task records the site's impact type for quick reference
- **RAN sector table** – each row includes a Create Task shortcut for the selected sector
- **Simulated real-time KPI updates** – dashboard periodically refreshes the top KPIs without a backend server


## Integration Philosophy
Airwave ingests only the fields needed to identify and contextualize issues. For deeper analysis, the dashboard links out to external tools rather than duplicating their data. See [Integration Guidelines](docs/INTEGRATION_GUIDELINES.md) for more detail.

## Contributing / Extending

1. Fork the repository and create a new branch for your changes.
2. Add new components or extend existing ones. The roadmap in [`ROADMAP.md`](ROADMAP.md) outlines planned enhancements.
3. Update `src/data/sites.json` or add additional data files to experiment with different KPIs or site parameters.
4. Submit a pull request describing your changes.

