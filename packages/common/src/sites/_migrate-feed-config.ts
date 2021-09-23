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
    clone.data.feeds.dcatUS11 = _migrateToV3Values(oldDcatUS11Config);
  }
  clone.item.properties.schemaVersion = 1.5;
  return clone;
}

const indexValueToV3Value: any = {
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
  "{{item.categories}}": "{{categories}}",
  "{{item.licenseInfo}}": "{{licenseInfo}}",
  "{{item.modified}}": "{{modified}}",
  "{{enrichments.categories}}": "{{categories}}",
  "{{default.id}}": "{{id}}",
  "{{item.licenseInfo || No License}}": "{{licenseInfo || No License}}",
  "{{item.licenseInfo}},{{metadata.metadata.dataIdInfo.idPoC.rpOrgName}},{{metadata.metadata.dataIdInfo.idPoC.rpCntInfo.cntAddress.eMailAdd}}":
    "{{licenseInfo}},{{metadata.metadata.dataIdInfo.idPoC.rpOrgName}},{{metadata.metadata.dataIdInfo.idPoC.rpCntInfo.cntAddress.eMailAdd}}",
  "{{org.portalProperties.links.contactUs.url || mailto:data@tempe.gov}}":
    "{{orgContactEmail || mailto:data@tempe.gov}}",
  "{{default.description || No Description}}":
    "{{description || No Description}}",
  "{{item.id}}": "{{id}}",
};

function _migrateToV3Values(originalConfig: any) {
  let migratedConfigString = JSON.stringify(originalConfig);
  const supportedIndexValues = Object.keys(indexValueToV3Value);
  supportedIndexValues.forEach((indexValue) => {
    // Replace all occurrences of indexValue with the corresponding v3Value
    const v3Value = indexValueToV3Value[indexValue];
    migratedConfigString = migratedConfigString.split(indexValue).join(v3Value);
  });
  return JSON.parse(migratedConfigString);
}
