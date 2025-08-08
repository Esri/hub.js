import { migrateInvalidTimelineStages } from "../../../src/projects/_internal/migrateInvalidTimelineStages";
import { IHubProject } from "../../../src/core/types/IHubProject";
import { IHubStage } from "../../../src/core/types/IHubTimeline";

describe("migrateInvalidTimelineStages", () => {
  it("returns project unchanged if schemaVersion is >= 1.2", () => {
    const project: IHubProject = {
      schemaVersion: 1.2,
    } as IHubProject;
    const result = migrateInvalidTimelineStages(project);
    expect(result).toBe(project);
  });

  it("removes stages without a title", () => {
    const project: IHubProject = {
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
    } as IHubProject;
    const result = migrateInvalidTimelineStages(project);
    expect(result.view.timeline.stages).toEqual([
      { title: "Valid Stage" },
      { title: "Another Valid Stage" },
    ] as IHubStage[]);
    expect(result.schemaVersion).toBe(1.2);
  });
});
