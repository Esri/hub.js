import { computeItemProps } from "../../../src/core/_internal/computeItemProps";
import { IItem } from "@esri/arcgis-rest-types";
import { IHubItemEntity } from "../../../src";
import * as internalContentUtils from "../../../src/content/_internal/internalContentUtils";

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
