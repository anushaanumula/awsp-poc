# AWSP AI Dashboard Feature Roadmap

This roadmap describes how a Verizon RAN System Performance engineer can incrementally build the Airwave SP & SE prototype using the mock data found in `src/data/sites.json`. Each step maps to one or more of the strategic pillars for transforming Airwave into a smarter, action‑oriented platform.

## 1. Baseline Display
- Load the mock KPI dataset and render a sortable table and simple map.
- Allow site selection to reveal basic details in `SiteDetails`.

## 2. Simplification & AI‑Driven Prioritization
- Use conditional logic to highlight the worst offenders first.
- Replace the flat list with a prioritized table view and a dynamic task list that shows the top 10 issues at a time.

## 3. Filtering & Categorization
- Provide filter buttons for `kpiType` (already present) and allow multi‑select with a *Clear Filters* option.
- Group sites by severity to reduce information overload for new engineers.

## 4. Task Workflow
- Add a modal to create a mock task for the selected site.
- Pre‑populate the title and description using KPI values.
- Later persist tasks to local storage to simulate a simple ticket system.

## 5. AI‑Powered Automation (Open Loop)
- Extend `AiInsights.jsx` to suggest corrective actions that require user approval.
- Display a queue of recommendations for the engineer to approve or dismiss.

## 6. Map Performance & Infrastructure Upgrade
- Continue using `react-leaflet` for mock data, but outline a plan to switch to server-rendered vector tiles (Atlas) for large site counts.
- Document expected performance gains from offloading rendering to the backend.

## 7. Unified SP/SE Dashboard
- Share all components between SP and SE contexts.
- Add a toggle to switch views using the same mock dataset so both experiences remain consistent.

## 8. Real-Time Simulation
- Periodically update KPI values via `setInterval` to mimic a live data feed.
- Display the last-updated timestamp to simulate a low-latency pipeline for events.

## 9. External System Integration
- Provide stub links from each site to external tools (e.g., XLPT or RTT) instead of ingesting their data.
- Keep integrations light so the prototype stays responsive.

## 10. Secure Onboarding & Guidance
- Note in the documentation that access would be managed via AYIS/AYS.
- Keep the interface simple and add inline help so new engineers can take action on day one.

---
This sequence focuses on delivering value quickly while using mock data. As trust in the AI grows, the workflow can evolve toward closed-loop automation and a production-ready data pipeline.
