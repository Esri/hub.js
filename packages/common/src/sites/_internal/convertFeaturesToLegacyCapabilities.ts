import { getProp } from "../../objects";
import { IModel } from "../../types";

export const convertFeaturesToLegacyCapabilities = (
  modelToUpdate: IModel,
  currentModel: IModel
): IModel => {
  let legacyCapabilities: Record<string, boolean> = {};
  const updatedFeatures = getProp(modelToUpdate, "data.settings.features");

  // 1. convert legacy capabilities to a boolean hash
  getProp(currentModel, "data.values.capabilities").forEach(
    (capability: string) => {
      legacyCapabilities[capability] = true;
    }
  );

  // 2. override legacy capabilities that are driven by features
  legacyCapabilities = {
    ...legacyCapabilities,
    hideFollow: !updatedFeatures["hub:site:followers:action"],
  };

  // 3. convert legacy capabilities back to an array and persist on model
  modelToUpdate.data.values.capabilities = Object.entries(
    legacyCapabilities
  ).reduce((acc, [key, value]) => {
    value && acc.push(key);
    return acc;
  }, []);

  return modelToUpdate;
};
