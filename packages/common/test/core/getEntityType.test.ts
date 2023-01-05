import { getTypeFromEntity, HubEntity } from "../../src/core";

describe("getEntityType:", () => {
  it("defaults to null", () => {
    const entity = {} as unknown as HubEntity;
    const type = getTypeFromEntity(entity);
    expect(type).toBeUndefined();
  });

  it("works for hub types", () => {
    const types = [
      "Hub Site Application",
      "Site Application",
      "Hub Page",
      "Site Page",
      "Hub Project",
      "Hub Initiative",
    ];
    const expected = ["site", "site", "page", "page", "project", "initiative"];
    types.forEach((type, i) => {
      const entity = { type } as unknown as HubEntity;
      const entityType = getTypeFromEntity(entity);
      expect(entityType).toBe(expected[i]);
    });
  });
});
