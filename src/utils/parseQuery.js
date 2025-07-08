import nlp from 'compromise';

const MARKETS = ['texas', 'oklahoma', 'florida', 'illinois'];
const KPI_KEYWORDS = ['cqi', 'throughput', 'latency', 'drop', 'rrc'];

export default function parseQuery(text) {
  const doc = nlp(text.toLowerCase());
  let enbId = null;
  const enbMatch = text.match(/(?:enb|site)\s*(\d+)/i);
  if (enbMatch) enbId = enbMatch[1];

  let market = MARKETS.find((m) => doc.has(m));
  let kpi = KPI_KEYWORDS.find((k) => doc.has(k));
  return { enbId, market, kpi };
}
