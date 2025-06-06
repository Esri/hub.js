import { hasBasePriv } from "../../src/access/has-base-priv";
import type { IUser } from "@esri/arcgis-rest-portal";

describe("hasBasePriv", function () {
  it("returns true if user has portal:user:createItem privilege", function () {
    const result = hasBasePriv({
      privileges: ["portal:user:createItem"],
    } as IUser);
    expect(result).toBe(true);
  });

  it("returns false if user does not have portal:user:createItem privilege", function () {
    const result = hasBasePriv({} as IUser);
    expect(result).toBe(false);
  });
});
