import * as commonModule from "../../src";
import * as schemaModule from "../../src/sites";

describe("getDataForSiteItem", () => {
  it("gets the model and applies schema upgrades", async () => {
    const model = {
      verify: true,
    } as unknown as commonModule.IModel;

    const getModelSpy = spyOn(commonModule, "getModel").and.returnValue(
      Promise.resolve(model)
    );
    const schemaSpy = spyOn(schemaModule, "upgradeSiteSchema").and.callFake(
      (m: commonModule.IModel) => m
    );

    const res = await commonModule.getSiteById(
      "some-id",
      {} as commonModule.IHubRequestOptions
    );

    expect(res).toEqual(model);
    expect(getModelSpy).toHaveBeenCalledWith("some-id", {});
    expect(schemaSpy).toHaveBeenCalledWith(model);
  });
});
