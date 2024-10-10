import { IHubRequestOptions } from "../../../../src";
import { processFilters } from "../../../../src/search/_internal/hubEventsHelpers/processFilters";
import * as arcgisRestPortal from "@esri/arcgis-rest-portal";

const editGroup1 = {
  title: "This is an edit group",
  isOpenData: false,
  capabilities: ["updateitemcontrol"],
  owner: "jeffvader",
  id: "group1",
  protected: false,
  tags: ["wat"],
  created: 12345,
  modified: 23421,
  isInvitationOnly: false,
  isFav: false,
  isViewOnly: false,
  autoJoin: true,
  access: "public",
} as arcgisRestPortal.IGroup;

const editGroup2 = {
  title: "This is another edit group",
  isOpenData: false,
  capabilities: ["updateitemcontrol"],
  owner: "jeffvader",
  id: "group2",
  protected: false,
  tags: ["wat"],
  created: 12345,
  modified: 23421,
  isInvitationOnly: false,
  isFav: false,
  isViewOnly: false,
  autoJoin: true,
  access: "public",
} as arcgisRestPortal.IGroup;

const readGroup1 = {
  title: "This is a read group",
  isOpenData: false,
  capabilities: [],
  owner: "jhonvader",
  id: "group3",
  protected: false,
  tags: ["wat"],
  created: 12345,
  modified: 23421,
  isInvitationOnly: false,
  isFav: false,
  isViewOnly: false,
  autoJoin: true,
  access: "public",
} as arcgisRestPortal.IGroup;

const readGroup2 = {
  title: "This is another read group",
  isOpenData: false,
  capabilities: [],
  owner: "jhonvader",
  id: "group4",
  protected: false,
  tags: ["wat"],
  created: 12345,
  modified: 23421,
  isInvitationOnly: false,
  isFav: false,
  isViewOnly: false,
  autoJoin: true,
  access: "public",
} as arcgisRestPortal.IGroup;

const hubRequestOptions = {
  authentication: true,
} as unknown as IHubRequestOptions;

describe("processFilters", () => {
  describe("access", () => {
    it("should return undefined", async () => {
      const result = await processFilters(
        [{ predicates: [] }],
        hubRequestOptions
      );
      expect(result.access).toBeUndefined();
    });
    it("should consolidate values from multiple filters & predicates", async () => {
      const result = await processFilters(
        [
          {
            predicates: [
              {
                access: "public",
              },
            ],
          },
          {
            predicates: [
              {
                access: "org",
              },
              {
                access: ["private"],
              },
            ],
          },
        ],
        hubRequestOptions
      );
      expect(result.access).toEqual("public,org,private");
    });
  });
  describe("canEdit", () => {
    it("should return undefined", async () => {
      const result = await processFilters(
        [{ predicates: [] }],
        hubRequestOptions
      );
      expect(result.canEdit).toBeUndefined();
    });
    it("should use the first value and coerce to a string", async () => {
      const result = await processFilters(
        [
          {
            predicates: [
              {
                canEdit: true,
              },
              {
                canEdit: false,
              },
            ],
          },
          {
            predicates: [
              {
                canEdit: false,
              },
            ],
          },
        ],
        hubRequestOptions
      );
      expect(result.canEdit).toEqual("true");
    });
  });
  describe("entityId", () => {
    it("should return undefined", async () => {
      const result = await processFilters(
        [{ predicates: [] }],
        hubRequestOptions
      );
      expect(result.entityIds).toBeUndefined();
    });
    it("should consolidate values from multiple filters & predicates", async () => {
      const result = await processFilters(
        [
          {
            predicates: [
              {
                entityId: "abc",
              },
            ],
          },
          {
            predicates: [
              {
                entityId: "def",
              },
              {
                entityId: ["ghi"],
              },
            ],
          },
        ],
        hubRequestOptions
      );
      expect(result.entityIds).toEqual("abc,def,ghi");
    });
  });
  describe("entityType", () => {
    it("should return undefined", async () => {
      const result = await processFilters(
        [{ predicates: [] }],
        hubRequestOptions
      );
      expect(result.entityTypes).toBeUndefined();
    });
    it("should consolidate values from multiple filters & predicates", async () => {
      const result = await processFilters(
        [
          {
            predicates: [
              {
                entityType: "abc",
              },
            ],
          },
          {
            predicates: [
              {
                entityType: "def",
              },
              {
                entityType: ["ghi"],
              },
            ],
          },
        ],
        hubRequestOptions
      );
      expect(result.entityTypes).toEqual("abc,def,ghi");
    });
  });
  describe("id", () => {
    it("should return undefined", async () => {
      const result = await processFilters(
        [{ predicates: [] }],
        hubRequestOptions
      );
      expect(result.eventIds).toBeUndefined();
    });
    it("should consolidate values from multiple filters & predicates", async () => {
      const result = await processFilters(
        [
          {
            predicates: [
              {
                id: "abc",
              },
            ],
          },
          {
            predicates: [
              {
                id: "def",
              },
              {
                id: ["ghi"],
              },
            ],
          },
        ],
        hubRequestOptions
      );
      expect(result.eventIds).toEqual("abc,def,ghi");
    });
  });
  describe("term", () => {
    it("should return undefined", async () => {
      const result = await processFilters(
        [{ predicates: [] }],
        hubRequestOptions
      );
      expect(result.title).toBeUndefined();
    });
    it("should use the first value", async () => {
      const result = await processFilters(
        [
          {
            predicates: [
              {
                term: "abc",
              },
              {
                term: "def",
              },
            ],
          },
          {
            predicates: [
              {
                term: "ghi",
              },
            ],
          },
        ],
        hubRequestOptions
      );
      expect(result.title).toEqual("abc");
    });
  });
  describe("orgId", () => {
    it("should return undefined", async () => {
      const result = await processFilters(
        [{ predicates: [] }],
        hubRequestOptions
      );
      expect(result.orgId).toBeUndefined();
    });
    it("should use the first value", async () => {
      const result = await processFilters(
        [
          {
            predicates: [
              {
                orgId: "abc",
              },
              {
                orgId: "def",
              },
            ],
          },
          {
            predicates: [
              {
                orgId: "ghi",
              },
            ],
          },
        ],
        hubRequestOptions
      );
      expect(result.orgId).toEqual("abc");
    });
  });
  describe("categories", () => {
    it("should return undefined", async () => {
      const result = await processFilters(
        [{ predicates: [] }],
        hubRequestOptions
      );
      expect(result.categories).toBeUndefined();
    });
    it("should consolidate values from multiple filters & predicates", async () => {
      const result = await processFilters(
        [
          {
            predicates: [
              {
                categories: "abc",
              },
            ],
          },
          {
            predicates: [
              {
                categories: "def",
              },
              {
                categories: ["ghi"],
              },
            ],
          },
        ],
        hubRequestOptions
      );
      expect(result.categories).toEqual("abc,def,ghi");
    });
  });
  describe("tags", () => {
    it("should return undefined", async () => {
      const result = await processFilters(
        [{ predicates: [] }],
        hubRequestOptions
      );
      expect(result.tags).toBeUndefined();
    });
    it("should consolidate values from multiple filters & predicates", async () => {
      const result = await processFilters(
        [
          {
            predicates: [
              {
                tags: "abc",
              },
            ],
          },
          {
            predicates: [
              {
                tags: "def",
              },
              {
                tags: ["ghi"],
              },
            ],
          },
        ],
        hubRequestOptions
      );
      expect(result.tags).toEqual("abc,def,ghi");
    });
  });
  describe("attendanceType", () => {
    it("should return undefined", async () => {
      const result = await processFilters(
        [{ predicates: [] }],
        hubRequestOptions
      );
      expect(result.attendanceTypes).toBeUndefined();
    });
    it("should consolidate values from multiple filters & predicates", async () => {
      const result = await processFilters(
        [
          {
            predicates: [
              {
                attendanceType: "abc",
              },
            ],
          },
          {
            predicates: [
              {
                attendanceType: "def",
              },
              {
                attendanceType: ["ghi"],
              },
            ],
          },
        ],
        hubRequestOptions
      );
      expect(result.attendanceTypes).toEqual("abc,def,ghi");
    });
  });
  describe("owner", () => {
    it("should return undefined", async () => {
      const result = await processFilters(
        [{ predicates: [] }],
        hubRequestOptions
      );
      expect(result.createdByIds).toBeUndefined();
    });
    it("should consolidate values from multiple filters & predicates", async () => {
      const result = await processFilters(
        [
          {
            predicates: [
              {
                owner: "abc",
              },
            ],
          },
          {
            predicates: [
              {
                owner: "def",
              },
              {
                owner: ["ghi"],
              },
            ],
          },
        ],
        hubRequestOptions
      );
      expect(result.createdByIds).toEqual("abc,def,ghi");
    });
  });
  describe("status", () => {
    it("should default to planned and canceled", async () => {
      const result = await processFilters(
        [{ predicates: [] }],
        hubRequestOptions
      );
      expect(result.status).toEqual("planned,canceled");
    });
    it("should consolidate values from multiple filters & predicates", async () => {
      const result = await processFilters(
        [
          {
            predicates: [
              {
                status: "planned",
              },
            ],
          },
          {
            predicates: [
              {
                status: "canceled",
              },
              {
                status: ["removed"],
              },
            ],
          },
        ],
        hubRequestOptions
      );
      expect(result.status).toEqual("planned,canceled,removed");
    });
  });
  describe("group", () => {
    it("should return undefined", async () => {
      const result = await processFilters(
        [{ predicates: [] }],
        hubRequestOptions
      );
      expect(result.sharedToGroups).toBeUndefined();
    });
    it("should return returnToGroups if group has been supplied", async () => {
      const result = await processFilters(
        [
          {
            predicates: [
              {
                group: editGroup1.id,
              },
            ],
          },
          {
            predicates: [
              {
                group: [readGroup1.id, editGroup2.id],
              },
            ],
          },
        ],
        hubRequestOptions
      );
      expect(result.sharedToGroups).toEqual(
        [editGroup1.id, readGroup1.id, editGroup2.id].join(",")
      );
    });
  });
  describe("notGroup", () => {
    it("should return undefined", async () => {
      const result = await processFilters(
        [{ predicates: [] }],
        hubRequestOptions
      );
      expect(result.withoutReadGroups).toBeUndefined();
      expect(result.withoutEditGroups).toBeUndefined();
    });
    it("should return readGroups and editGroups", async () => {
      const searchGroupsSpy = spyOn(
        arcgisRestPortal,
        "searchGroups"
      ).and.returnValue(
        Promise.resolve({ results: [editGroup1, readGroup1, editGroup2] })
      );
      const result = await processFilters(
        [
          {
            predicates: [
              {
                notGroup: editGroup1.id,
              },
            ],
          },
          {
            predicates: [
              {
                notGroup: [readGroup1.id, editGroup2.id],
              },
            ],
          },
        ],
        hubRequestOptions
      );
      expect(searchGroupsSpy).toHaveBeenCalledTimes(1);
      expect(searchGroupsSpy).toHaveBeenCalledWith({
        q: `id:(${[editGroup1.id, readGroup1.id, editGroup2.id].join(" OR ")})`,
        num: 3,
        ...hubRequestOptions,
      });
      expect(result.withoutReadGroups).toEqual(readGroup1.id);
      expect(result.withoutEditGroups).toEqual(
        [editGroup1.id, editGroup2.id].join(",")
      );
    });
    it("should filter out inaccessible groups", async () => {
      const searchGroupsSpy = spyOn(
        arcgisRestPortal,
        "searchGroups"
      ).and.returnValue(Promise.resolve({ results: [] }));
      const result = await processFilters(
        [
          {
            predicates: [
              {
                notGroup: editGroup1.id,
              },
            ],
          },
          {
            predicates: [
              {
                notGroup: [readGroup1.id, editGroup2.id],
              },
            ],
          },
        ],
        hubRequestOptions
      );
      expect(searchGroupsSpy).toHaveBeenCalledTimes(1);
      expect(searchGroupsSpy).toHaveBeenCalledWith({
        q: `id:(${[editGroup1.id, readGroup1.id, editGroup2.id].join(" OR ")})`,
        num: 3,
        ...hubRequestOptions,
      });
      expect(result.withoutReadGroups).toBeUndefined();
      expect(result.withoutEditGroups).toBeUndefined();
    });
    it("should be prioritized over individual readGroupId and editGroupId", async () => {
      const searchGroupsSpy = spyOn(
        arcgisRestPortal,
        "searchGroups"
      ).and.returnValue(
        Promise.resolve({ results: [editGroup1, readGroup1, editGroup2] })
      );
      const result = await processFilters(
        [
          {
            predicates: [
              {
                notGroup: editGroup1.id,
              },
              {
                notReadGroupId: "some-other-read-group-id",
              },
            ],
          },
          {
            predicates: [
              {
                notGroup: [readGroup1.id, editGroup2.id],
                notEditGroupId: ["some-other-edit-group-id"],
              },
            ],
          },
        ],
        hubRequestOptions
      );
      expect(searchGroupsSpy).toHaveBeenCalledTimes(1);
      expect(searchGroupsSpy).toHaveBeenCalledWith({
        q: `id:(${[editGroup1.id, readGroup1.id, editGroup2.id].join(" OR ")})`,
        num: 3,
        ...hubRequestOptions,
      });
      expect(result.withoutReadGroups).toEqual(readGroup1.id);
      expect(result.withoutEditGroups).toEqual(
        [editGroup1.id, editGroup2.id].join(",")
      );
    });
  });
  describe("readGroupId", () => {
    it("should return undefined", async () => {
      const result = await processFilters(
        [{ predicates: [] }],
        hubRequestOptions
      );
      expect(result.readGroups).toBeUndefined();
    });
    it("should consolidate values from multiple filters & predicates", async () => {
      const result = await processFilters(
        [
          {
            predicates: [
              {
                readGroupId: readGroup1.id,
              },
            ],
          },
          {
            predicates: [
              {
                readGroupId: [readGroup2.id],
              },
            ],
          },
        ],
        hubRequestOptions
      );
      expect(result.readGroups).toEqual(
        [readGroup1.id, readGroup2.id].join(",")
      );
    });
  });
  describe("notReadGroupId", () => {
    it("should return undefined", async () => {
      const result = await processFilters(
        [{ predicates: [] }],
        hubRequestOptions
      );
      expect(result.withoutReadGroups).toBeUndefined();
    });
    it("should consolidate values from multiple filters & predicates", async () => {
      const result = await processFilters(
        [
          {
            predicates: [
              {
                notReadGroupId: readGroup1.id,
              },
            ],
          },
          {
            predicates: [
              {
                notReadGroupId: [readGroup2.id],
              },
            ],
          },
        ],
        hubRequestOptions
      );
      expect(result.withoutReadGroups).toEqual(
        [readGroup1.id, readGroup2.id].join(",")
      );
    });
  });
  describe("editGroupId", () => {
    it("should return undefined", async () => {
      const result = await processFilters(
        [{ predicates: [] }],
        hubRequestOptions
      );
      expect(result.editGroups).toBeUndefined();
    });
    it("should consolidate values from multiple filters & predicates", async () => {
      const result = await processFilters(
        [
          {
            predicates: [
              {
                editGroupId: editGroup1.id,
              },
            ],
          },
          {
            predicates: [
              {
                editGroupId: [editGroup2.id],
              },
            ],
          },
        ],
        hubRequestOptions
      );
      expect(result.editGroups).toEqual(
        [editGroup1.id, editGroup2.id].join(",")
      );
    });
  });
  describe("notEditGroupId", () => {
    it("should return undefined", async () => {
      const result = await processFilters(
        [{ predicates: [] }],
        hubRequestOptions
      );
      expect(result.withoutEditGroups).toBeUndefined();
    });
    it("should consolidate values from multiple filters & predicates", async () => {
      const result = await processFilters(
        [
          {
            predicates: [
              {
                notEditGroupId: editGroup1.id,
              },
            ],
          },
          {
            predicates: [
              {
                notEditGroupId: [editGroup2.id],
              },
            ],
          },
        ],
        hubRequestOptions
      );
      expect(result.withoutEditGroups).toEqual(
        [editGroup1.id, editGroup2.id].join(",")
      );
    });
  });
  describe("startDateRange", () => {
    it("should return undefined", async () => {
      const result = await processFilters(
        [{ predicates: [] }],
        hubRequestOptions
      );
      expect(result.startDateTimeBefore).toBeUndefined();
      expect(result.startDateTimeAfter).toBeUndefined();
    });
    it("should return startDateTimeBefore and startDateTimeAfter and only use first occurrence of startDateRange", async () => {
      const result = await processFilters(
        [
          {
            predicates: [
              {
                startDateRange: {
                  from: 1714276800000,
                  to: 1714363199999,
                },
              },
            ],
          },
          {
            predicates: [
              {
                startDateRange: {
                  from: 1814276800000,
                  to: 1814363199999,
                },
              },
            ],
          },
        ],
        hubRequestOptions
      );
      expect(result.startDateTimeBefore).toEqual("2024-04-29T03:59:59.999Z");
      expect(result.startDateTimeAfter).toEqual("2024-04-28T04:00:00.000Z");
    });
    it("should be prioritized over individual startDateBefore and startDateAfter", async () => {
      const result = await processFilters(
        [
          {
            predicates: [
              {
                startDateRange: {
                  from: 1714276800000,
                  to: 1714363199999,
                },
                startDateBefore: 1814363199999,
                startDateAfter: 1814276800000,
              },
            ],
          },
        ],
        hubRequestOptions
      );
      expect(result.startDateTimeBefore).toEqual("2024-04-29T03:59:59.999Z");
      expect(result.startDateTimeAfter).toEqual("2024-04-28T04:00:00.000Z");
    });
  });
  describe("startDateBefore", () => {
    it("should return undefined", async () => {
      const result = await processFilters(
        [{ predicates: [] }],
        hubRequestOptions
      );
      expect(result.startDateTimeBefore).toBeUndefined();
    });
    it("should only use first occurrence", async () => {
      const result = await processFilters(
        [
          {
            predicates: [
              {
                startDateBefore: 1714276800000,
              },
            ],
          },
          {
            predicates: [
              {
                startDateBefore: 1814276800000,
              },
            ],
          },
        ],
        hubRequestOptions
      );
      expect(result.startDateTimeBefore).toEqual("2024-04-28T04:00:00.000Z");
    });
  });
  describe("startDateAfter", () => {
    it("should return undefined", async () => {
      const result = await processFilters(
        [{ predicates: [] }],
        hubRequestOptions
      );
      expect(result.startDateTimeAfter).toBeUndefined();
    });
    it("should only use first occurrence", async () => {
      const result = await processFilters(
        [
          {
            predicates: [
              {
                startDateAfter: 1714276800000,
              },
            ],
          },
          {
            predicates: [
              {
                startDateAfter: 1814276800000,
              },
            ],
          },
        ],
        hubRequestOptions
      );
      expect(result.startDateTimeAfter).toEqual("2024-04-28T04:00:00.000Z");
    });
  });
  describe("endDateRange", () => {
    it("should return undefined", async () => {
      const result = await processFilters(
        [{ predicates: [] }],
        hubRequestOptions
      );
      expect(result.endDateTimeBefore).toBeUndefined();
      expect(result.endDateTimeAfter).toBeUndefined();
    });
    it("should return endDateTimeBefore and endDateTimeAfter and only use first occurrence of endDateRange", async () => {
      const result = await processFilters(
        [
          {
            predicates: [
              {
                endDateRange: {
                  from: 1714276800000,
                  to: 1714363199999,
                },
              },
            ],
          },
          {
            predicates: [
              {
                endDateRange: {
                  from: 1814276800000,
                  to: 1814363199999,
                },
              },
            ],
          },
        ],
        hubRequestOptions
      );
      expect(result.endDateTimeBefore).toEqual("2024-04-29T03:59:59.999Z");
      expect(result.endDateTimeAfter).toEqual("2024-04-28T04:00:00.000Z");
    });
    it("should be prioritized over individual endDateBefore and endDateAfter", async () => {
      const result = await processFilters(
        [
          {
            predicates: [
              {
                endDateRange: {
                  from: 1714276800000,
                  to: 1714363199999,
                },
                endDateBefore: 1814363199999,
                endDateAfter: 1814276800000,
              },
            ],
          },
        ],
        hubRequestOptions
      );
      expect(result.endDateTimeBefore).toEqual("2024-04-29T03:59:59.999Z");
      expect(result.endDateTimeAfter).toEqual("2024-04-28T04:00:00.000Z");
    });
  });
  describe("endDateBefore", () => {
    it("should return undefined", async () => {
      const result = await processFilters(
        [{ predicates: [] }],
        hubRequestOptions
      );
      expect(result.endDateTimeBefore).toBeUndefined();
    });
    it("should only use first occurrence", async () => {
      const result = await processFilters(
        [
          {
            predicates: [
              {
                endDateBefore: 1714276800000,
              },
            ],
          },
          {
            predicates: [
              {
                endDateBefore: 1814276800000,
              },
            ],
          },
        ],
        hubRequestOptions
      );
      expect(result.endDateTimeBefore).toEqual("2024-04-28T04:00:00.000Z");
    });
  });
  describe("endDateAfter", () => {
    it("should return undefined", async () => {
      const result = await processFilters(
        [{ predicates: [] }],
        hubRequestOptions
      );
      expect(result.endDateTimeAfter).toBeUndefined();
    });
    it("should only use first occurrence", async () => {
      const result = await processFilters(
        [
          {
            predicates: [
              {
                endDateAfter: 1714276800000,
              },
            ],
          },
          {
            predicates: [
              {
                endDateAfter: 1814276800000,
              },
            ],
          },
        ],
        hubRequestOptions
      );
      expect(result.endDateTimeAfter).toEqual("2024-04-28T04:00:00.000Z");
    });
  });
  describe("occurrence", () => {
    // let nowSpy;
    const mockedDate = new Date(1711987200000);
    beforeAll(() => {
      jasmine.clock().mockDate(mockedDate);
    });
    afterAll(() => {
      jasmine.clock().uninstall();
    });
    it("should return undefined", async () => {
      const result = await processFilters(
        [{ predicates: [] }],
        hubRequestOptions
      );
      expect(result.startDateTimeBefore).toBeUndefined();
      expect(result.startDateTimeAfter).toBeUndefined();
    });
    it("should handle upcoming", async () => {
      const result = await processFilters(
        [
          {
            predicates: [
              {
                occurrence: "upcoming",
              },
            ],
          },
        ],
        hubRequestOptions
      );
      expect(result.startDateTimeAfter).toEqual(mockedDate.toISOString());
    });
    it("should handle past", async () => {
      const result = await processFilters(
        [
          {
            predicates: [
              {
                occurrence: "past",
              },
            ],
          },
        ],
        hubRequestOptions
      );
      expect(result.endDateTimeBefore).toEqual(mockedDate.toISOString());
    });
    it("should handle inProgress", async () => {
      const result = await processFilters(
        [
          {
            predicates: [
              {
                occurrence: "inProgress",
              },
            ],
          },
        ],
        hubRequestOptions
      );
      expect(result.startDateTimeBefore).toEqual(mockedDate.toISOString());
      expect(result.endDateTimeAfter).toEqual(mockedDate.toISOString());
    });
  });
});
