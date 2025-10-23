import { ChannelFilter } from "../../../../src/discussions/api/enums/channelFilter";
import { Role } from "../../../../src/discussions/api/enums/role";
import { SharingAccess } from "../../../../src/discussions/api/enums/sharingAccess";
import {
  parseIdsAndNotIds,
  processChannelFilters,
} from "../../../../src/search/_internal/hubDiscussionsHelpers/processChannelFilters";

describe("parseIdsAndNotIds", () => {
  it("should return the expected results", () => {
    const results = parseIdsAndNotIds([
      "a",
      "b",
      { not: "c" },
      { not: ["d", "e"] },
      { other: "f" },
      { other: ["g"] },
      null,
    ]);
    expect(results).toEqual({
      ids: ["a", "b"],
      notIds: ["c", "d", "e"],
    });
  });
});

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
  it("should support group", () => {
    let results = processChannelFilters([]);
    expect(results.groups).toBeUndefined();
    results = processChannelFilters([
      {
        predicates: [{ group: "group-id-1" }, { group: ["group-id-2"] }],
      },
      {
        predicates: [{ group: "group-id-3" }],
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
  it("should support role", () => {
    let results = processChannelFilters([]);
    expect(results.roles).toBeUndefined();
    results = processChannelFilters([
      {
        predicates: [{ role: "read" }, { role: ["write"] }],
      },
      {
        predicates: [{ role: "readWrite" }],
      },
    ]);
    expect(results.roles).toEqual([Role.READ, Role.WRITE, Role.READWRITE]);
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
  it("should support orgId", () => {
    let results = processChannelFilters([]);
    expect(results.orgIds).toBeUndefined();
    results = processChannelFilters([
      {
        predicates: [{ orgId: "id-1" }, { orgId: ["id-2"] }],
      },
      {
        predicates: [{ orgId: "id-3" }],
      },
    ]);
    expect(results.orgIds).toEqual(["id-1", "id-2", "id-3"]);
  });
  it("should support discussion", () => {
    let results = processChannelFilters([]);
    expect(results.discussion).toBeUndefined();
    results = processChannelFilters([
      {
        predicates: [
          { discussion: "hub://content/31b" },
          { discussion: ["hub://content/31c"] },
        ],
      },
      {
        predicates: [{ discussion: "hub://content/31d" }],
      },
    ]);
    expect(results.discussion).toEqual("hub://content/31b");
  });
  it("should support owner", () => {
    let results = processChannelFilters([]);
    expect(results.creator).toBeUndefined();
    results = processChannelFilters([
      {
        predicates: [{ owner: "juliana_pa" }, { owner: "paige_pa" }],
      },
      {
        predicates: [{ owner: "chezelle_pa" }],
      },
    ]);
    expect(results.creator).toEqual("juliana_pa");
  });
  it("should support createdDateRange", () => {
    let results = processChannelFilters([]);
    expect(results.createdBefore).toBeUndefined();
    expect(results.createdAfter).toBeUndefined();
    results = processChannelFilters([
      {
        predicates: [
          { createdDateRange: { from: 1751256000000, to: 1751299200000 } },
          { createdDateRange: { from: 1719720000000, to: 1719763200000 } },
        ],
      },
      {
        predicates: [
          { createdDateRange: { from: 1688097600000, to: 1688140800000 } },
        ],
      },
    ]);
    expect(results.createdBefore.toISOString()).toEqual(
      "2025-06-30T16:00:00.000Z"
    );
    expect(results.createdAfter.toISOString()).toEqual(
      "2025-06-30T04:00:00.000Z"
    );
  });
  it("should support updatedDateRange", () => {
    let results = processChannelFilters([]);
    expect(results.createdBefore).toBeUndefined();
    expect(results.createdAfter).toBeUndefined();
    results = processChannelFilters([
      {
        predicates: [
          { updatedDateRange: { from: 1751256000000, to: 1751299200000 } },
          { updatedDateRange: { from: 1719720000000, to: 1719763200000 } },
        ],
      },
      {
        predicates: [
          { updatedDateRange: { from: 1688097600000, to: 1688140800000 } },
        ],
      },
    ]);
    expect(results.updatedBefore.toISOString()).toEqual(
      "2025-06-30T16:00:00.000Z"
    );
    expect(results.updatedAfter.toISOString()).toEqual(
      "2025-06-30T04:00:00.000Z"
    );
  });
  it("should support hasUserPosts", () => {
    let results = processChannelFilters([]);
    expect(results.filterBy).toBeUndefined();
    results = processChannelFilters([
      {
        predicates: [{ hasUserPosts: false }, { hasUserPosts: true }],
      },
      {
        predicates: [{ hasUserPosts: true }],
      },
    ]);
    expect(results.filterBy).toBeUndefined();
    results = processChannelFilters([
      {
        predicates: [{ hasUserPosts: true }, { hasUserPosts: false }],
      },
      {
        predicates: [{ hasUserPosts: false }],
      },
    ]);
    expect(results.filterBy).toEqual(ChannelFilter.HAS_USER_POSTS);
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
