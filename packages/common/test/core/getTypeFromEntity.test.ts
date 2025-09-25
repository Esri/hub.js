import { getHubTypeFromItemType } from "../../src/core/getHubTypeFromItemType";
import { getTypeFromEntity } from "../../src/core/getTypeFromEntity";
import { HubEntity } from "../../src/core/types/HubEntity";

describe("getTypeFromEntity:", () => {
  it("defaults to undefined", () => {
    const entity = {} as unknown as HubEntity;
    const type = getTypeFromEntity(entity);
    expect(type).toBeUndefined();
  });

  it("works for content", () => {
    const entity = { type: "PDF" } as unknown as HubEntity;
    const entityType = getTypeFromEntity(entity);
    expect(entityType).toBe("content");
  });

  it("works for hub types", () => {
    const types = [
      "Hub Site Application",
      "Site Application",
      "Hub Page",
      "Site Page",
      "Hub Project",
      "Hub Initiative",
      "Discussion",
      "Group",
      "Hub Initiative Template",
      "Form",
      "User",
    ];
    const expected = [
      "site",
      "site",
      "page",
      "page",
      "project",
      "initiative",
      "discussion",
      "group",
      "initiativeTemplate",
      "content",
      "user",
    ];
    types.forEach((type, i) => {
      const entity = { type } as unknown as HubEntity;
      const entityType = getTypeFromEntity(entity);
      expect(entityType).toBe(expected[i]);
    });
  });
});

describe("getHubTypeFromItemType:", () => {
  it("works for site", () => {
    expect(getHubTypeFromItemType("Site Application")).toBe("site");
    expect(getHubTypeFromItemType("Hub Site Application")).toBe("site");
  });
});
