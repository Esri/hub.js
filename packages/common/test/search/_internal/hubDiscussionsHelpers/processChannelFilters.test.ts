import {
  ChannelSort,
  SharingAccess,
  SortOrder,
} from "../../../../src/discussions/api/types";
import { processChannelFilters } from "../../../../src/search/_internal/hubDiscussionsHelpers/processChannelFilters";

describe("processChannelFilters", () => {
  it("should support term", () => {
    let results = processChannelFilters([]);
    expect(results.name).toBeUndefined();
    results = processChannelFilters([
      {
        predicates: [{ term: "term 1" }, { term: "term 2" }],
      },
      {
        predicates: [{ term: "term 3" }],
      },
    ]);
    expect(results.name).toEqual("term 1");
  });
  it("should support groups", () => {
    let results = processChannelFilters([]);
    expect(results.groups).toBeUndefined();
    results = processChannelFilters([
      {
        predicates: [{ groups: "group-id-1" }, { groups: ["group-id-2"] }],
      },
      {
        predicates: [{ groups: "group-id-3" }],
      },
    ]);
    expect(results.groups).toEqual(["group-id-1", "group-id-2", "group-id-3"]);
  });
  it("should support access", () => {
    let results = processChannelFilters([]);
    expect(results.access).toBeUndefined();
    results = processChannelFilters([
      {
        predicates: [{ access: "public" }, { access: ["org"] }],
      },
      {
        predicates: [{ access: "private" }],
      },
    ]);
    expect(results.access).toEqual([
      SharingAccess.PUBLIC,
      SharingAccess.ORG,
      SharingAccess.PRIVATE,
    ]);
  });
  it("should support ids", () => {
    let results = processChannelFilters([]);
    expect(results.ids).toBeUndefined();
    results = processChannelFilters([
      {
        predicates: [{ id: "id-1" }, { id: ["id-2"] }],
      },
      {
        predicates: [{ id: "id-3" }],
      },
    ]);
    expect(results.ids).toEqual(["id-1", "id-2", "id-3"]);
  });
  it("should support ids using not syntax", () => {
    let results = processChannelFilters([]);
    expect(results.notIds).toBeUndefined();
    results = processChannelFilters([
      {
        predicates: [{ id: { not: "id-1" } }, { id: { not: ["id-2"] } }],
      },
      {
        predicates: [{ id: { not: "id-3" } }],
      },
    ]);
    expect(results.notIds).toEqual(["id-1", "id-2", "id-3"]);
  });
});
