import { migrateInvalidTimelineStages } from "../../../src/initiatives/_internal/migrateInvalidTimelineStages";
import { IHubInitiative } from "../../../src/core/types/IHubInitiative";
import { IHubStage } from "../../../src/core/types/IHubTimeline";

describe("migrateInvalidTimelineStages", () => {
  it("returns initiative unchanged if schemaVersion is >= 2.2", () => {
    const initiative: IHubInitiative = {
      schemaVersion: 2.2,
    } as IHubInitiative;
    const result = migrateInvalidTimelineStages(initiative);
    expect(result).toBe(initiative);
  });

  it("removes stages without a title", () => {
    const initiative: IHubInitiative = {
      schemaVersion: 1.0,
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
    } as IHubInitiative;
    const result = migrateInvalidTimelineStages(initiative);
    expect(result.view.timeline.stages).toEqual([
      { title: "Valid Stage" },
      { title: "Another Valid Stage" },
    ] as IHubStage[]);
    expect(result.schemaVersion).toBe(2.2);
  });
});
