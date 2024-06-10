import { processFilters } from "../../../../src/search/_internal/hubEventsHelpers/processFilters";
import { IFilter } from "../../../../src/search/types/IHubCatalog";

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
        entityIds: "entity1",
      },
      {
        entityIds: "entity2",
      },
    ],
  },
  {
    operation: "OR",
    predicates: [
      {
        entityTypes: "Hub Initiative",
      },
      {
        entityTypes: "Hub Project",
      },
    ],
  },
  {
    operation: "OR",
    predicates: [
      {
        eventIds: "event1",
      },
      {
        eventIds: "event2",
      },
    ],
  },
  {
    operation: "OR",
    predicates: [
      {
        readGroupsIds: "group1",
      },
      {
        readGroupsIds: "group2",
      },
    ],
  },
  {
    operation: "OR",
    predicates: [
      {
        editGroupsIds: "group1",
      },
      {
        editGroupsIds: "group2",
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
];

describe("processFilters", () => {
  it("should process multi-select filters", () => {
    const results = processFilters(MULTI_SELECT_FILTERS);
    expect(results).toEqual({
      title: "abc",
      categories: "category1,category2",
      tags: "tag1,tag2",
      access: "public,org,private",
      attendanceTypes: "online,in_person",
      status: "planned,canceled",
      startDateTimeAfter: "2024-04-28T04:00:00.000Z",
      startDateTimeBefore: "2024-04-29T03:59:59.999Z",
      entityIds: "entity1,entity2",
      entityTypes: "Hub Initiative,Hub Project",
      eventIds: "event1,event2",
      readGroups: "group1,group2",
      editGroups: "group1,group2",
      createdById: "owner",
      canEdit: "true",
    } as any);
  });
  it("should process single-select filters", () => {
    const results = processFilters(SINGLE_SELECT_FILTERS);
    expect(results).toEqual({
      title: "abc",
      categories: "category1",
      tags: "tag1",
      access: "public",
      attendanceTypes: "online",
      status: "planned",
      startDateTimeAfter: "2024-04-28T04:00:00.000Z",
      startDateTimeBefore: "2024-04-29T03:59:59.999Z",
      createdById: "owner",
      canEdit: "true",
    } as any);
  });
  it("should set some defaults", () => {
    const results = processFilters([]);
    expect(results).toEqual({
      status: "planned,canceled",
    });
  });
});
