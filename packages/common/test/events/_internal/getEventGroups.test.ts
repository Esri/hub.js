import { getEventGroups } from "../../../src/events/_internal/getEventGroups";
import * as portalModule from "@esri/arcgis-rest-portal";
import * as eventsModule from "../../../src/events/api/events";
import { IHubEvent } from "../../../src/core/types/IHubEvent";
import { IArcGISContext } from "../../../src/ArcGISContext";
import { IEvent } from "../../../src/events/api/orval/api/orval-events";

describe("getEventGroups", () => {
  let searchGroupsSpy: jasmine.Spy;
  let getEventSpy: jasmine.Spy;
  let groups: portalModule.IGroup[];
  let context: IArcGISContext;
  let entity: IHubEvent;
  let record: IEvent;

  beforeEach(() => {
    context = {
      requestOptions: {
        authentication: {
          portal: "https://some.portal",
        },
      },
      hubRequestOptions: {
        authentication: {
          portal: "https://some.portal",
        },
        hubApiUrl: "https://some.hub",
      },
      session: {},
    } as IArcGISContext;
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
    } as IHubEvent;
    record = {
      id: "31c",
      readGroups: [groups[0].id, groups[1].id],
      editGroups: [groups[2].id],
    } as IEvent;
    searchGroupsSpy = spyOn(portalModule, "searchGroups").and.returnValues(
      Promise.resolve({
        results: [groups[0], groups[1]],
      } as portalModule.ISearchResult<portalModule.IGroup>),
      Promise.resolve({
        results: [groups[2]],
      } as portalModule.ISearchResult<portalModule.IGroup>)
    );
    getEventSpy = spyOn(eventsModule, "getEvent").and.returnValue(
      Promise.resolve(record)
    );
  });

  it("should fetch the event groups", async () => {
    const res = await getEventGroups(entity.id, context);
    expect(getEventSpy).toHaveBeenCalledTimes(1);
    expect(getEventSpy).toHaveBeenCalledWith({
      eventId: entity.id,
      ...context.hubRequestOptions,
    });
    expect(searchGroupsSpy).toHaveBeenCalledTimes(2);
    expect(searchGroupsSpy).toHaveBeenCalledWith({
      q: "id:(31c OR 49a)",
      num: 2,
      ...context.requestOptions,
    });
    expect(searchGroupsSpy).toHaveBeenCalledWith({
      q: "id:(52n)",
      num: 1,
      ...context.requestOptions,
    });
    expect(res).toEqual(groups);
  });

  it("should short circuit when event has no groups", async () => {
    record = { ...record, readGroups: [], editGroups: [] };
    getEventSpy.and.returnValue(Promise.resolve(record));
    const res = await getEventGroups(entity.id, context);
    expect(getEventSpy).toHaveBeenCalledTimes(1);
    expect(getEventSpy).toHaveBeenCalledWith({
      eventId: entity.id,
      ...context.hubRequestOptions,
    });
    expect(searchGroupsSpy).toHaveBeenCalledTimes(0);
    expect(res).toEqual([]);
  });
});
