import { failSafe } from "../utils";
import { getModel } from "../models";
import { IModel } from "../types";

/**
 * To streamline passing of either a model id or the model itself, we use this function
 * to extract the model or fetch it, and return it. It uses `failSafe` and if the item
 * is not accessible for whatever reason, will return a model-ish object with `isMissing: true`
 * It is up to the caller to take approriate action
 * @param {String} modelType the type of model to extract from the options hash
 * @param {Object} options Something that extends IRequestOptions
 */
export function getModelFromOptions(
  modelType: string,
  options: Record<string, any>
): Promise<IModel> {
  const modelProp = `${modelType}Model`;
  const idProp = `${modelType}Id`;
  // if the options hash has the model, return it
  if (options[modelProp]) {
    return Promise.resolve(options[modelProp]);
  } else {
    if (options[idProp]) {
      const failSafeModel = failSafe(getModel, {
        item: { id: options[idProp] },
        isMissing: true,
      });
      return failSafeModel(options[idProp], options);
    } else {
      throw new Error(
        `getModelFromOptions requires either a .${modelProp} or .${idProp} property.`
      );
    }
  }
}
