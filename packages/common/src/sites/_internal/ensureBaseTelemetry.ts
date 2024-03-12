import { getProp } from "../../objects";
import { IDraft, IModel } from "../../types";
import { cloneObject } from "../../util";

/**
 * During a period in late 2023 and early 2024, the python api
 * was writing a bad confirmation for basemaps as part of the site
 * cloning process. This migration will fix that.
 * @param {Object} model Site Model
 * @private
 */
export function ensureBaseTelemetry<T extends IModel | IDraft>(model: T) {
  // Unlike other migrations, this is not based on a version
  // rather it checks for a missing telemetry property.

  // Early exit if the telemetry is there
  if (getProp(model, "data.telemetry")) {
    return model;
  }

  const clone = cloneObject(model);
  clone.data.telemetry = {};

  return clone;
}
