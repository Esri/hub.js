import type { IGroup } from "@esri/arcgis-rest-portal";
import { isOpenDataGroup } from "../../src/groups/isOpenDataGroup";

describe("isOpenDataGroup: ", () => {
  it("returns true when group is OD", () => {
    const group = { isOpenData: true } as unknown as IGroup;
    expect(isOpenDataGroup(group)).toBe(true);
  });
  it("returns false when isOpenData is undefined", () => {
    const group = {} as unknown as IGroup;
    expect(isOpenDataGroup(group)).toBe(false);
  });
});
