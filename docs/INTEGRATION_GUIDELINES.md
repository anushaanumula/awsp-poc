# Airwave Integration Guidelines

This project originally ingests data from several Verizon RAN tools such as XLPT, RTT, TrueCall, AGP, CallR and AccLTP. To keep the dashboard responsive, Airwave now follows a lightweight integration philosophy:

- **Import only essential fields** required to flag and contextualize potential issues.
- **Pivot to external tools** for deep troubleshooting instead of mirroring their datasets in Airwave.
- **Emphasize integration over ingestion** to maintain a clean, performant platform.

These guidelines help Airwave remain a thin UI that surfaces problems quickly while letting engineers drill into existing systems when more detail is needed.
