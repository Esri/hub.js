import { IModel } from "../../../src";
import { _applySiteSchema } from "../../../src/sites/_internal/_apply-site-schema";

describe("_applySiteSchema", () => {
  it("fixes groups array", function () {
    const model = {
      item: {
        id: "3ef",
        properties: {},
      },
      data: {
        values: {
          groupId: "shouldberemoved",
          title: "should also be remnoved",
          groups: ["4bc", { id: "fromObj" }, "54b", { id: "secondObj" }],
        },
      },
    } as unknown as IModel;
    const chk = _applySiteSchema(model);
    expect(chk.item.properties.schemaVersion).toBe(
      1,
      "should apply a schema version"
    );
    expect(chk.data?.values.groups.length).toBe(
      4,
      "should have 4 groups in the array"
    );
    expect(chk.data?.values.groupId).toBeFalsy("should remove groupId");
    expect(chk.data?.values.title).toBeFalsy("should remove title");
    expect(chk.data?.values.groups.includes("fromObj")).toBeTruthy(
      "should extract the id from the object"
    );
  });

  it("doesnt blow up with no groups or properties", function () {
    const model = {
      item: {
        id: "3ef",
      },
      data: {
        values: {
          groupId: "shouldberemoved",
          title: "should also be remnoved",
        },
      },
    } as unknown as IModel;
    const chk = _applySiteSchema(model);
    expect(chk.item.properties.schemaVersion).toBe(
      1,
      "should apply a schema version"
    );
  });

  it("does nothing if schema >= 1", function () {
    const model = {
      item: {
        id: "3ef",
        properties: {
          schemaVersion: 1,
        },
      },
      data: {
        values: {
          groupId: "shouldberemoved",
          title: "should also be remnoved",
          groups: ["4bc", { id: "fromObj" }, "54b", { id: "secondObj" }],
        },
      },
    } as unknown as IModel;
    const chk = _applySiteSchema(model);
    expect(chk).toEqual(model);
  });
});
