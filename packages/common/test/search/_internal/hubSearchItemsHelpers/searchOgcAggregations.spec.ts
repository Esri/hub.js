vi.mock(
  "../../../../src/search/_internal/hubSearchItemsHelpers/ogcApiRequest",
  async () => {
    const original = await vi.importActual(
      "../../../../src/search/_internal/hubSearchItemsHelpers/ogcApiRequest"
    );
    return {
      ...(original as any),
      ogcApiRequest: vi.fn(),
    };
  }
);

vi.mock(
  "../../../../src/search/_internal/hubSearchItemsHelpers/getOgcCollectionUrl",
  async () => {
    const original = await vi.importActual(
      "../../../../src/search/_internal/hubSearchItemsHelpers/getOgcCollectionUrl"
    );
    return {
      ...(original as any),
      getOgcCollectionUrl: vi
        .fn()
        .mockReturnValue("https://example.com/collection"),
    };
  }
);

vi.mock(
  "../../../../src/search/_internal/hubSearchItemsHelpers/getOgcAggregationQueryParams",
  async () => {
    const original = await vi.importActual(
      "../../../../src/search/_internal/hubSearchItemsHelpers/getOgcAggregationQueryParams"
    );
    return {
      ...(original as any),
      getOgcAggregationQueryParams: vi
        .fn()
        .mockReturnValue({ aggregations: "terms(fields=(a))" }),
    };
  }
);

import { searchOgcAggregations } from "../../../../src/search/_internal/hubSearchItemsHelpers/searchOgcAggregations";
import * as api from "../../../../src/search/_internal/hubSearchItemsHelpers/ogcApiRequest";
import * as fmt from "../../../../src/search/_internal/hubSearchItemsHelpers/formatOgcAggregationsResponse";

describe("searchOgcAggregations", () => {
  afterEach(() => vi.restoreAllMocks());

  it("calls ogcApiRequest and formats response", async () => {
    const raw = { aggregations: { aggregations: [] } } as any;
    (api as any).ogcApiRequest.mockResolvedValue(raw);

    const spyFmt = vi.spyOn(fmt, "formatOgcAggregationsResponse");
    await searchOgcAggregations(
      { filters: [] } as any,
      { aggFields: ["a"] } as any
    );

    expect((api as any).ogcApiRequest).toHaveBeenCalledTimes(1);
    expect(spyFmt).toHaveBeenCalledWith(raw);
  });
});
