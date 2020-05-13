import { linkPageToSiteItem } from "../src";
import { IModel, IHubRequestOptions } from "@esri/hub-common";

describe("linkPageToSiteItem", () => {
  it("throws deprecation error", async () => {
    expect(() =>
      linkPageToSiteItem({} as IModel, "", {} as IHubRequestOptions)
    ).toThrowError();
  });
});
