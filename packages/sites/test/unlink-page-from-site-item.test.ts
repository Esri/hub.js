import { unlinkPageFromSiteItem } from "../src";
import { IModel, IHubRequestOptions } from "@esri/hub-common";

describe("unlinkPageFromSiteItem", () => {
  it("throws deprecation error", async () => {
    expect(() =>
      unlinkPageFromSiteItem("", {} as IModel, {} as IHubRequestOptions)
    ).toThrowError();
  });
});
