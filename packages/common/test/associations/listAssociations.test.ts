import { IWithAssociations } from "../../src/core/traits";
import { listAssociations } from "../../src/associations/listAssociations";

describe("listAssociations:", () => {
  it("returns empty array if no keywords prop", () => {
    const entity = {} as unknown as IWithAssociations;
    const list = listAssociations(entity, "initiative");
    expect(list).toBeDefined();
    expect(list.length).toBe(0);
  });

  it("returns empty array if none found", () => {
    const entity = {
      typeKeywords: ["other"],
    } as unknown as IWithAssociations;
    const list = listAssociations(entity, "initiative");
    expect(list).toBeDefined();
    expect(list.length).toBe(0);
  });

  it("returns all entries", () => {
    const entity = {
      typeKeywords: ["other", "initiative|00c", "initiative|00d"],
    } as unknown as IWithAssociations;
    const list = listAssociations(entity, "initiative");
    expect(list).toBeDefined();
    expect(list.length).toBe(2);
    expect(list[0].id).toBe("00c");
    expect(list[1].id).toBe("00d");
  });
});
