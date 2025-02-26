import { computeProps } from "../../../src/templates/_internal/computeProps";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import { IHubTemplate } from "../../../src/core/types/IHubTemplate";
import { IModel } from "../../../src/hub-types";
import { initContextManager } from "../fixtures";
import * as computeLinksModule from "../../../src/templates/_internal/computeLinks";
import * as computeItemPropsModule from "../../../src/core/_internal/computeItemProps";
import * as processEntityFeaturesModule from "../../../src/permissions/_internal/processEntityFeatures";
import * as templateUtilsModule from "../../../src/templates/utils";

describe("templates: computeProps:", () => {
  let authdCtxMgr: ArcGISContextManager;
  let model: IModel;
  let template: Partial<IHubTemplate>;
  let computeLinksSpy: jasmine.Spy;
  let computeItemPropsSpy: jasmine.Spy;
  let processEntityFeaturesSpy: jasmine.Spy;
  let getDeployedTemplateTypeSpy: jasmine.Spy;

  beforeEach(async () => {
    authdCtxMgr = await initContextManager();
    computeLinksSpy = spyOn(computeLinksModule, "computeLinks").and.returnValue(
      { self: "some-link", thumbnail: "some-thumbnail-link" }
    );
    computeItemPropsSpy = spyOn(
      computeItemPropsModule,
      "computeItemProps"
    ).and.callFake((_item: any, _template: any) => {
      return { ..._template, isDiscussable: true };
    });
    processEntityFeaturesSpy = spyOn(
      processEntityFeaturesModule,
      "processEntityFeatures"
    ).and.returnValue({});
    getDeployedTemplateTypeSpy = spyOn(
      templateUtilsModule,
      "getDeployedTemplateType"
    ).and.returnValue("StoryMap");

    template = {
      type: "Solution",
      id: "00c",
    };
    model = {
      item: {
        type: "Solution",
        id: "00c",
        created: new Date().getTime(),
        modified: new Date().getTime(),
      },
      data: {},
    } as IModel;
  });

  it("links: computes a links hash", () => {
    const chk = computeProps(
      model,
      template,
      authdCtxMgr.context.requestOptions
    );
    expect(computeLinksSpy).toHaveBeenCalledTimes(1);
    expect(chk.links).toEqual({
      self: "some-link",
      thumbnail: "some-thumbnail-link",
    });
  });
  it("thumbnailUrl: appends the template's thumbnail url", () => {
    const chk = computeProps(
      model,
      template,
      authdCtxMgr.context.requestOptions
    );
    expect(computeLinksSpy).toHaveBeenCalledTimes(1);
    expect(chk.thumbnailUrl).toBe("some-thumbnail-link");
  });
  it("computeItemProps: determines whether the template is discussable", () => {
    const chk = computeProps(
      model,
      template,
      authdCtxMgr.context.requestOptions
    );
    expect(computeItemPropsSpy).toHaveBeenCalledTimes(1);
    expect(chk.isDiscussable).toBeTruthy();
  });
  it("features: processes entity-configurable features", () => {
    const chk = computeProps(
      model,
      template,
      authdCtxMgr.context.requestOptions
    );
    expect(processEntityFeaturesSpy).toHaveBeenCalledTimes(1);
    expect(chk.features).toEqual({});
  });
  it("isDeployed: computes whether the template has been deployed", () => {
    const chk = computeProps(
      model,
      template,
      authdCtxMgr.context.requestOptions
    );
    expect(chk.isDeployed).toBeFalsy();

    const chk2 = computeProps(
      { data: {}, item: { ...model.item, typeKeywords: ["Deployed"] } },
      template,
      authdCtxMgr.context.requestOptions
    );
    expect(chk2.isDeployed).toBeTruthy();
  });
  it("deployedType: computes the activated solution type", () => {
    const chk = computeProps(
      model,
      template,
      authdCtxMgr.context.requestOptions
    );
    expect(chk.deployedType).toBe("StoryMap");
  });
});
