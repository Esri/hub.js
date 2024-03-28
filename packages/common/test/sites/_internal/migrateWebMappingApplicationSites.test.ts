import { IModel, migrateWebMappingApplicationSites } from "../../../src";

describe("migrateWebMappingApplicationSites", () => {
  it("artificially updates the type of old site items", () => {
    const model = {
      item: {
        type: "Web Mapping Application",
        typeKeywords: ["hubSite"],
      },
    } as IModel;
    const chk = migrateWebMappingApplicationSites(model);
    expect(chk.item.type).toBe("Hub Site Application");
  });
  it("leaves the item unchanged if it is not an old site item", () => {
    const model = {
      item: {
        type: "Hub Site Application",
      },
    } as IModel;

    const chk = migrateWebMappingApplicationSites(model);
    expect(chk.item.type).toBe("Hub Site Application");
  });
});
