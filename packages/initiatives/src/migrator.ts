/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { getProp, cloneObject } from "@esri/hub-common";
import { IInitiativeModel, IInitiativeItem } from "@esri/hub-common";
import { applyInitialSchema } from "./migrations/apply-schema";
import { upgradeToOneDotOne } from "./migrations/upgrade-one-dot-one";
import { upgradeToTwoDotZero } from "./migrations/upgrade-two-dot-zero";

/**
 * Current Schema Version
 */
export const CURRENT_SCHEMA_VERSION = 2;

export function migrateSchema(
  model: IInitiativeModel,
  portalUrl: string
): IInitiativeModel {
  // if the model is not on the current schema, we apply all of them
  // the individual migrations will early-exit if the item version
  // is at or above the migration
  if (
    getProp(model, "item.properties.schemaVersion") === CURRENT_SCHEMA_VERSION
  ) {
    return model;
  } else {
    // apply upgrade functions in order...
    model = applyInitialSchema(model, portalUrl);
    model = upgradeToOneDotOne(model, portalUrl);
    model = upgradeToTwoDotZero(model, portalUrl);
    // model = this._upgradeToTwoDotZero(model);
    // etc
    return model;
  }
}
