import { resolveReferences } from "../../src";

describe("resolveReferences:", () => {
  it("returns object without changes if no $use", () => {
    const obj = {
      a: 1,
      b: {
        c: 2,
      },
    };
    const result = resolveReferences(obj);
    expect(result).toEqual(obj);
  });
  it("resolves simple values", () => {
    const obj = {
      a: {
        $use: "b",
      },
      b: 1,
    };
    const result = resolveReferences(obj);
    expect(result).toEqual({ a: 1, b: 1 });
  });
  it("resolves values in arrays", () => {
    const obj = {
      a: [
        {
          val: { $use: "b" },
        },
      ],
      b: 1,
    };
    const result = resolveReferences(obj);
    expect(result).toEqual({ a: [{ val: 1 }], b: 1 });
  });
  it("resolves values from arrays", () => {
    const obj = {
      a: [
        {
          val: 2,
        },
      ],
      b: { $use: "a[0].val" },
    };
    const result = resolveReferences(obj);
    expect(result).toEqual({ a: [{ val: 2 }], b: 2 });
  });
  it("resolves values from arrays", () => {
    const obj = {
      a: [
        {
          id: "cat",
          val: 2,
        },
      ],
      b: { $use: "a[findBy(id,cat)].val" },
    };
    const result = resolveReferences(obj);
    expect(result).toEqual({ a: [{ id: "cat", val: 2 }], b: 2 });
  });
  it("returns complex resolved values", () => {
    const obj = {
      defs: [
        { id: "a", value: 1 },
        { id: "b", value: 2 },
      ],
      sources: [
        { id: "s1", def: { $use: "defs[findBy(id,a)]" } },
        { id: "s2", def: { $use: "defs[findBy(id,b)]" } },
      ],
      layout: [
        {
          cards: [{ chart: { source: { $use: "sources[findBy(id,s2)]" } } }],
        },
        {
          cards: [{ chart: { source: { $use: "sources[findBy(id,s1)]" } } }],
        },
      ],
    };
    const result = resolveReferences(obj);
    // admittedly this is hard to follow, but it's testing very convoluted
    // references... hopefully we rarely have to do this in real objects
    expect(result.defs).toEqual(obj.defs);
    expect(result.sources[0].def).toEqual(obj.defs[0]);
    expect(result.sources[1].def).toEqual(obj.defs[1]);
    const card = result.layout[0].cards[0];
    expect(card.chart.source).toEqual({ id: "s2", def: { id: "b", value: 2 } });
  });
});
