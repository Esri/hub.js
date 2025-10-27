import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import { applyInitiativeMigrations } from "../../../src/initiatives/_internal/applyInitiativeMigrations";
import { HUB_INITIATIVE_CURRENT_SCHEMA_VERSION } from "../../../src/initiatives/defaults";
import * as migrations from "../../../src/initiatives/_internal/migrateInitiativeSlugAndOrgUrlKey";
import * as defaultCatalogMigration from "../../../src/initiatives/_internal/migrateInitiativeAddDefaultCatalog";
import * as timelineMigration from "../../../src/initiatives/_internal/migrateInvalidTimelineStages";
import { IHubInitiative } from "../../../src/core/types/IHubInitiative";
import { IHubStage } from "../../../src/core/types/IHubTimeline";

describe("applyInitiativeMigrations function", () => {
  let slugAndOrgUrlKeySpy: any;
  let addDefaultCatalogSpy: any;

  beforeEach(() => {
    slugAndOrgUrlKeySpy = vi.spyOn(
      migrations,
      "migrateInitiativeSlugAndOrgUrlKey"
    );
    addDefaultCatalogSpy = vi.spyOn(
      defaultCatalogMigration,
      "migrateInitiativeAddDefaultCatalog"
    );
  });

  afterEach(() => vi.restoreAllMocks());

  it("calls migration functions when schemaVersion is not current", () => {
    const initiative: IHubInitiative = {
      schemaVersion: 1.0,
    } as any;

    applyInitiativeMigrations(initiative);

    expect(addDefaultCatalogSpy).toHaveBeenCalledWith(initiative);
    expect(slugAndOrgUrlKeySpy).toHaveBeenCalled();
  });

  it("does not call migration functions when schemaVersion is current", () => {
    const initiative: IHubInitiative = {
      schemaVersion: HUB_INITIATIVE_CURRENT_SCHEMA_VERSION,
    } as any;

    applyInitiativeMigrations(initiative);

    expect(addDefaultCatalogSpy).not.toHaveBeenCalled();
    expect(slugAndOrgUrlKeySpy).not.toHaveBeenCalled();
  });

  it("calls migration functions in correct order", () => {
    const initiative: IHubInitiative = {
      schemaVersion: 1.0,
    } as any;

    applyInitiativeMigrations(initiative);

    const firstCallOrder = addDefaultCatalogSpy.mock.invocationCallOrder[0];
    const secondCallOrder = slugAndOrgUrlKeySpy.mock.invocationCallOrder[0];
    expect(firstCallOrder).toBeLessThan(secondCallOrder);
  });

  it("calls migrateInvalidTimelineStages and removes invalid stages", () => {
    const timelineMigrationSpy = vi.spyOn(
      timelineMigration,
      "migrateInvalidTimelineStages"
    );

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
    } as any;

    const result = applyInitiativeMigrations(initiative);

    expect(timelineMigrationSpy).toHaveBeenCalledWith(initiative);
    expect(result.view.timeline.stages).toEqual([
      { title: "Valid Stage" },
      { title: "Another Valid Stage" },
    ] as IHubStage[]);
  });
});
