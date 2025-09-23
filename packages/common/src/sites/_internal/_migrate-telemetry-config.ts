import { IModel, IDraft } from "../../hub-types";
import { getProp } from "../../objects/get-prop";
import { setProp } from "../../objects/set-prop";
import { cloneObject } from "../../util";

/**
 * Reconfigure event list card properties
 * @private
 * @param {object} model Site Model
 * @returns {object}
 */
export function _migrateTelemetryConfig<T extends IModel | IDraft>(
  model: T
): T {
  // NOTE: this migration was initially 1.6 => 1.7 but i (jupe) did not get the ui in sync so we will just do it again and i will get it right this time
  const newSchemaVersion = 1.8;
  // do nothing if migration already applied
  if (getProp(model, "item.properties.schemaVersion") >= newSchemaVersion) {
    return model;
  }

  // apply migration
  const clone = cloneObject(model);

  clone.data.telemetry = {};
  // get allowPrivacyConfig from consentNotice capability
  const capabilities = getProp(model, "data.values.capabilities") || [];
  const allowPrivacyConfig = capabilities.includes("consentNotice");

  // migrate consentNotice
  clone.data.telemetry.consentNotice = {
    allowPrivacyConfig,
    disclaimer: [
      {
        text:
          getProp(model, "data.values.telemetry.consentNotice.consentText") ||
          "",
        default: true,
      },
    ],
    policyURL:
      getProp(model, "data.values.telemetry.consentNotice.policyURL") || "",
  };

  // this doesn't actually have any effect - not sure we have a way to get rid of stuff
  // delete clone.data?.values?.telemetry;

  // if we have item.properties.telemetry.plugins, move it to data.telemetry
  const plugins = getProp(model, "item.properties.telemetry.plugins");
  if (plugins) {
    clone.data.telemetry.plugins = plugins;

    // this doesn't actually have any effect - not sure we have a way to get rid of stuff
    // delete clone.item?.properties?.telemetry;
  }

  // increment schemaVersion
  setProp("item.properties.schemaVersion", newSchemaVersion, clone);

  return clone;
}
