/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
/* istanbul ignore file */

// DEPRECATED: this package will be deprecated
// it has currently includes only the functions that are still in use

// these are the only 2 functions used in opendata-ui
// and agoSearch is used in hub-indexer
// once we no longer use them there
export { agoSearch, serialize } from "./ago";

export * from "./types";

// utils are used by hub-indexer, but no where else
// we should move them either there or to hub-common
export * from "./util";
