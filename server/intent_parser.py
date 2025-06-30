from typing import Dict

MARKETS = ["Dallas", "Oklahoma", "Chicago"]


def extract_intent(prompt: str) -> Dict[str, str]:
    """Very naive rule-based intent parser."""
    text = prompt.lower()
    # KPI detection
    if "latency" in text:
        kpi = "Latency"
    elif "cqi" in text:
        kpi = "CQI"
    elif "throughput" in text:
        kpi = "Throughput"
    else:
        kpi = "CQI"

    geo = None
    for loc in MARKETS:
        if loc.lower() in text:
            geo = loc
            break
    if not geo:
        geo = MARKETS[0]

    # time detection
    if "today" in text:
        time = "today"
    elif "yesterday" in text:
        time = "yesterday"
    elif "this week" in text:
        time = "this week"
    else:
        time = "last 7 days"

    return {"kpi": kpi, "geo": geo, "time": time}
