import { IArcGISContext } from "../../src/ArcGISContext";
import { HubEntity } from "../../src/core/types/HubEntity";
import { IQuery } from "../../src/search/types/IHubCatalog";
import * as getTypeFromEntityModule from "../../src/core/getTypeFromEntity";
import * as getAssociatedEntitiesQueryModule from "../../src/associations/getAssociatedEntitiesQuery";
import * as getEventAssociationsQueryModule from "../../src/events/_internal/getEventAssociationsQuery";
import { getEntityAssociationsQuery } from "../../src/associations/getEntityAssociationsQuery";

describe("getEntityAssociationsQuery", () => {
  const context = { authentication: {} } as unknown as IArcGISContext;
  const projectOrInitiativeAssociationsQuery = {
    projects: true,
    initiatives: true,
  } as unknown as IQuery;
  const eventAssociationsQuery = {
    events: true,
  } as unknown as IQuery;
  const entity = { id: "31c" } as unknown as HubEntity;
  let getTypeFromEntitySpy: jasmine.Spy;
  let getAssociatedEntitiesQuerySpy: jasmine.Spy;
  let getEventAssociationsQuerySpy: jasmine.Spy;

  beforeEach(() => {
    getTypeFromEntitySpy = spyOn(getTypeFromEntityModule, "getTypeFromEntity");
    getAssociatedEntitiesQuerySpy = spyOn(
      getAssociatedEntitiesQueryModule,
      "getAssociatedEntitiesQuery"
    ).and.returnValue(Promise.resolve(projectOrInitiativeAssociationsQuery));
    getEventAssociationsQuerySpy = spyOn(
      getEventAssociationsQueryModule,
      "getEventAssociationsQuery"
    ).and.returnValue(eventAssociationsQuery);
  });

  it("should get associations for a project", async () => {
    getTypeFromEntitySpy.and.returnValue("project");
    const result = await getEntityAssociationsQuery(entity, context);
    expect(getAssociatedEntitiesQuerySpy).toHaveBeenCalledTimes(1);
    expect(getAssociatedEntitiesQuerySpy).toHaveBeenCalledWith(
      entity,
      "initiative",
      context
    );
    expect(getEventAssociationsQuerySpy).not.toHaveBeenCalled();
    expect(result).toEqual(projectOrInitiativeAssociationsQuery);
  });

  it("should get associations for an initiative", async () => {
    getTypeFromEntitySpy.and.returnValue("initiative");
    const result = await getEntityAssociationsQuery(entity, context);
    expect(getAssociatedEntitiesQuerySpy).toHaveBeenCalledTimes(1);
    expect(getAssociatedEntitiesQuerySpy).toHaveBeenCalledWith(
      entity,
      "project",
      context
    );
    expect(getEventAssociationsQuerySpy).not.toHaveBeenCalled();
    expect(result).toEqual(projectOrInitiativeAssociationsQuery);
  });

  it("should get associations for an event", async () => {
    getTypeFromEntitySpy.and.returnValue("event");
    const result = await getEntityAssociationsQuery(entity, context);
    expect(getEventAssociationsQuerySpy).toHaveBeenCalledTimes(1);
    expect(getEventAssociationsQuerySpy).toHaveBeenCalledWith(entity);
    expect(getAssociatedEntitiesQuerySpy).not.toHaveBeenCalled();
    expect(result).toEqual(eventAssociationsQuery);
  });

  it("should resolve null", async () => {
    getTypeFromEntitySpy.and.returnValue("other");
    const result = await getEntityAssociationsQuery(entity, context);
    expect(getEventAssociationsQuerySpy).not.toHaveBeenCalled();
    expect(getAssociatedEntitiesQuerySpy).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
