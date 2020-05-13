import { unlinkPageFromSite } from "../src";
import { IHubRequestOptions } from "@esri/hub-common";

describe("unlinkPageFromSite", () => {
  it("throws deprecation error", async () => {
    expect(() =>
      unlinkPageFromSite("", "", {} as IHubRequestOptions)
    ).toThrowError();
  });
});
