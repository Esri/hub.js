import { IHubGroup } from "../../src/core/types/IHubGroup";
import { setEntityAssociationGroup } from "../../src/associations/setEntityAssociationGroup";
import { MOCK_INITIAL_PARENT_ENTITY } from "./fixtures";
import * as UpdateHubEntityModule from "../../src/core/updateHubEntity";
import { ArcGISContext } from "../../src/ArcGISContext";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("setEntityAssociationGroup", () => {
  let updateHubEntitySpy: any;

  beforeEach(() => {
    updateHubEntitySpy = vi
      .spyOn(UpdateHubEntityModule, "updateHubEntity")
      .mockResolvedValue(undefined as any);
  });

  it("sets an entity association group", async () => {
    const group = {
      typeKeywords: [],
      id: "g123",
    } as unknown as IHubGroup;

    await setEntityAssociationGroup(
      MOCK_INITIAL_PARENT_ENTITY,
      group,
      {} as ArcGISContext
    );
    expect(updateHubEntitySpy).toHaveBeenCalledTimes(2);
    expect(updateHubEntitySpy).toHaveBeenNthCalledWith(
      1,
      "group",
      {
        typeKeywords: ["initiative|parent-00a"],
        id: "g123",
      },
      {}
    );
    expect(updateHubEntitySpy).toHaveBeenNthCalledWith(
      2,
      "initiative",
      {
        id: "parent-00a",
        type: "Hub Initiative",
        associations: {
          groupId: "g123",
          rules: {
            schemaVersion: 1,
            query: {
              targetEntity: "item",
              filters: [{ predicates: [{ group: "g123" }] }],
            },
          },
        },
      },
      {}
    );
  });

  it("set an entity association group with existing typeKeywords", async () => {
    const group = {
      typeKeywords: ["existing-keyword"],
      id: "g123",
    } as unknown as IHubGroup;

    await setEntityAssociationGroup(
      MOCK_INITIAL_PARENT_ENTITY,
      group,
      {} as ArcGISContext
    );
    expect(updateHubEntitySpy).toHaveBeenCalledTimes(2);
    expect(updateHubEntitySpy).toHaveBeenNthCalledWith(
      1,
      "group",
      {
        typeKeywords: ["existing-keyword", "initiative|parent-00a"],
        id: "g123",
      },
      {}
    );
    expect(updateHubEntitySpy).toHaveBeenNthCalledWith(
      2,
      "initiative",
      {
        id: "parent-00a",
        type: "Hub Initiative",
        associations: {
          groupId: "g123",
          rules: {
            schemaVersion: 1,
            query: {
              targetEntity: "item",
              filters: [{ predicates: [{ group: "g123" }] }],
            },
          },
        },
      },
      {}
    );
  });

  it("sets an association group that already has the entity typeKeyword", async () => {
    const group = {
      typeKeywords: ["initiative|parent-00a"],
      id: "g123",
    } as unknown as IHubGroup;

    await setEntityAssociationGroup(
      MOCK_INITIAL_PARENT_ENTITY,
      group,
      {} as ArcGISContext
    );
    expect(updateHubEntitySpy).toHaveBeenCalledTimes(2);
    expect(updateHubEntitySpy).toHaveBeenNthCalledWith(
      1,
      "group",
      {
        typeKeywords: ["initiative|parent-00a"],
        id: "g123",
      },
      {}
    );
    expect(updateHubEntitySpy).toHaveBeenNthCalledWith(
      2,
      "initiative",
      {
        id: "parent-00a",
        type: "Hub Initiative",
        associations: {
          groupId: "g123",
          rules: {
            schemaVersion: 1,
            query: {
              targetEntity: "item",
              filters: [{ predicates: [{ group: "g123" }] }],
            },
          },
        },
      },
      {}
    );
  });
});
