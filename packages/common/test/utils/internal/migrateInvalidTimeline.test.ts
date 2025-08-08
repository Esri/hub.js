import { IItem } from "@esri/arcgis-rest-portal";
import { IModel } from "../../../src/hub-types";
import { migrateInvalidTimeline } from "../../../src/utils/internal/migrateInvalidTimeline";

describe("migrateInvalidTimeline", () => {
  it("returns model unchanged if schemaVersion >= target", () => {
    const m: IModel = {
      item: {
        id: "1",
        type: "Hub Project",
        owner: "Alice",
        created: 123,
        properties: {
          schemaVersion: 2.1,
        },
      } as unknown as IItem,
      data: {
        view: {
          timeline: {
            stages: [{ title: "Stage 1" }],
          },
        },
      },
    };
    const result = migrateInvalidTimeline(m, 2.1);
    expect(result).toBe(m);
  });

  it("sets schemaVersion if properties is missing", () => {
    const m: IModel = {
      item: {
        id: "2",
        type: "Hub Project",
        owner: "Alice",
        created: 123,
        // properties missing
      } as unknown as IItem,
      data: {
        view: {
          timeline: {
            stages: [{ title: "Stage 1" }],
          },
        },
      },
    };
    const result = migrateInvalidTimeline(m, 1.1);
    expect(result).not.toBe(m);
    expect(result.item.properties).toBeDefined();
    expect(result.item.properties.schemaVersion).toBe(1.1);
  });

  it("removes all stages without a title", () => {
    const m: IModel = {
      item: {
        id: "3",
        type: "Hub Project",
        owner: "Alice",
        created: 123,
        properties: {
          schemaVersion: 1.0,
        },
      } as unknown as IItem,
      data: {
        view: {
          timeline: {
            stages: [
              {},
              { title: "Valid Stage" },
              { title: "" },
              { title: "Another Valid Stage" },
              { foo: "bar" },
            ],
          },
        },
      },
    };
    const result = migrateInvalidTimeline(m, 1.1);
    expect(result.data.view.timeline.stages).toEqual([
      { title: "Valid Stage" },
      { title: "Another Valid Stage" },
    ]);
    expect(result.item.properties.schemaVersion).toBe(1.1);
  });
});
