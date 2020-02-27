/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { getProp } from "@esri/hub-common";
import { IInitiativeModel } from "@esri/hub-common";
import { applyInitialSchema } from "./migrations/apply-schema";
import { upgradeToOneDotOne } from "./migrations/upgrade-one-dot-one";
import { upgradeToTwoDotZero } from "./migrations/upgrade-two-dot-zero";
import { upgradeToTwoDotOne } from "./migrations/upgrade-two-dot-one";
import { upgradeToTwoDotTwo } from "./migrations/upgrade-two-dot-two";

/**
 * Current Schema Version
 * @protected
 */
export const CURRENT_SCHEMA_VERSION = 2.1;

/**
 * Handle Initiative Schema Migrations.
 * If the model is on the current schema, the model object is returned.
 * If a schema migration is applied, a new object will be returned.
 *
 * @export
 * @param {IInitiativeModelFoo} model
 * @param {string} portalUrl
 * @returns {IInitiativeModel}
 */
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
    model = upgradeToTwoDotOne(model);
    model = upgradeToTwoDotTwo(model);
    // etc
    return model;
  }
}
