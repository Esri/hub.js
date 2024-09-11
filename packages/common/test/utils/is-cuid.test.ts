import { isCuid } from "../../src/utils/is-cuid";

describe("isCuid", () => {
  it('identifies cuid', () => {
    expect(isCuid("cm0wkh9sj002k3b6urutpvkxe")).toBe(true);
  }); 
  it('returns false if not cuid', () => {
    expect(isCuid("NOTACUID")).toBe(false);
  }); 
  it('returns false if not string', () => {
    expect(isCuid(453 as any)).toBe(false);
  }); 
});
