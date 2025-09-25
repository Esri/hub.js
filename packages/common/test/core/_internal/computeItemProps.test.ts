import { computeItemProps } from "../../../src/core/_internal/computeItemProps";
import type { IItem } from "@esri/arcgis-rest-portal";
import * as internalContentUtils from "../../../src/content/_internal/internalContentUtils";
import { IHubItemEntity } from "../../../src/core/types/IHubItemEntity";

describe("computeItemProps", () => {
  const item: IItem = {} as IItem;
  const entity: Partial<IHubItemEntity> = {};
  it("sets base properties on entity", () => {
    const deriveLocationFromItemSpy = spyOn(
      internalContentUtils,
      "deriveLocationFromItem"
    ).and.callThrough();
    const chk = computeItemProps(item, entity);
    expect(chk.location).toEqual({ type: "none" });
    expect(deriveLocationFromItemSpy.calls.count()).toEqual(1);
  });
});
