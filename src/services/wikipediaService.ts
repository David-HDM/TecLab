interface WikipediaPage {
  pageid: number;
  index: number;
  title: string;
  extract?: string;
}

interface WikipediaSearchResponse {
  query?: {
    pages?: Record<string, WikipediaPage>;
  };
  error?: {
    info: string;
  };
}

export interface WikipediaConcept {
  id: number;
  title: string;
  summary: string;
  url: string;
}

function getSearchQuery(keywords: readonly string[]): string {
  return [...new Set(
    keywords.map((keyword) => keyword.trim().replace(/\s+/g, " ")).filter(Boolean),
  )]
    .map((keyword) => `"${keyword.replace(/"/g, '\\"')}"`)
    .join(" OR ");
}

function getSummary(extract: string): string {
  const summary = extract.trim();
  const maxLength = 280;
  if (summary.length <= maxLength) return summary;

  const shortened = summary.slice(0, maxLength);
  const lastSpace = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, lastSpace > 0 ? lastSpace : maxLength).trimEnd()}…`;
}

export async function searchWikipediaConcepts(keywords: readonly string[]): Promise<WikipediaConcept[]> {
  const query = getSearchQuery(keywords);
  if (!query) return [];

  const url = new URL("https://es.wikipedia.org/w/api.php");
  url.search = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: query,
    gsrnamespace: "0",
    gsrlimit: "6",
    prop: "extracts",
    exintro: "1",
    explaintext: "1",
    exchars: "300",
    format: "json",
    origin: "*",
  }).toString();

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Wikipedia respondió con el estado ${response.status}.`);
  }

  const data = await response.json() as WikipediaSearchResponse;
  if (data.error) throw new Error(data.error.info);

  return Object.values(data.query?.pages ?? {})
    .sort((a, b) => a.index - b.index)
    .filter((page) => page.extract)
    .map((page) => ({
      id: page.pageid,
      title: page.title,
      summary: getSummary(page.extract ?? ""),
      url: `https://es.wikipedia.org/?curid=${page.pageid}`,
    }));
}
