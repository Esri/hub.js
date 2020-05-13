import { linkPageToSite } from "../src";
import { IHubRequestOptions } from "@esri/hub-common";

describe("linkPageToSite", () => {
  it("throws deprecation error", async () => {
    expect(() => linkPageToSite({}, {} as IHubRequestOptions)).toThrowError();
  });
});
