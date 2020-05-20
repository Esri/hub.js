import { _ensureCatalog } from "../src";
import { IModel } from "@esri/hub-common";

describe("_ensureCatalog", () => {
  it("ensureCatalog adds data.catalog", function() {
    const model = ({
      item: {
        id: "3ef",
        properties: {}
      },
      data: {
        values: {
          groups: ["4bc", { id: "fromObj" }, "54b", { id: "secondObj" }]
        }
      }
    } as unknown) as IModel;
    const chk = _ensureCatalog(model);
    expect(chk.data.catalog).toBeTruthy("catalog should exist");
    expect(Array.isArray(chk.data.catalog.groups)).toBeTruthy(
      "catalog groups should be an array"
    );
    expect(chk.data.catalog.groups.length).toBe(4, "should copy groups over");
    expect(chk.item.properties.schemaVersion).toBe(
      1.2,
      "should set schemaVersion to 1.2"
    );
  });

  it("doesnt blow up with non-existant catalog", function() {
    const model = ({
      item: {
        id: "3ef",
        properties: {
          schemaVersion: "1.2"
        }
      },
      data: {
        // no catalog
      }
    } as unknown) as IModel;
    try {
      const chk = _ensureCatalog(model);
      expect(chk).toBeDefined();
    } catch (err) {
      fail("shouldnt throw");
    }
  });

  it("skips templates greater than 1.2 schema version", function() {
    const model = ({
      item: {
        id: "3ef",
        properties: {
          schemaVersion: 2
        }
      },
      data: {
        values: {
          groups: ["4bc", { id: "fromObj" }, "54b", { id: "secondObj" }]
        }
      }
    } as unknown) as IModel;
    const chk = _ensureCatalog(model);
    expect(chk).toEqual(model);
  });
});
