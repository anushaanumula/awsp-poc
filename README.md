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

## Mock Data

Sample site metrics are stored in [`src/data/sites.json`](src/data/sites.json). Each entry represents a network site with fields such as `geoId`, `enodeb`, `sector`, current KPI value, and severity. The coordinates included in the file allow the map view to show markers for each site.

## Features

- **Interactive map** – displays site markers using React‑Leaflet
- **KPI table with filters** – view, sort and filter sites by impact categories
- **AI insights** – heuristic predictions and recommended actions for the selected site
- **Task workflow** – create, view and remove tasks; tasks are persisted in local storage
- **Simulated real-time KPI updates** – dashboard periodically refreshes the top KPIs without a backend server


## Integration Philosophy
Airwave ingests only the fields needed to identify and contextualize issues. For deeper analysis, the dashboard links out to external tools rather than duplicating their data. See [Integration Guidelines](docs/INTEGRATION_GUIDELINES.md) for more detail.

## Contributing / Extending

1. Fork the repository and create a new branch for your changes.
2. Add new components or extend existing ones. The roadmap in [`ROADMAP.md`](ROADMAP.md) outlines planned enhancements.
3. Update `src/data/sites.json` or add additional data files to experiment with different KPIs or site parameters.
4. Submit a pull request describing your changes.

