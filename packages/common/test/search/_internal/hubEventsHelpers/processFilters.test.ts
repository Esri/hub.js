import { processFilters } from "../../../../src/search/_internal/hubEventsHelpers/processFilters";
import { IFilter } from "../../../../src/search/types/IHubCatalog";
import * as arcgisRestPortal from "@esri/arcgis-rest-portal";

const group1 = {
  title: "This is the fake group",
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

const group2 = {
  title: "This is a fake group",
  isOpenData: false,
  capabilities: [],
  owner: "jhonvader",
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

const MULTI_SELECT_FILTERS: IFilter[] = [
  {
    predicates: [
      {
        term: "abc",
      },
    ],
  },
  {
    operation: "OR",
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
    operation: "OR",
    predicates: [
      {
        access: "public",
      },
      {
        access: "org",
      },
      {
        access: "private",
      },
    ],
  },
  {
    operation: "OR",
    predicates: [
      {
        attendanceType: "online",
      },
      {
        attendanceType: "in_person",
      },
    ],
  },
  {
    operation: "OR",
    predicates: [
      {
        categories: "category1",
      },
      {
        categories: "category2",
      },
    ],
  },
  {
    operation: "OR",
    predicates: [
      {
        tags: "tag1",
      },
      {
        tags: "tag2",
      },
    ],
  },
  {
    operation: "OR",
    predicates: [
      {
        entityId: "entity1",
      },
      {
        entityId: "entity2",
      },
    ],
  },
  {
    operation: "OR",
    predicates: [
      {
        entityType: "Hub Initiative",
      },
      {
        entityType: "Hub Project",
      },
    ],
  },
  {
    operation: "OR",
    predicates: [
      {
        id: "event1",
      },
      {
        id: "event2",
      },
    ],
  },
  {
    operation: "OR",
    predicates: [
      {
        readGroupId: "group1",
      },
      {
        readGroupId: "group2",
      },
    ],
  },
  {
    operation: "OR",
    predicates: [
      {
        editGroupId: "group1",
      },
      {
        editGroupId: "group2",
      },
    ],
  },
  {
    operation: "OR",
    predicates: [
      {
        owner: "owner",
      },
    ],
  },
  {
    operation: "OR",
    predicates: [
      {
        canEdit: "true",
      },
    ],
  },
  {
    operation: "OR",
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
    operation: "OR",
    predicates: [
      {
        endDateRange: {
          from: 1714376800000,
          to: 1714463199999,
        },
      },
    ],
  },
];

const SINGLE_SELECT_FILTERS: IFilter[] = [
  {
    predicates: [
      {
        term: "abc",
      },
    ],
  },
  {
    operation: "OR",
    predicates: [
      {
        status: "planned",
      },
    ],
  },
  {
    operation: "OR",
    predicates: [
      {
        access: "public",
      },
    ],
  },
  {
    operation: "OR",
    predicates: [
      {
        attendanceType: "online",
      },
    ],
  },
  {
    operation: "OR",
    predicates: [
      {
        categories: "category1",
      },
    ],
  },
  {
    operation: "OR",
    predicates: [
      {
        tags: "tag1",
      },
    ],
  },
  {
    operation: "OR",
    predicates: [
      {
        owner: "owner",
      },
    ],
  },
  {
    operation: "OR",
    predicates: [
      {
        canEdit: "true",
      },
    ],
  },
  {
    operation: "OR",
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
    operation: "OR",
    predicates: [
      {
        endDateRange: {
          from: 1714376800000,
          to: 1714463199999,
        },
      },
    ],
  },
];

describe("processFilters", () => {
  it("should process multi-select filters", async () => {
    const results = await processFilters(MULTI_SELECT_FILTERS, {});
    expect(results).toEqual({
      title: "abc",
      categories: "category1,category2",
      tags: "tag1,tag2",
      access: "public,org,private",
      attendanceTypes: "online,in_person",
      status: "planned,canceled",
      endDateTimeAfter: "2024-04-29T07:46:40.000Z",
      endDateTimeBefore: "2024-04-30T07:46:39.999Z",
      startDateTimeAfter: "2024-04-28T04:00:00.000Z",
      startDateTimeBefore: "2024-04-29T03:59:59.999Z",
      entityIds: "entity1,entity2",
      entityTypes: "Hub Initiative,Hub Project",
      eventIds: "event1,event2",
      readGroups: "group1,group2",
      editGroups: "group1,group2",
      createdByIds: "owner",
      canEdit: "true",
    } as any);
  });
  it("should process groups", async () => {
    spyOn(arcgisRestPortal, "searchGroups").and.returnValue({
      results: [group1, group2],
    });
    const filters: IFilter[] = [
      {
        operation: "OR",
        predicates: [
          {
            group: ["group1", "group2"],
          },
        ],
      },
    ];
    const results = await processFilters(filters, {});
    expect(results).toEqual({
      readGroups: "group2",
      editGroups: "group1",
      status: "planned,canceled",
    });
  });
  it("should process groups when no groups are found", async () => {
    spyOn(arcgisRestPortal, "searchGroups").and.returnValue({ results: [] });
    const filters: IFilter[] = [
      {
        operation: "OR",
        predicates: [
          {
            group: ["group1", "group2"],
          },
        ],
      },
    ];
    const results = await processFilters(filters, {});
    expect(results).toEqual({
      status: "planned,canceled",
    });
  });
  it("should process single-select filters", async () => {
    const results = await processFilters(SINGLE_SELECT_FILTERS, {});
    expect(results).toEqual({
      title: "abc",
      categories: "category1",
      tags: "tag1",
      access: "public",
      attendanceTypes: "online",
      status: "planned",
      endDateTimeAfter: "2024-04-29T07:46:40.000Z",
      endDateTimeBefore: "2024-04-30T07:46:39.999Z",
      startDateTimeAfter: "2024-04-28T04:00:00.000Z",
      startDateTimeBefore: "2024-04-29T03:59:59.999Z",
      createdByIds: "owner",
      canEdit: "true",
    } as any);
  });
  it("should set some defaults", async () => {
    const results = await processFilters([], {});
    expect(results).toEqual({
      status: "planned,canceled",
    } as any);
  });
});
