/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

export * from "./add";
export * from "./fetch";
export * from "./groups";
export * from "./templates";
export * from "./update";
export * from "./util";
export * from "./activate";
export * from "./remove";
export * from "./detach-site";
// TODO: Move to module in ArcGIS-REST-JS
import geometryService from "./geometry";
export { geometryService };
