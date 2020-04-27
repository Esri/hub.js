import { IModelTemplate } from "../types";
import { adlib } from "adlib";

/**
 * Interpolate the item id back into any  {{appid}} instances
 * in the item. Allows for self-referencing in templates
 * @param {object} model Item Model
 */
export function interpolateItemId(
  model: IModelTemplate | any
): IModelTemplate | any {
  const settings = { item: { id: model.item.id }, appid: model.item.id };
  const transforms = {
    toISO(_: string, v: any) {
      return v ? new Date(v).toISOString() : v;
    }
  };
  return adlib(model, settings, transforms);
}
