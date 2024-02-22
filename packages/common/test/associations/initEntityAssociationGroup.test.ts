import { IHubGroup } from "../../src/core/types/IHubGroup";
import { initEntityAssociationGroup } from "../../src/associations/initEntityAssociationGroup";
import { MOCK_INITIAL_PARENT_ENTITY } from "./fixtures";
import * as UpdateHubEntityModule from "../../src/core/updateHubEntity";
import { ArcGISContext } from "../../src/ArcGISContext";

describe("initEntityAssociationGroup", () => {
  let updateHubEntitySpy: jasmine.Spy;

  beforeEach(() => {
    updateHubEntitySpy = spyOn(
      UpdateHubEntityModule,
      "updateHubEntity"
    ).and.returnValue(Promise.resolve());
  });

  it("initializes an entity association group", async () => {
    const group = {
      typeKeywords: [],
      id: "g123",
    } as unknown as IHubGroup;

    await initEntityAssociationGroup(
      MOCK_INITIAL_PARENT_ENTITY,
      group,
      {} as ArcGISContext
    );
    expect(updateHubEntitySpy).toHaveBeenCalledTimes(2);
    expect(updateHubEntitySpy.calls.argsFor(0)).toEqual([
      "group",
      { typeKeywords: ["initiative|parent-00a"], id: "g123" },
      {},
    ]);
    expect(updateHubEntitySpy.calls.argsFor(1)).toEqual([
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
      {},
    ]);
  });

  it("initializes an entity association group with existing typeKeywords", async () => {
    const group = {
      typeKeywords: ["existing-keyword"],
      id: "g123",
    } as unknown as IHubGroup;

    await initEntityAssociationGroup(
      MOCK_INITIAL_PARENT_ENTITY,
      group,
      {} as ArcGISContext
    );
    expect(updateHubEntitySpy).toHaveBeenCalledTimes(2);
    expect(updateHubEntitySpy.calls.argsFor(0)).toEqual([
      "group",
      {
        typeKeywords: ["existing-keyword", "initiative|parent-00a"],
        id: "g123",
      },
      {},
    ]);
    expect(updateHubEntitySpy.calls.argsFor(1)).toEqual([
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
      {},
    ]);
  });
});
