import {
  getFilterQueryParam,
  formatPredicate,
} from "../../../../src/search/_internal/hubSearchItemsHelpers/getFilterQueryParam";

describe("getFilterQueryParam", () => {
  it("returns empty string for no filters", () => {
    const res = getFilterQueryParam({ filters: [] } as any);
    expect(res).toBe("");
  });

  it("formats simple string and boolean predicates", () => {
    const q = {
      filters: [
        {
          predicates: [{ field1: "v", field2: true }],
        },
      ],
    } as any;

    const res = getFilterQueryParam(q);
    expect(res).toContain("field1=v");
    expect(res).toContain("field2=true");
  });

  it("formats multi-string predicate and adds quotes when needed", () => {
    const q = { filters: [{ predicates: [{ tags: ["a", "b c"] }] }] } as any;
    const res = getFilterQueryParam(q);
    expect(res).toContain("tags IN (a, 'b c')");
  });

  it("formats date range predicate", () => {
    const q = {
      filters: [{ predicates: [{ created: { from: 1, to: 10 } }] }],
    } as any;
    const res = getFilterQueryParam(q);
    expect(res).toContain("created BETWEEN 1 AND 10");
  });

  it("formats complex match options (any/all/not)", () => {
    const q = {
      filters: [
        {
          predicates: [
            {
              title: { any: ["A", "B"], all: "C", not: ["D"] },
            },
          ],
        },
      ],
    } as any;

    const res = getFilterQueryParam(q);
    expect(res).toContain("title IN (A, B)");
    expect(res).toContain("title=C");
    expect(res).toContain("title NOT IN (D)");
  });

  it("ignores term, bbox, fields, and flatten in predicate", () => {
    const p = {
      term: "x",
      bbox: "1,2,3,4",
      fields: ["a"],
      flatten: true,
      foo: "bar",
    } as any;
    const s = formatPredicate(p);
    expect(s).toContain("foo=bar");
    expect(s).not.toContain("term");
    expect(s).not.toContain("bbox");
    expect(s).not.toContain("fields");
    expect(s).not.toContain("flatten");
  });
});
import { getFilterQueryParam } from "../../../../src/search/_internal/hubSearchItemsHelpers/getFilterQueryParam";

describe("getFilterQueryParam", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns empty string for empty filters array", () => {
    const res = getFilterQueryParam({ filters: [] } as any);
    expect(res).toBe("");
  });

  it("formats a simple string predicate", () => {
    const res = getFilterQueryParam({
      filters: [{ predicates: [{ title: "park" }] }],
    } as any);

    // formatted: ((title=park))
    expect(res).toBe("((title=park))");
  });

  it("formats multi-value predicates and adds quotes for values with spaces", () => {
    const res = getFilterQueryParam({
      filters: [{ predicates: [{ tags: ["red", "big green"] }] }],
    } as any);

    expect(res).toBe("((tags IN (red, 'big green')))");
  });

  it("formats date range predicates", () => {
    const res = getFilterQueryParam({
      filters: [{ predicates: [{ date: { from: 10, to: 20 } }] }],
    } as any);

    expect(res).toBe("((date BETWEEN 10 AND 20))");
  });

  it("formats complex match options (any/all/not)", () => {
    const res = getFilterQueryParam({
      filters: [
        {
          predicates: [
            {
              state: {
                any: "NY",
                all: ["CA", "OR"],
                not: "TX",
              },
            },
          ],
        },
      ],
    } as any);

    // anys -> state=NY
    // alls -> state=CA AND state=OR
    // nots -> state NOT IN (TX)
    expect(res).toBe(
      "((state=NY AND state=CA AND state=OR AND state NOT IN (TX)))"
    );
  });

  it("ignores predicates that are handled elsewhere (term/bbox/fields/flatten)", () => {
    const res = getFilterQueryParam({
      filters: [
        {
          predicates: [
            { term: "x" },
            { bbox: "b" },
            { fields: ["a"] },
            { flatten: true },
          ],
        },
      ],
    } as any);

    // all predicates are removed and the final result should be empty
    expect(res).toBe("");
  });

  it("handles boolean predicate values", () => {
    const res = getFilterQueryParam({
      filters: [{ predicates: [{ isActive: true }] }],
    } as any);

    expect(res).toBe("((isActive=true))");
  });

  it("formats any array with multi-word values and adds quotes appropriately", () => {
    const res = getFilterQueryParam({
      filters: [{ predicates: [{ title: { any: ["big one", "small"] } }] }],
    } as any);

    expect(res).toBe("((title IN ('big one', small)))");
  });

  it("formats all as array with multi-word values producing AND clauses with quotes", () => {
    const res = getFilterQueryParam({
      filters: [{ predicates: [{ region: { all: ["north west", "south"] } }] }],
    } as any);

    expect(res).toBe("((region='north west' AND region=south))");
  });

  it("removes empty clauses when predicates include ignored keys", () => {
    const res = getFilterQueryParam({
      filters: [
        {
          predicates: [{ term: "x" }, { title: "only" }],
        },
      ],
    } as any);

    expect(res).toContain("title=only");
    expect(res).not.toContain("()");
  });

  it("formats not as array and quotes multi-word values", () => {
    const res = getFilterQueryParam({
      filters: [{ predicates: [{ tag: { not: ["nope", "bad one"] } }] }],
    } as any);

    expect(res).toBe("((tag NOT IN (nope, 'bad one'))) ".trim());
  });
});
