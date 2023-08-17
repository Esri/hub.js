import { IModel } from "../types";
import { getProp } from "../objects";
import { SITE_SCHEMA_VERSION } from "./site-schema-version";
import { _applySiteSchema } from "./_internal/_apply-site-schema";
import { _enforceLowercaseDomains } from "./_internal/_enforce-lowercase-domains";
import { _ensureCatalog } from "./_internal/_ensure-catalog";
import { _purgeNonGuidsFromCatalog } from "./_internal/_purge-non-guids-from-catalog";
import { _ensureTelemetry } from "./_internal/_ensure-telemetry";
import { _migrateFeedConfig } from "./_internal/_migrate-feed-config";
import { _migrateEventListCardConfigs } from "./_internal/_migrate-event-list-card-configs";
import { _migrateSummaryStatCardConfigs } from "./_internal/_migrate-summary-stat-card-configs";

/**
 * Upgrades the schema upgrades
 * @param model IModel
 */
export function upgradeSiteSchema(model: IModel) {
  if (getProp(model, "item.properties.schemaVersion") === SITE_SCHEMA_VERSION) {
    return model;
  } else {
    // apply upgrade functions in order...
    model = _applySiteSchema(model);
    model = _enforceLowercaseDomains(model);
    model = _ensureCatalog(model);
    model = _purgeNonGuidsFromCatalog(model);
    model = _ensureTelemetry<IModel>(model);
    model = _migrateFeedConfig(model);
    model = _migrateEventListCardConfigs(model);
    model = _migrateSummaryStatCardConfigs(model);
    // WARNING - If you are writing a site schema migration,
    // you probably need to apply it to site drafts as well!
    // See https://github.com/Esri/hub.js/issues/498 for more details.
    return model;
  }
}
