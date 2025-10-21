vi.mock(
  "../../../../src/search/_internal/hubSearchItemsHelpers/../portalSearchItems",
  async () => {
    const original = await vi.importActual(
      "../../../../src/search/_internal/hubSearchItemsHelpers/../portalSearchItems"
    );
    return {
      ...(original as any),
      itemToSearchResult: vi
        .fn()
        .mockImplementation((p: any, _includes: any, _ro: any) =>
          Promise.resolve({ id: p.id })
        ),
    };
  }
);

import { ogcItemToSearchResult } from "../../../../src/search/_internal/hubSearchItemsHelpers/ogcItemToSearchResult";
import * as portalModule from "../../../../src/search/_internal/portalSearchItems";

describe("ogcItemToSearchResult", () => {
  afterEach(() => vi.restoreAllMocks());

  it("calls itemToSearchResult and copies source/license", async () => {
    const ogc = { properties: { id: "1", source: "s", license: "L" } } as any;

    const res = await ogcItemToSearchResult(ogc, ["a"], { foo: "bar" } as any);

    expect((portalModule as any).itemToSearchResult).toHaveBeenCalledTimes(1);
    expect(res.id).toBe("1");
    expect(res.source).toBe("s");
    expect(res.license).toBe("L");
  });
});
