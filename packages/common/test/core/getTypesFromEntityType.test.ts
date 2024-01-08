import { HubEntity, HubEntityType } from "../../src/core/types";
import { getTypesFromEntityType } from "../../src/core/getTypesFromEntityType";

describe("getTypesFromEntityType:", () => {
  it("returns the item type(s) for all Hub entity types", () => {
    const types = [
      "site",
      "page",
      "project",
      "initiative",
      "discussion",
      "group",
      "template",
      "initiativeTemplate",
      "content",
    ];
    const expected = [
      ["Hub Site Application", "Site Application"],
      ["Hub Page", "Site Page"],
      ["Hub Project"],
      ["Hub Initiative"],
      ["Discussion"],
      ["Group"],
      ["Solution"],
      ["Hub Initiative Template"],
      [],
    ];
    types.forEach((type, idx) => {
      const entity = { type } as unknown as HubEntity;
      const entityType = getTypesFromEntityType(entity.type as HubEntityType);
      expect(entityType).toEqual(expected[idx]);
    });
  });
});
