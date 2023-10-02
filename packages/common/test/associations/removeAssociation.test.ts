import { IWithAssociations, removeAssociation } from "../../src";

describe("removeAssociation", () => {
  it("removes the keyword if present", () => {
    const entity = {
      typeKeywords: ["other", "initiative|123"],
    } as unknown as IWithAssociations;
    removeAssociation(entity, { type: "initiative", id: "123" });
    expect(entity.typeKeywords).toEqual(["other"]);
  });

  it("works if keyword not present", () => {
    const entity = {
      typeKeywords: ["other"],
    } as unknown as IWithAssociations;
    removeAssociation(entity, { type: "initiative", id: "123" });
    expect(entity.typeKeywords).toEqual(["other"]);
  });

  it("works if keywords not present", () => {
    const entity = {} as unknown as IWithAssociations;
    removeAssociation(entity, { type: "initiative", id: "123" });
    expect(entity.typeKeywords).not.toBeDefined();
  });
});
