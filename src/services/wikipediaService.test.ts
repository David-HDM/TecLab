import { afterEach, describe, expect, it, vi } from "vitest";
import { searchWikipediaConcepts } from "./wikipediaService";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("searchWikipediaConcepts", () => {
  it("searches distinct keywords and limits each result to a short summary", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      query: {
        pages: {
          "1": {
            pageid: 1,
            index: 1,
            title: "Redes",
            extract: "Resumen breve. ".repeat(30),
          },
        },
      },
    })));
    vi.stubGlobal("fetch", fetchMock);

    const concepts = await searchWikipediaConcepts([" redes ", "", "sistemas", "redes"]);

    const requestedUrl = new URL(String(fetchMock.mock.calls[0][0]));
    expect(requestedUrl.searchParams.get("gsrsearch")).toBe('"redes" OR "sistemas"');
    expect(concepts).toHaveLength(1);
    expect(concepts[0].summary.length).toBeLessThanOrEqual(281);
    expect(concepts[0].summary.endsWith("…")).toBe(true);
  });

  it("does not call Wikipedia when there are no keywords", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(searchWikipediaConcepts([" ", ""])).resolves.toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
