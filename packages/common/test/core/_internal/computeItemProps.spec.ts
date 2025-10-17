import { computeItemProps } from "../../../src/core/_internal/computeItemProps";
import type { IItem } from "@esri/arcgis-rest-portal";
import * as internalContentUtils from "../../../src/content/_internal/internalContentUtils";
import { IHubItemEntity } from "../../../src/core/types/IHubItemEntity";

describe("computeItemProps", () => {
  const item: IItem = {} as IItem;
  const entity: Partial<IHubItemEntity> = {};
  it("sets base properties on entity", () => {
    const deriveLocationFromItemSpy = vi.spyOn(
      internalContentUtils,
      "deriveLocationFromItem"
    );
    const chk = computeItemProps(item, entity);
    expect(chk.location).toEqual({ type: "none" });
    expect(deriveLocationFromItemSpy.mock.calls.length).toEqual(1);
  });
});
