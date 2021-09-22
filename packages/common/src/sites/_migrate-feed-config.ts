import { IModel, cloneObject } from "..";

/**
 * This migration accomplishes 2 things:
 * 1) Allows sites to store configurations for multiple feed formats (e.g. dcat-us-1.1, dcat-ap-2.0.1)
 * 2) If a site has an existing custom configuration for dcat-us 1.1, that configuration will be
 *    modified to use values from the v3 api instead of from the index
 *
 * @param {object} model Site Model
 * @private
 */
export function _migrateFeedConfig(model: IModel) {
  // if (getProp(model, "item.properties.schemaVersion") >= 1.3) return model;

  // const clone = cloneObject(model);
  // const groups = getProp(clone, "data.catalog.groups") || [];
  // clone.data.catalog.groups = groups.filter(isGuid);

  // clone.item.properties.schemaVersion = 1.3;
  // return clone;

  const clone = cloneObject(model);
  const oldDcatUS11Config = clone.data.values.dcatConfig;
  delete clone.data.values.dcatConfig;
  clone.data.feeds = {};
  if (oldDcatUS11Config) {
    clone.data.feeds.dcatUS11 = _migrateToV3Values(oldDcatUS11Config);
  }
  // TODO: DO WE STRIP WHITESPACE OR NOT?
  // TODO: DO WE NEED TO SUPPORT NUMBER KEYS? E.g. 0 vs '0'
  // TODO: SHOULD WE CORRECT BAD SYNTAX? E.g. {{default.description || No Description}}
  // OR {{item.licenseInfo}},{{metadata.metadata.dataIdInfo.idPoC.rpOrgName}},{{metadata.metadata.dataIdInfo.idPoC.rpCntInfo.cntAddress.eMailAdd}}
  // TODO: SHOULD WE STRIP :toISO / other helpers or should we add an entry in the hash??
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
  "{{item.categories}}": "{{categories}}", // TODO: This is a replacement. Is it valid?
  "{{item.licenseInfo}}": "{{licenseInfo}}",
  "{{item.modified}}": "{{modified}}",
  "{{metadata:optional:1}}": "{{metadata}}", // Is this a valid replacement?
  "{{enrichments.categories}}": "{{categories}}",
  "{{default.id}}": "{{id}}",
};

function _migrateToV3Values(indexConfig: any) {
  return Object.keys(indexConfig).reduce((v3Config, key) => {
    _helper(key, indexConfig, v3Config);
    return v3Config;
  }, {});
}

function _helper(key: string, indexConfigChunk: any, v3ConfigChunk: any) {
  const indexConfigValue = indexConfigChunk[key];
  if (typeof indexConfigValue === "string") {
    // oldValue is a literal
    v3ConfigChunk[key] =
      indexValueToV3Value[indexConfigValue] || indexConfigValue;
  } else {
    // oldValue is a nested object
    v3ConfigChunk[key] = {};
    Object.keys(indexConfigValue).forEach((nestedKey) =>
      _helper(nestedKey, indexConfigValue, v3ConfigChunk[key])
    );
  }
}
