import { IItem } from "@esri/arcgis-rest-portal";
import { getItemOrgId } from "../../../src/content/_internal/getItemOrgId";

describe("getItemOrgId", () => {
  it("returns itemId by default", () => {
    const user = { orgId: "userOrgId" };
    const item = { id: "itemId", orgId: "itemOrgId" } as unknown as IItem;
    expect(getItemOrgId(item, user)).toEqual("itemOrgId");
  });
  it("returns user.orgId if item.org is undefined", () => {
    const user = { orgId: "userOrgId" };
    const item = { id: "itemId" } as unknown as IItem;
    expect(getItemOrgId(item, user)).toEqual("userOrgId");
  });
  it("returns undefined if neither have orgId", () => {
    const user = { username: "dave" };
    const item = { id: "itemId" } as unknown as IItem;
    expect(getItemOrgId(item, user)).toBeUndefined();
  });
  it("returns undefined if neither have orgId and user is not passed", () => {
    const item = { id: "itemId" } as unknown as IItem;
    expect(getItemOrgId(item)).toBeUndefined();
  });
});
