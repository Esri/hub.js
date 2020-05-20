import { siteSecondPass } from "../src";
import * as shareItemsModule from "../src/_share-items-to-site-groups";
import * as updatePagesModule from "../src/_update-pages";
import { IModel, IHubRequestOptions, IModelTemplate } from "@esri/hub-common";
import { expectAllCalled } from "./test-helpers.test";

describe("siteSecondPass", () => {
  it("calls the correct functions", async () => {
    const shareSpy = spyOn(
      shareItemsModule,
      "_shareItemsToSiteGroups"
    ).and.returnValue(Promise.resolve({}));
    const updateSpy = spyOn(updatePagesModule, "_updatePages").and.returnValue(
      Promise.resolve({})
    );

    const siteModel = {} as IModel;
    const solutionModels = [siteModel, {}, {}] as IModelTemplate[];
    const ro = {} as IHubRequestOptions;

    const res = await siteSecondPass(siteModel, solutionModels, ro);

    expect(res.length).toBe(2);
    expectAllCalled([shareSpy, updateSpy], expect);
  });
});
