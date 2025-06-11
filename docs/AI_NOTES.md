# Next Steps for Real ML Models

The current dashboard uses simple rule-based heuristics. Replacing these with machine learning models would involve:

- **Data sources** – collect historical KPI metrics, alarm logs and user experience indicators. Integrate with existing data lakes or network management systems.
- **Training** – build training pipelines using Python (e.g. scikit-learn or PyTorch). Start with offline batch training on labeled data to predict site issues.
- **Serving and integration** – expose model predictions through a small API or serverless function. `AiInsights.jsx` would fetch these predictions instead of evaluating heuristics.

This document is intentionally brief but serves as a placeholder for a more detailed ML design.
