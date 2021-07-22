import { IModel } from "../../src";
import { _purgeNonGuidsFromCatalog } from "../../src/sites/_purge-non-guids-from-catalog";

describe("_purgeNonGuidsFromCatalog", () => {
  it("removes non-guids and handle permutations", function () {
    const model = {
      item: {
        id: "3ef",
        properties: {
          schemaVersion: "1.2",
        },
      },
      data: {
        catalog: {
          groups: [
            "71eb70fce346482592a62d3091da457a",
            "blarg",
            "{{initiative.openDataGroupId}}",
            "09d3a9e1261d4b458b532f74963352ed",
          ],
        },
      },
    } as unknown as IModel;
    const chk = _purgeNonGuidsFromCatalog(model);
    expect(chk.data.catalog).toBeTruthy("catalog should exist");
    expect(chk.data.catalog.groups).toBeTruthy("catalog.groups should exist");
    expect(chk.data.catalog.groups.length).toBe(
      2,
      "catalog should have two entries"
    );
    expect(chk.item.properties.schemaVersion).toBe(
      1.3,
      "should set schemaVersion to 1.3"
    );
  });

  it("doesnt blow up with non-existant groups", function () {
    const model = {
      item: {
        id: "3ef",
        properties: {
          schemaVersion: "1.2",
        },
      },
      data: {
        catalog: {},
      },
    } as unknown as IModel;
    try {
      const chk = _purgeNonGuidsFromCatalog(model);
      expect(chk).toBeDefined();
    } catch (err) {
      fail("shouldnt throw");
    }
  });

  it("skips schema versions greater than 1.3", function () {
    const model = {
      item: {
        id: "3ef",
        properties: {
          schemaVersion: 2,
        },
      },
      data: {
        catalog: {
          groups: [
            "71eb70fce346482592a62d3091da457a",
            "blarg",
            "{{initiative.openDataGroupId}}",
            "09d3a9e1261d4b458b532f74963352ed",
          ],
        },
      },
    } as unknown as IModel;
    const chk = _purgeNonGuidsFromCatalog(model);
    expect(chk).toBe(model, "just returns model");
  });
});
