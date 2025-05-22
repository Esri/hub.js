import {
  EventAccess,
  EventAssociationEntityType,
  EventAttendanceType,
  EventStatus,
} from "../../../../src/events/api";
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

describe("processFilters", () => {
  describe("access", () => {
    it("should return undefined", () => {
      const result = processFilters([{ predicates: [] }]);
      expect(result.access).toBeUndefined();
    });
    it("should consolidate and unique values from multiple filters & predicates", () => {
      const result = processFilters([
        {
          predicates: [
            {
              access: "public",
            },
            {
              access: "org",
            },
          ],
        },
        {
          predicates: [
            {
              access: "org",
            },
            {
              access: "private",
            },
          ],
        },
      ]);
      expect(result.access).toEqual([
        EventAccess.PUBLIC,
        EventAccess.ORG,
        EventAccess.PRIVATE,
      ]);
    });
  });
  describe("canEdit", () => {
    it("should return undefined", () => {
      const result = processFilters([{ predicates: [] }]);
      expect(result.canEdit).toBeUndefined();
    });
    it("should use the first value", () => {
      const result = processFilters([
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
      ]);
      expect(result.canEdit).toEqual(true);
    });
  });
  describe("entityId", () => {
    it("should return undefined", () => {
      const result = processFilters([{ predicates: [] }]);
      expect(result.entityIds).toBeUndefined();
    });
    it("should consolidate and unique values from multiple filters & predicates", () => {
      const result = processFilters([
        {
          predicates: [
            {
              entityId: "abc",
            },
            {
              entityId: "def",
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
      ]);
      expect(result.entityIds).toEqual(["abc", "def", "ghi"]);
    });
  });
  describe("entityType", () => {
    it("should return undefined", () => {
      const result = processFilters([{ predicates: [] }]);
      expect(result.entityTypes).toBeUndefined();
    });
    it("should consolidate and unique values from multiple filters & predicates", () => {
      const result = processFilters([
        {
          predicates: [
            {
              entityType: "Hub Site Application",
            },
            {
              entityType: "Hub Initiative",
            },
          ],
        },
        {
          predicates: [
            {
              entityType: "Hub Initiative",
            },
            {
              entityType: ["Hub Project"],
            },
          ],
        },
      ]);
      expect(result.entityTypes).toEqual([
        EventAssociationEntityType.Hub_Site_Application,
        EventAssociationEntityType.Hub_Initiative,
        EventAssociationEntityType.Hub_Project,
      ]);
    });
  });
  describe("id", () => {
    it("should return undefined", () => {
      const result = processFilters([{ predicates: [] }]);
      expect(result.eventIds).toBeUndefined();
    });
    it("should consolidate and unique values from multiple filters & predicates", () => {
      const result = processFilters([
        {
          predicates: [
            {
              id: "abc",
            },
            {
              id: "def",
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
      ]);
      expect(result.eventIds).toEqual(["abc", "def", "ghi"]);
    });
  });
  describe("term", () => {
    it("should return undefined", () => {
      const result = processFilters([{ predicates: [] }]);
      expect(result.title).toBeUndefined();
    });
    it("should use the first value", () => {
      const result = processFilters([
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
      ]);
      expect(result.title).toEqual("abc");
    });
  });
  describe("orgId", () => {
    it("should return undefined", () => {
      const result = processFilters([{ predicates: [] }]);
      expect(result.orgId).toBeUndefined();
    });
    it("should use the first value", () => {
      const result = processFilters([
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
      ]);
      expect(result.orgId).toEqual("abc");
    });
  });
  describe("categories", () => {
    it("should return undefined", () => {
      const result = processFilters([{ predicates: [] }]);
      expect(result.categories).toBeUndefined();
    });
    it("should consolidate and unique values from multiple filters & predicates", () => {
      const result = processFilters([
        {
          predicates: [
            {
              categories: "abc",
            },
            {
              categories: "def",
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
      ]);
      expect(result.categories).toEqual(["abc", "def", "ghi"]);
    });
  });
  describe("tags", () => {
    it("should return undefined", () => {
      const result = processFilters([{ predicates: [] }]);
      expect(result.tags).toBeUndefined();
    });
    it("should consolidate and unique values from multiple filters & predicates", () => {
      const result = processFilters([
        {
          predicates: [
            {
              tags: "abc",
            },
            {
              tags: "def",
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
      ]);
      expect(result.tags).toEqual(["abc", "def", "ghi"]);
    });
  });
  describe("attendanceType", () => {
    it("should return undefined", () => {
      const result = processFilters([{ predicates: [] }]);
      expect(result.attendanceTypes).toBeUndefined();
    });
    it("should consolidate and unique values from multiple filters & predicates", () => {
      const result = processFilters([
        {
          predicates: [
            {
              attendanceType: "virtual",
            },
            {
              attendanceType: "in_person",
            },
          ],
        },
        {
          predicates: [
            {
              attendanceType: "virtual",
            },
            {
              attendanceType: ["in_person"],
            },
          ],
        },
      ]);
      expect(result.attendanceTypes).toEqual([
        EventAttendanceType.VIRTUAL,
        EventAttendanceType.IN_PERSON,
      ]);
    });
  });
  describe("owner", () => {
    it("should return undefined", () => {
      const result = processFilters([{ predicates: [] }]);
      expect(result.createdByIds).toBeUndefined();
    });
    it("should consolidate and unique values from multiple filters & predicates", () => {
      const result = processFilters([
        {
          predicates: [
            {
              owner: "abc",
            },
            {
              owner: "def",
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
      ]);
      expect(result.createdByIds).toEqual(["abc", "def", "ghi"]);
    });
  });
  describe("status", () => {
    it("should default to planned and canceled", () => {
      const result = processFilters([{ predicates: [] }]);
      expect(result.status).toEqual([
        EventStatus.PLANNED,
        EventStatus.CANCELED,
      ]);
    });
    it("should consolidate and unique values from multiple filters & predicates", () => {
      const result = processFilters([
        {
          predicates: [
            {
              status: "planned",
            },
            {
              status: "canceled",
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
      ]);
      expect(result.status).toEqual([
        EventStatus.PLANNED,
        EventStatus.CANCELED,
        EventStatus.REMOVED,
      ]);
    });
  });
  describe("group", () => {
    it("should return undefined", () => {
      const result = processFilters([{ predicates: [] }]);
      expect(result.sharedToGroups).toBeUndefined();
    });
    it("should return a unique sharedToGroups if group has been supplied", () => {
      const result = processFilters([
        {
          predicates: [
            {
              group: editGroup1.id,
            },
            {
              group: readGroup1.id,
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
      ]);
      expect(result.sharedToGroups).toEqual([
        editGroup1.id,
        readGroup1.id,
        editGroup2.id,
      ]);
    });
    it("should return a unique withoutEditGroups & withoutReadGroups if group has been supplied with inverses", () => {
      const result = processFilters([
        {
          predicates: [
            {
              group: { not: editGroup1.id },
            },
            {
              group: { not: readGroup1.id },
            },
          ],
        },
        {
          predicates: [
            {
              group: { not: [readGroup1.id, editGroup2.id] },
            },
          ],
        },
      ]);
      expect(result.withoutEditGroups).toEqual([
        editGroup1.id,
        readGroup1.id,
        editGroup2.id,
      ]);
      expect(result.withoutReadGroups).toEqual([
        editGroup1.id,
        readGroup1.id,
        editGroup2.id,
      ]);
    });
  });
  describe("startDateRange", () => {
    it("should return undefined", () => {
      const result = processFilters([{ predicates: [] }]);
      expect(result.startDateTimeBefore).toBeUndefined();
      expect(result.startDateTimeAfter).toBeUndefined();
    });
    it("should return startDateTimeBefore and startDateTimeAfter and only use first occurrence of startDateRange", () => {
      const result = processFilters([
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
      ]);
      expect(result.startDateTimeBefore).toEqual("2024-04-29T03:59:59.999Z");
      expect(result.startDateTimeAfter).toEqual("2024-04-28T04:00:00.000Z");
    });
    it("should be prioritized over individual startDateBefore and startDateAfter", () => {
      const result = processFilters([
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
      ]);
      expect(result.startDateTimeBefore).toEqual("2024-04-29T03:59:59.999Z");
      expect(result.startDateTimeAfter).toEqual("2024-04-28T04:00:00.000Z");
    });
  });
  describe("startDateBefore", () => {
    it("should return undefined", () => {
      const result = processFilters([{ predicates: [] }]);
      expect(result.startDateTimeBefore).toBeUndefined();
    });
    it("should only use first occurrence", () => {
      const result = processFilters([
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
      ]);
      expect(result.startDateTimeBefore).toEqual("2024-04-28T04:00:00.000Z");
    });
  });
  describe("startDateAfter", () => {
    it("should return undefined", () => {
      const result = processFilters([{ predicates: [] }]);
      expect(result.startDateTimeAfter).toBeUndefined();
    });
    it("should only use first occurrence", () => {
      const result = processFilters([
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
      ]);
      expect(result.startDateTimeAfter).toEqual("2024-04-28T04:00:00.000Z");
    });
  });
  describe("endDateRange", () => {
    it("should return undefined", () => {
      const result = processFilters([{ predicates: [] }]);
      expect(result.endDateTimeBefore).toBeUndefined();
      expect(result.endDateTimeAfter).toBeUndefined();
    });
    it("should return endDateTimeBefore and endDateTimeAfter and only use first occurrence of endDateRange", () => {
      const result = processFilters([
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
      ]);
      expect(result.endDateTimeBefore).toEqual("2024-04-29T03:59:59.999Z");
      expect(result.endDateTimeAfter).toEqual("2024-04-28T04:00:00.000Z");
    });
    it("should be prioritized over individual endDateBefore and endDateAfter", () => {
      const result = processFilters([
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
      ]);
      expect(result.endDateTimeBefore).toEqual("2024-04-29T03:59:59.999Z");
      expect(result.endDateTimeAfter).toEqual("2024-04-28T04:00:00.000Z");
    });
  });
  describe("endDateBefore", () => {
    it("should return undefined", () => {
      const result = processFilters([{ predicates: [] }]);
      expect(result.endDateTimeBefore).toBeUndefined();
    });
    it("should only use first occurrence", () => {
      const result = processFilters([
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
      ]);
      expect(result.endDateTimeBefore).toEqual("2024-04-28T04:00:00.000Z");
    });
  });
  describe("endDateAfter", () => {
    it("should return undefined", () => {
      const result = processFilters([{ predicates: [] }]);
      expect(result.endDateTimeAfter).toBeUndefined();
    });
    it("should only use first occurrence", () => {
      const result = processFilters([
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
      ]);
      expect(result.endDateTimeAfter).toEqual("2024-04-28T04:00:00.000Z");
    });
  });
  describe("occurrence", () => {
    const mockedDate = new Date(1711987200000);
    beforeAll(() => {
      jasmine.clock().mockDate(mockedDate);
    });
    afterAll(() => {
      jasmine.clock().uninstall();
    });
    it("should return undefined", () => {
      const result = processFilters([{ predicates: [] }]);
      expect(result.startDateTimeBefore).toBeUndefined();
      expect(result.startDateTimeAfter).toBeUndefined();
    });
    it("should ignore unsupported values", () => {
      const result = processFilters([
        {
          predicates: [
            {
              occurrence: "other",
            },
          ],
        },
      ]);
      expect(result.startDateTimeBefore).toBeUndefined();
      expect(result.startDateTimeAfter).toBeUndefined();
    });
    it("should handle upcoming", () => {
      const result = processFilters([
        {
          predicates: [
            {
              occurrence: "upcoming",
            },
          ],
        },
      ]);
      expect(result.startDateTimeAfter).toEqual(mockedDate.toISOString());
    });
    it("should handle past", () => {
      const result = processFilters([
        {
          predicates: [
            {
              occurrence: "past",
            },
          ],
        },
      ]);
      expect(result.endDateTimeBefore).toEqual(mockedDate.toISOString());
    });
    it("should handle inProgress", () => {
      const result = processFilters([
        {
          predicates: [
            {
              occurrence: "inProgress",
            },
          ],
        },
      ]);
      expect(result.startDateTimeBefore).toEqual(mockedDate.toISOString());
      expect(result.endDateTimeAfter).toEqual(mockedDate.toISOString());
    });
  });
  describe("modified", () => {
    it("should return undefined", () => {
      const result = processFilters([{ predicates: [] }]);
      // TODO: remove ts-ignore once ISearchEvents supports filtering by updatedAtBefore https://devtopia.esri.com/dc/hub/issues/12925
      // @ts-ignore
      expect(result.updatedAtBefore).toBeUndefined();
      // TODO: remove ts-ignore once ISearchEvents supports filtering by updatedAtBefore https://devtopia.esri.com/dc/hub/issues/12925
      // @ts-ignore
      expect(result.updatedAtBefore).toBeUndefined();
    });
    it("should return updatedAtBefore and updatedAtAfter and only use first occurrence of modified", () => {
      const result = processFilters([
        {
          predicates: [
            {
              modified: {
                from: 1714276800000,
                to: 1714363199999,
              },
            },
          ],
        },
        {
          predicates: [
            {
              modified: {
                from: 1814276800000,
                to: 1814363199999,
              },
            },
          ],
        },
      ]);
      // TODO: remove ts-ignore once ISearchEvents supports filtering by updatedAtBefore https://devtopia.esri.com/dc/hub/issues/12925
      // @ts-ignore
      expect(result.updatedAtBefore).toEqual("2024-04-29T03:59:59.999Z");
      // TODO: remove ts-ignore once ISearchEvents supports filtering by updatedAtBefore https://devtopia.esri.com/dc/hub/issues/12925
      // @ts-ignore
      expect(result.updatedAtAfter).toEqual("2024-04-28T04:00:00.000Z");
    });
  });
});
