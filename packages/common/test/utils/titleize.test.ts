import { titleize } from "../../src";

describe("titleize", function () {
  it("capitalizes every word in a sentence", function () {
    expect(titleize("hello")).toBe("Hello");
    expect(titleize("hello world")).toBe("Hello World");
    expect(titleize("hello    world")).toBe("Hello World");
    expect(titleize("helloworld")).toBe("Helloworld");
    expect(titleize("hello-world")).toBe("Hello-world");
  });
});
