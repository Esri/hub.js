import { IHubEvent } from "../../../src/core/types/IHubEvent";
import { getEventAssociationsQuery } from "../../../src/events/_internal/getEventAssociationsQuery";

describe("getEventAssociationsQuery", () => {
  it("should return null when the event doesn't reference other entities", () => {
    const entity = { referencedContentIds: [] } as unknown as IHubEvent;
    const result = getEventAssociationsQuery(entity);
    expect(result).toBeNull();
  });

  it("should return an IQuery", () => {
    const entity = {
      referencedContentIds: ["31c", "42b"],
    } as unknown as IHubEvent;
    const result = getEventAssociationsQuery(entity);
    expect(result).toEqual({
      targetEntity: "item",
      filters: [
        {
          predicates: [{ id: ["31c", "42b"] }],
        },
      ],
    });
  });
});
