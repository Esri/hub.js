import { IUser } from "@esri/arcgis-rest-portal";
import { getFeaturedContentCatalogs } from "../../../../src/core/schemas/internal/getFeaturedContentCatalogs";

describe("getFeaturedContentCatalogs:", () => {
  it("adds user into catalog", () => {
    const user: IUser = { username: "darth" } as unknown as IUser;
    const chk = getFeaturedContentCatalogs(user);
    expect(chk.catalogs.length).toBe(4);
    const myContent = chk.catalogs[0];
    expect(myContent.scopes.item.filters[0].predicates[0]).toEqual({
      owner: "darth",
    });
  });
});
