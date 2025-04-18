/* istanbul ignore file */
// in addition to it being a good practice to isolate dependencies
// this is needed so that we can spy on the functions below in tests :(

// add functions that need to be spied on here
// and then add wrapper functions below
import {
  getLayer as _getLayer,
  getService as _getService,
  queryFeatures as _queryFeatures,
  updateServiceDefinition as _updateServiceDefinition,
} from "@esri/arcgis-rest-feature-service";

// wrap functions that need to be spied on
/**
 * wrapper around @esri/arcgis-rest-feature-service's getLayer
 */
export function getLayer(
  ...args: Parameters<typeof _getLayer>
): ReturnType<typeof _getLayer> {
  return _getLayer(...args);
}

/**
 * wrapper around @esri/arcgis-rest-feature-service's getService
 */
export function getService(
  ...args: Parameters<typeof _getService>
): ReturnType<typeof _getService> {
  return _getService(...args);
}

/**
 * wrapper around @esri/arcgis-rest-feature-service's queryFeatures
 */
export function queryFeatures(
  ...args: Parameters<typeof _queryFeatures>
): ReturnType<typeof _queryFeatures> {
  return _queryFeatures(...args);
}

/**
 * wrapper around @esri/arcgis-rest-feature-service's updateServiceDefinition
 */
export function updateServiceDefinition(
  ...args: Parameters<typeof _updateServiceDefinition>
): ReturnType<typeof _updateServiceDefinition> {
  return _updateServiceDefinition(...args);
}
