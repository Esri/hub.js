import { applyInitiativeMigrations } from "../../../src/initiatives/_internal/applyInitiativeMigrations";
import { HUB_INITIATIVE_CURRENT_SCHEMA_VERSION } from "../../../src/initiatives/defaults";
import * as migrations from "../../../src/initiatives/_internal/migrateInitiativeSlugAndOrgUrlKey";
import * as defaultCatalogMigration from "../../../src/initiatives/_internal/migrateInitiativeAddDefaultCatalog";
import * as timelineMigration from "../../../src/initiatives/_internal/migrateInvalidTimelineStages";
import { IHubInitiative } from "../../../src/core/types/IHubInitiative";
import { IHubStage } from "../../../src/core/types/IHubTimeline";

describe("applyInitiativeMigrations function", () => {
  let slugAndOrgUrlKeySpy: jasmine.Spy;
  let addDefaultCatalogSpy: jasmine.Spy;

  beforeEach(() => {
    slugAndOrgUrlKeySpy = spyOn(
      migrations,
      "migrateInitiativeSlugAndOrgUrlKey"
    ).and.callThrough();
    addDefaultCatalogSpy = spyOn(
      defaultCatalogMigration,
      "migrateInitiativeAddDefaultCatalog"
    ).and.callThrough();
  });

  it("calls migration functions when schemaVersion is not current", () => {
    const initiative: IHubInitiative = {
      schemaVersion: 1.0,
      // other required properties
    } as IHubInitiative;

    applyInitiativeMigrations(initiative);

    expect(addDefaultCatalogSpy).toHaveBeenCalledWith(initiative);
    expect(slugAndOrgUrlKeySpy).toHaveBeenCalled();
  });

  it("does not call migration functions when schemaVersion is current", () => {
    const initiative: IHubInitiative = {
      schemaVersion: HUB_INITIATIVE_CURRENT_SCHEMA_VERSION,
      // other required properties
    } as IHubInitiative;

    applyInitiativeMigrations(initiative);

    expect(addDefaultCatalogSpy).not.toHaveBeenCalled();
    expect(slugAndOrgUrlKeySpy).not.toHaveBeenCalled();
  });

  it("calls migration functions in correct order", () => {
    const initiative: IHubInitiative = {
      schemaVersion: 1.0,
    } as IHubInitiative;

    applyInitiativeMigrations(initiative);

    expect(addDefaultCatalogSpy).toHaveBeenCalledBefore(slugAndOrgUrlKeySpy);
  });

  it("calls migrateInvalidTimelineStages and removes invalid stages", () => {
    const timelineMigrationSpy = spyOn(
      timelineMigration,
      "migrateInvalidTimelineStages"
    ).and.callThrough();

    const initiative: IHubInitiative = {
      schemaVersion: 2.1,
      view: {
        timeline: {
          schemaVersion: 1.0,
          title: "Test Timeline",
          description: "A test timeline",
          canCollapse: true,
          stages: [
            {},
            { title: "Valid Stage" },
            { title: "" },
            { title: "Another Valid Stage" },
            { foo: "bar" },
          ] as IHubStage[],
        },
      },
      // other required properties
    } as IHubInitiative;

    const result = applyInitiativeMigrations(initiative);

    expect(timelineMigrationSpy).toHaveBeenCalledWith(initiative);
    expect(result.view.timeline.stages).toEqual([
      { title: "Valid Stage" },
      { title: "Another Valid Stage" },
    ] as IHubStage[]);
  });
});
