import { IModel, cloneObject, getProp } from "..";

/**
 * Migrates the site so it can store configurations for multiple feed formats
 * (dcat-us-1.1, dcat-ap-2.0.1, etc.). If the site has an existing custom
 * configuration for dcat-us 1.1, that configuration will be modified to
 * use values from the v3 api instead of values from the index.
 *
 * @param {object} model Site Model
 * @private
 */
export function _migrateFeedConfig(model: IModel) {
  if (getProp(model, "item.properties.schemaVersion") >= 1.5) return model;

  const clone = cloneObject(model);
  const oldDcatUS11Config = clone.data.values.dcatConfig;
  clone.data.feeds = {};
  if (oldDcatUS11Config) {
    delete clone.data.values.dcatConfig;
    clone.data.feeds.dcatUS11 = _getMigratedObject(oldDcatUS11Config);
  }
  clone.item.properties.schemaVersion = 1.5;
  return clone;
}

/**
 * Recursive helper that migrates a (potentially nested) feed configuration
 * object. Properties with supported index values will be converted to
 * corresponding v3 api values.
 *
 * @param {object} originalObject object to migrate
 * @returns the migrated object
 * @private
 */
function _getMigratedObject(originalObject: any) {
  return Object.keys(originalObject).reduce((migratedObject, key) => {
    migratedObject[key] = _getMigratedProperty(originalObject, key);
    return migratedObject;
  }, {} as any);
}

/**
 * Recursive helper that migrates an individual property.
 *
 * if the original property value is an index value that we support for migration,
 * the corresponding v3 api value will be returned.
 *
 * If the original property value isn't an index value that we support for migration,
 * the original property value will be returned.
 *
 * If the property passed in is a nested object, the nested object will have it's
 * properties migrated.
 *
 * @param {object} originalObject object to migrate
 * @returns the migrated object
 * @private
 */
function _getMigratedProperty(originalObject: any, key: string): any {
  const originalProperty = originalObject[key];
  // originalProperty is a literal
  if (typeof originalProperty === "string") {
    return originalValueToMigratedValue[originalProperty] || originalProperty;
  }
  // originalProperty is a nested object
  return _getMigratedObject(originalProperty);
}

const originalValueToMigratedValue: any = {
  // Defaults
  "{{default.name}}": "{{name}}",
  "{{default.description}}": "{{description}}",
  "{{item.tags}}": "{{tags}}",
  "{{item.created:toISO}}": "{{created:toISO}}",
  "{{item.modified:toISO}}": "{{modified:toISO}}",
  "{{default.source.source}}": "{{source}}",
  "{{item.owner}}": "{{owner}}",
  "{{org.portalProperties.links.contactUs.url}}": "{{orgContactEmail}}",

  // Custom Values
  "{{org.name}}": "{{orgName}}",
  "{{item.categories}}": "{{categories}}", // TODO: This is a replacement. Is it valid?
  "{{item.licenseInfo}}": "{{licenseInfo}}",
  "{{item.modified}}": "{{modified}}",
  "{{enrichments.categories}}": "{{categories}}",
  "{{default.id}}": "{{id}}",
};
