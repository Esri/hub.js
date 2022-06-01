import { parseInclude } from "../../../src/search/_internal/parseInclude";

describe("parseInclude:", () => {
  it("single string is the enrichment, path and prop", () => {
    const chk = parseInclude("metadata");
    expect(chk.enrichment).toBe("metadata");
    expect(chk.path).toBe("metadata");
    expect(chk.prop).toBe("metadata");
  });
  it("single string with AS", () => {
    const chk = parseInclude("metadata AS meta");
    expect(chk.enrichment).toBe("metadata");
    expect(chk.path).toBe("metadata");
    expect(chk.prop).toBe("meta");
  });
  it("deep path", () => {
    const chk = parseInclude("server.layers.length AS layerCount");
    expect(chk.enrichment).toBe("server");
    expect(chk.path).toBe("server.layers.length");
    expect(chk.prop).toBe("layerCount");
  });
  it("deep path with AS", () => {
    const chk = parseInclude("server.layers.1.name");
    expect(chk.enrichment).toBe("server");
    expect(chk.path).toBe("server.layers.1.name");
    expect(chk.prop).toBe("name");
  });
});
