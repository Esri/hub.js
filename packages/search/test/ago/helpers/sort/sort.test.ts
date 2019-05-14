import { getSortField } from "../../../../src/ago/helpers/sort/sort";

describe("sort helper test", () => {
  it("gets correct AGO sortField based on input legal AGO field", () => {
    expect(getSortField("title")).toBe("title");
  });

  it("gets correct AGO sortField based on input Hub field", () => {
    expect(getSortField("name")).toBe("title");
  });

  it("returns undefined if input field is illegal", () => {
    expect(getSortField("xyz")).toBeUndefined();
  });
});
