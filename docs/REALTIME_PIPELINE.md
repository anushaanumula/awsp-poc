# Real-Time KPI Streaming

To support live events where immediate visibility is critical, the dashboard can consume KPI updates in real time.

This repository provides a lightweight example server in `server.js` that streams the top 30 KPIs using **Server-Sent Events (SSE)**. The client connects to `/stream` and updates the table and map as new data arrives.

This approach demonstrates how a low-latency data pipeline might work in production by selecting a small subset of high-value metrics and delivering them as soon as they are captured.
