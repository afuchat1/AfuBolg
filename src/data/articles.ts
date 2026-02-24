export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  featured?: boolean;
}

export const articles: Article[] = [
  {
    id: "1",
    title: "Global Markets Rally as Central Banks Signal Policy Shift",
    excerpt: "Major indices surge across Asia and Europe following coordinated statements from central bank officials indicating a pivot toward accommodative monetary policy in the second half of the year.",
    content: "Major indices surged across Asia and Europe on Monday following coordinated statements from central bank officials indicating a pivot toward accommodative monetary policy in the second half of the year.\n\nThe S&P 500 futures pointed to a strong open, with contracts up 1.2% in pre-market trading. European markets led the rally, with the STOXX 600 climbing 2.1% to its highest level in three months.\n\nAnalysts noted that the synchronized messaging from the Federal Reserve, European Central Bank, and Bank of Japan represented an unusual degree of coordination, suggesting concerns about slowing global growth have reached a critical threshold.\n\n\"This is the clearest signal we've had in over a year that policymakers are prepared to act preemptively,\" said Maria Chen, chief economist at Meridian Capital. \"The question now is whether markets have already priced in the pivot.\"\n\nBond yields fell sharply across the curve, with the 10-year Treasury dropping 15 basis points to 3.82%. Gold prices advanced 0.8% as the dollar weakened against a basket of major currencies.",
    category: "Markets",
    author: "Sarah Mitchell",
    date: "2026-02-24",
    readTime: "4 min",
    featured: true,
  },
  {
    id: "2",
    title: "AI Regulation Framework Takes Shape in Brussels",
    excerpt: "European lawmakers finalize comprehensive AI governance standards that could set the global template for technology oversight and corporate compliance requirements.",
    content: "European lawmakers have finalized a comprehensive AI governance framework that industry observers say could set the global template for technology oversight.\n\nThe legislation, which passed committee review with broad bipartisan support, establishes tiered risk categories for AI systems and mandates transparency requirements for companies deploying automated decision-making tools.\n\nTech industry groups expressed cautious optimism about the framework's approach, noting that it provides clearer guidelines than previous proposals while maintaining room for innovation.",
    category: "Technology",
    author: "James Park",
    date: "2026-02-24",
    readTime: "6 min",
  },
  {
    id: "3",
    title: "Supply Chain Disruptions Ease as Shipping Costs Normalize",
    excerpt: "Container freight rates drop to pre-pandemic levels for the first time, signaling a structural shift in global logistics networks and potential relief for consumer prices.",
    content: "Container freight rates have dropped to pre-pandemic levels for the first time since 2019, marking what logistics analysts describe as a structural normalization in global supply chains.\n\nThe Drewry World Container Index fell to $1,420 per 40-foot container, down 82% from its peak in September 2021. The decline reflects both expanded shipping capacity and moderating demand for goods.",
    category: "Economy",
    author: "Elena Torres",
    date: "2026-02-23",
    readTime: "3 min",
  },
  {
    id: "4",
    title: "Renewable Energy Investment Hits Record $1.8 Trillion",
    excerpt: "Clean energy deployment accelerates worldwide with solar and wind capacity additions outpacing fossil fuel investments for the third consecutive year.",
    content: "Global investment in renewable energy reached a record $1.8 trillion in 2025, with solar and wind power accounting for nearly 80% of new electricity generation capacity added worldwide.\n\nThe figures, compiled by BloombergNEF, show that clean energy spending has now exceeded fossil fuel investment for three consecutive years, a trend analysts say is unlikely to reverse.",
    category: "Energy",
    author: "David Kim",
    date: "2026-02-23",
    readTime: "5 min",
  },
  {
    id: "5",
    title: "Housing Market Sees First Price Decline in 18 Months",
    excerpt: "National home prices dip 0.3% month-over-month as rising inventory and affordability constraints begin to shift the balance of power toward buyers.",
    content: "National home prices recorded their first monthly decline in 18 months, falling 0.3% in January as a surge in new listings and persistent affordability challenges cooled buyer demand.\n\nThe Case-Shiller index showed price declines in 12 of the 20 metropolitan areas tracked, with the steepest drops in markets that experienced the most aggressive pandemic-era appreciation.",
    category: "Real Estate",
    author: "Rachel Adams",
    date: "2026-02-22",
    readTime: "4 min",
  },
  {
    id: "6",
    title: "Breakthrough in Quantum Computing Achieves Error Correction Milestone",
    excerpt: "Research team demonstrates fault-tolerant quantum operations at scale, bringing practical quantum computing applications significantly closer to commercial viability.",
    content: "A research team at the Quantum Computing Institute has demonstrated fault-tolerant quantum operations at a scale previously thought to be years away, marking what scientists are calling a watershed moment for the field.\n\nThe experiment achieved logical error rates below the threshold needed for reliable computation, using a novel approach to error correction that requires fewer physical qubits than existing methods.",
    category: "Science",
    author: "Michael Chen",
    date: "2026-02-22",
    readTime: "7 min",
  },
  {
    id: "7",
    title: "Federal Reserve Minutes Reveal Internal Debate on Rate Path",
    excerpt: "Newly released meeting transcripts show growing disagreement among FOMC members about the pace and timing of interest rate adjustments through year-end.",
    content: "Minutes from the Federal Reserve's January meeting revealed significant internal disagreement about the appropriate path for interest rates, with several members advocating for a more aggressive easing cycle than the committee's consensus forecast.\n\nThe documents show that at least three FOMC members pushed for an immediate rate cut, citing deteriorating labor market indicators and signs of credit stress in commercial real estate.",
    category: "Policy",
    author: "Anna Wright",
    date: "2026-02-21",
    readTime: "5 min",
  },
  {
    id: "8",
    title: "Electric Vehicle Sales Surge 40% in Emerging Markets",
    excerpt: "Affordable EV models drive adoption across Southeast Asia and Latin America, reshaping transportation infrastructure planning in developing economies.",
    content: "Electric vehicle sales in emerging markets surged 40% year-over-year in the fourth quarter, driven by the introduction of affordable models priced below $15,000 and expanding charging infrastructure.\n\nSoutheast Asia led the growth, with Thailand, Indonesia, and Vietnam collectively accounting for over 500,000 new EV registrations in 2025.",
    category: "Automotive",
    author: "Luis Fernandez",
    date: "2026-02-21",
    readTime: "4 min",
  },
];
