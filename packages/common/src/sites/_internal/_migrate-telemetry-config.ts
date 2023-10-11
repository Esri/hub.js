import { setProp } from "../../objects";
import { IModel, IDraft } from "../../types";
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
  const newSchemaVersion = 1.7;
  // do nothing if migration already applied
  if (model.item.properties?.schemaVersion >= newSchemaVersion) return model;

  // apply migration
  const clone = cloneObject(model);

  // get allowPrivacyConfig from consentNotice capability
  const allowPrivacyConfig =
    clone.data.values.capabilities?.includes("consentNotice");
  clone.data.telemetry = clone.data.telemetry || {
    consentNotice: { allowPrivacyConfig },
  };

  // if we have data.values.telemetry.consentNotice, move it to data.telemetry
  // the only other key that would be on telemetry would be customAnalytics which is no longer used (right?)
  if (clone.data?.values?.telemetry?.consentNotice) {
    clone.data.telemetry.consentNotice = {
      ...clone.data.values.telemetry.consentNotice,
      allowPrivacyConfig,
    };

    // move consentText into the disclaimer array
    clone.data.telemetry.consentNotice.disclaimer = [
      { text: clone.data.telemetry.consentNotice?.consentText },
    ];
    delete clone.data.telemetry.consentNotice?.consentText;

    // remove old props
    delete clone.data.telemetry.consentNotice?.isTheme;
    delete clone.data.telemetry.consentNotice?.policyURLText;

    // this doesn't actually have any effect - not sure we have a way to get rid of stuff
    // delete clone.data?.values?.telemetry;
  }

  // if we have item.properties.telemetry.plugins, move it to data.telemetry
  if (
    !clone.data.telemetry.plugins &&
    clone.item?.properties?.telemetry?.plugins
  ) {
    clone.data.telemetry.plugins = clone.item.properties.telemetry.plugins;

    // this doesn't actually have any effect - not sure we have a way to get rid of stuff
    // delete clone.item?.properties?.telemetry;
  }

  // increment schemaVersion
  setProp("item.properties.schemaVersion", newSchemaVersion, clone);

  return clone;
}
