import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getEventGroups } from "../../../src/events/_internal/getEventGroups";
import * as portalModule from "@esri/arcgis-rest-portal";
import { IHubEvent } from "../../../src/core/types/IHubEvent";

describe("getEventGroups", () => {
  let searchGroupsSpy: jasmine.Spy;
  let groups: portalModule.IGroup[];
  let requestOptions: IRequestOptions;
  let entity: IHubEvent;

  beforeEach(() => {
    requestOptions = {
      portal: "https://some.portal",
    };
    groups = [
      { id: "31c", capabilities: [] } as unknown as portalModule.IGroup,
      { id: "49a", capabilities: [] } as unknown as portalModule.IGroup,
      {
        id: "52n",
        capabilities: ["updateitemcontrol"],
      } as unknown as portalModule.IGroup,
    ];
    entity = {
      id: "31c",
      readGroupIds: [groups[0].id, groups[1].id],
      editGroupIds: [groups[2].id],
    } as IHubEvent;
    searchGroupsSpy = spyOn(portalModule, "searchGroups").and.returnValues(
      Promise.resolve({
        results: [groups[0], groups[1]],
      } as portalModule.ISearchResult<portalModule.IGroup>),
      Promise.resolve({
        results: [groups[2]],
      } as portalModule.ISearchResult<portalModule.IGroup>)
    );
  });

  it("should fetch the event groups", async () => {
    const res = await getEventGroups(entity, requestOptions);
    expect(searchGroupsSpy).toHaveBeenCalledTimes(2);
    expect(searchGroupsSpy).toHaveBeenCalledWith({
      q: "id:(31c OR 49a)",
      num: 2,
      ...requestOptions,
    });
    expect(searchGroupsSpy).toHaveBeenCalledWith({
      q: "id:(52n)",
      num: 1,
      ...requestOptions,
    });
    expect(res).toEqual(groups);
  });

  it("should short circuit when event has no groups", async () => {
    entity = { ...entity, readGroupIds: [], editGroupIds: [] };
    const res = await getEventGroups(entity, requestOptions);
    expect(searchGroupsSpy).toHaveBeenCalledTimes(0);
    expect(res).toEqual([]);
  });
});
