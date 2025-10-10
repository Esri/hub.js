import { interpolate, cloneObject } from "@esri/hub-common";

/**
 * Wrapper for @esri/hub-common's `interpolate()`
 *
 * Some properties on siteTemplate are nested adlib templates that
 * need to be interpolated at runtime, not template activation time.
 * As such, this wrapper ensures that adlib does not process those
 * properties.
 *
 * Currently ignored properties include:
 * - `data.values.dcatConfig` (legacy DCAT-US 1.1 config with index value paths)
 * - `data.feeds (Home to all feed configs with v3 api value paths)
 *
 * @param siteTemplate
 * @param settings
 * @param transforms
 */
export function interpolateSite(
  siteTemplate: any,
  settings: any,
  transforms?: any
) {
  const template = cloneObject(siteTemplate);

  // Save nested adlib templates
  const legacyDcatUS11Config = cloneObject(template.data.values.dcatConfig);
  const feedConfigs = cloneObject(template.data.feeds);

  // Remove nested adlib templates from the main template so they will not be processed
  delete template.data.values.dcatConfig;
  delete template.data.feeds;

  const siteModel = interpolate(template, settings, transforms);

  // Attach nested templates onto the interpolated site
  if (legacyDcatUS11Config) {
    siteModel.data.values.dcatConfig = legacyDcatUS11Config;
  }
  if (feedConfigs) {
    siteModel.data.feeds = feedConfigs;
  }

  return siteModel;
}
