import {
  IHubHistory,
  IHubHistoryEntry,
  addHistoryEntry,
  removeHistoryEntry,
} from "../../src/core/hubHistory";
import { HubEntityType } from "../../src/core/types/HubEntityType";
import { createId } from "../../src/util";

describe("hubHistory:", () => {
  describe("simple add and remove:", () => {
    it("adding site entry", () => {
      const history: IHubHistory = { entries: [] };
      const entry = createFakeHistoryEntry("site");
      const updated = addHistoryEntry(entry, history);
      expect(updated.entries.length).toBe(1);
      expect(updated.entries[0].id).toBe(entry.id);
    });
    it("adding entity entry", () => {
      const history: IHubHistory = { entries: [] };
      const entry = createFakeHistoryEntry("project");
      const updated = addHistoryEntry(entry, history);
      expect(updated.entries.length).toBe(1);
      expect(updated.entries[0].id).toBe(entry.id);
    });
    it("adding newer entity entry", () => {
      const history: IHubHistory = { entries: [] };
      const entry = createFakeHistoryEntry("project");
      const updated = addHistoryEntry(entry, history);
      expect(updated.entries.length).toBe(1);
      expect(updated.entries[0].id).toBe(entry.id);
      entry.visited = Date.now();
      const updated2 = addHistoryEntry(entry, updated);
      expect(updated2.entries.length).toBe(1);
      expect(updated2.entries[0].id).toBe(entry.id);
      // verify that the visited date is updated
      expect(updated2.entries[0].visited).toBe(entry.visited);
    });
    it("removing entry", () => {
      const history: IHubHistory = { entries: [] };
      for (let i = 0; i < 3; i++) {
        history.entries.push(createFakeHistoryEntry("site"));
      }
      // get the second entry and remove it
      const entry = history.entries[1];

      const removed = removeHistoryEntry(entry, history);
      expect(removed.entries.length).toBe(2);
      // ensure the id of the removed entry is not present
      expect(removed.entries.filter((e) => e.id === entry.id).length).toBe(0);
    });
  });
  describe("limits:", () => {
    const history: IHubHistory = { entries: [] };
    beforeAll(() => {
      // Load up the history with 10 sites and 50 entities so we're at the limits
      for (let i = 0; i < 10; i++) {
        history.entries.push(createFakeHistoryEntry("site"));
      }

      for (let i = 0; i < 50; i++) {
        history.entries.push(createFakeHistoryEntry("project"));
      }
    });
    it("adding site entry respects limits", () => {
      const entry = createFakeHistoryEntry("site");
      const updated = addHistoryEntry(entry, history);
      // Should still be 10 sites
      expect(updated.entries.filter((e) => e.type === "site").length).toBe(10);
      // Should still be 50 projects
      expect(updated.entries.filter((e) => e.type === "project").length).toBe(
        50
      );
    });
    it("adding entity entry respects limits", () => {
      const entry = createFakeHistoryEntry("project");
      const updated = addHistoryEntry(entry, history);
      // Should still be 10 sites
      expect(updated.entries.filter((e) => e.type === "site").length).toBe(10);
      // Should still be 50 projects
      expect(updated.entries.filter((e) => e.type === "project").length).toBe(
        50
      );
    });
  });
});

function createFakeHistoryEntry(type: HubEntityType): IHubHistoryEntry {
  const id = createId("h");
  // Create a random visited timestamp that is in the past
  const visited = Date.now() - Math.floor(Math.random() * 100000);
  return {
    id,
    type,
    title: `Fake ${type} ${id}`,
    url: `https://hub.arcgis.com/workspaces/${type}s/${id}`,
    visited,
    action: "view",
    params: {},
  };
}
