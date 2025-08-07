import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IModel } from "../../hub-types";
import { migrateInvalidTimeline } from "../../utils/internal/migrateInvalidTimeline";
import { getProp } from "../../objects";

export const PROJECT_SCHEMA_VERSION = 1.1;

/**
 * Apply all Project model migrations
 * @param model
 * @param requestOptions
 * @returns
 */
export function applyProjectMigrations(
  model: IModel,
  _requestOptions: IRequestOptions
): Promise<IModel> {
  if (
    getProp(model, "item.properties.schemaVersion") === PROJECT_SCHEMA_VERSION
  ) {
    return Promise.resolve(model);
  } else {
    // Only apply the migrateInvalidTimeline migration for now
    model = migrateInvalidTimeline(model, PROJECT_SCHEMA_VERSION);
    return Promise.resolve(model);
  }
}
