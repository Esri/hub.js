/* istanbul ignore file - these are just wrappers around rest-js functions -- @preserve */
// import functions that need to be wrapped and/or spied on
import {
  commitItemUpload as _commitItemUpload,
  createItem as _createItem,
  updateItem as _updateItem,
} from "@esri/arcgis-rest-portal";
import { serializeItemParams } from "./_internal/helpers";

// implement wrappers
/**
 * wrapper around @esri/arcgis-rest-portal's createItem
 * NOTE: this preserves 3.x behavior for saving item data
 * @param args
 * @returns
 */
export function createItem(
  ...args: Parameters<typeof _createItem>
): ReturnType<typeof _createItem> {
  return _createItem(serializeItemParams(args[0]));
}

/**
 * wrapper around @esri/arcgis-rest-portal's updateItem
 * NOTE: this preserves 3.x behavior for saving item data
 * @param args
 * @returns
 */
export function updateItem(
  ...args: Parameters<typeof _updateItem>
): ReturnType<typeof _updateItem> {
  return _updateItem(serializeItemParams(args[0]));
}

/**
 * wrapper around @esri/arcgis-rest-portal's commitItemUpload
 * NOTE: this preserves 3.x behavior for saving item data
 * @param args
 * @returns
 */
export function commitItemUpload(
  ...args: Parameters<typeof _commitItemUpload>
): ReturnType<typeof _commitItemUpload> {
  return _commitItemUpload(serializeItemParams(args[0]));
}
