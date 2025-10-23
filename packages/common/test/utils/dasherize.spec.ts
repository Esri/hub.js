import { dasherize } from "../../src/utils/dasherize";
import { describe, it, expect } from "vitest";

describe("dasherize", () => {
  it("works", () => {
    expect(dasherize("HelloWorld")).toBe("hello-world");
    expect(dasherize("Hello World")).toBe("hello-world");
    expect(dasherize("Helloworld")).toBe("helloworld");
    expect(dasherize("hello-world")).toBe("hello-world");
    expect(dasherize("Hello   World")).toBe("hello---world");
  });
});
