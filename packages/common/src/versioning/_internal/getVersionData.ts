import { IModel } from "../../index";
import { mergeObjects } from "../../objects";

// gets the version data (ie the part of the model that goes into the version data) from the model
export function getVersionData(
  model: IModel,
  includeList: string[]
): Record<string, any> {
  return mergeObjects(model, {}, includeList);
}
