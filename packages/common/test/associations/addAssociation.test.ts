import { IWithAssociations, addAssociation } from "../../src";

describe("addAssociation:", () => {
  it("adds the typekeyword", () => {
    const entity = {
      typeKeywords: [],
    } as unknown as IWithAssociations;
    addAssociation({ type: "initiative", id: "123" }, entity);
    expect(entity.typeKeywords).toEqual(["initiative|123"]);
  });

  it("works if keyword already present", () => {
    const entity = {
      typeKeywords: ["initiative|123"],
    } as unknown as IWithAssociations;
    addAssociation({ type: "initiative", id: "123" }, entity);
    expect(entity.typeKeywords).toEqual(["initiative|123"]);
  });

  it("adds the typekeywords if not present", () => {
    const entity = {} as unknown as IWithAssociations;
    addAssociation({ type: "initiative", id: "123" }, entity);
    expect(entity.typeKeywords).toEqual(["initiative|123"]);
  });
});
