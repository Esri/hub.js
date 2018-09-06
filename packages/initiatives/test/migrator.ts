/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { IInitiativeModel, cloneObject } from "@esri/hub-common";
import { migrateSchema, CURRENT_SCHEMA_VERSION } from "../src/migrator";

describe("Initiative Schema Migration", () => {
  it("should not upgrade if on current version", done => {
    const m = {
      item: {
        properties: {
          schemaVersion: CURRENT_SCHEMA_VERSION
        }
      },
      data: {}
    } as IInitiativeModel;
    const chk = migrateSchema(m, "https://some.portal.com/arcgis/rest");
    expect(chk).toBe(m, "should return the same object");
    done();
  });
});
