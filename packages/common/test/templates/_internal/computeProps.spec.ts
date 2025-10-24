import { computeProps } from "../../../src/templates/_internal/computeProps";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import { IHubTemplate } from "../../../src/core/types/IHubTemplate";
import { IModel } from "../../../src/hub-types";
import { initContextManager } from "../fixtures";
import * as computeLinksModule from "../../../src/templates/_internal/computeLinks";
import * as computeItemPropsModule from "../../../src/core/_internal/computeItemProps";
import * as processEntityFeaturesModule from "../../../src/permissions/_internal/processEntityFeatures";
import * as templateUtilsModule from "../../../src/templates/utils";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
describe("templates: computeProps:", () => {
  let authdCtxMgr: Partial<ArcGISContextManager>;
  let model: IModel;
  let template: Partial<IHubTemplate>;
  let computeLinksSpy: any;
  let computeItemPropsSpy: any;
  let processEntityFeaturesSpy: any;
  beforeEach(() => {
    // initContextManager returns a Partial in our fixtures
    authdCtxMgr = initContextManager();

    computeLinksSpy = vi
      .spyOn(computeLinksModule, "computeLinks")
      .mockReturnValue({ self: "some-link", thumbnail: "some-thumbnail-link" });

    computeItemPropsSpy = vi
      .spyOn(computeItemPropsModule, "computeItemProps")
      .mockImplementation(
        (
          _item: any,
          _template: Partial<IHubTemplate>
        ): Partial<IHubTemplate> => {
          return {
            ...(_template || {}),
            isDiscussable: true,
          } as Partial<IHubTemplate>;
        }
      );

    processEntityFeaturesSpy = vi
      .spyOn(processEntityFeaturesModule, "processEntityFeatures")
      .mockReturnValue({});

    // no local variable needed for the spy; just install it
    vi.spyOn(templateUtilsModule, "getDeployedTemplateType").mockReturnValue(
      "StoryMap"
    );

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

  afterEach(() => {
    vi.restoreAllMocks();
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
