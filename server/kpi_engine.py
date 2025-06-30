from __future__ import annotations
import sqlite3
from functools import lru_cache
from pathlib import Path
from typing import Dict, Any

import pandas as pd

DATA_CSV = Path(__file__).with_name("sample_kpi.csv")
DB_PATH = Path(__file__).with_name("kpi.db")


def _load_data(kpi: str, geo: str) -> pd.DataFrame:
    if DB_PATH.exists():
        conn = sqlite3.connect(DB_PATH)
        query = "SELECT date, value FROM kpi_data WHERE kpi=? AND geo=? ORDER BY date"
        df = pd.read_sql_query(query, conn, params=(kpi, geo))
        conn.close()
        return df
    elif DATA_CSV.exists():
        df = pd.read_csv(DATA_CSV)
        df = df[(df["kpi"] == kpi) & (df["geo"] == geo)]
        return df
    else:
        return pd.DataFrame(columns=["date", "value"])


@lru_cache(maxsize=128)
def get_kpi_data(intent: Dict[str, str]) -> Dict[str, Any]:
    kpi = intent.get("kpi", "CQI")
    geo = intent.get("geo", "Dallas")
    time = intent.get("time", "last 7 days")

    df = _load_data(kpi, geo)

    if df.empty:
        labels = []
        values = []
    else:
        daily = df.groupby("date")["value"].mean().reset_index()
        labels = daily["date"].tolist()
        values = daily["value"].round(2).tolist()

    chart = {
        "type": "line",
        "title": f"{kpi} trend in {geo}",
        "labels": labels,
        "data": values,
        "datasetLabel": kpi,
    }

    if values:
        avg = df["value"].mean()
        reply = f"{kpi} in {geo} averages {avg:.1f} over {time}."
    else:
        reply = f"No {kpi} data available for {geo}."

    actions = [
        f"Investigate sites with high {kpi}",
        "Check backhaul config",
        f"Add {kpi} threshold alert",
    ]

    return {"reply": reply, "charts": [chart], "actions": actions}
