import { HubEntity } from "../../src/core/types";

export const MOCK_PARENT_ENTITY = {
  id: "parent-00a",
  type: "Hub Initiative",
  associations: {
    groupId: "group-00a",
    rules: {
      schemaVersion: 1,
      query: {
        targetEntity: "item",
        filters: [{ predicates: [{ group: "group-00a" }] }],
      },
    },
  },
} as unknown as HubEntity;

export const MOCK_CHILD_ENTITY = {
  id: "child-00a",
  type: "Hub Project",
  typeKeywords: ["ref|initiative|parent-00a"],
} as unknown as HubEntity;
