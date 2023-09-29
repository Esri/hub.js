import { computeProps } from "../../../src/templates/_internal/computeProps";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import { mergeObjects } from "../../../src/objects";
import { IHubTemplate } from "../../../src/core/types/IHubTemplate";
import { IModel } from "../../../src/types";
import { IUser } from "@esri/arcgis-rest-types";
import { IPortal } from "@esri/arcgis-rest-portal";
import * as computeLinksModule from "../../../src/templates/_internal/computeLinks";
import * as isDiscussableModule from "../../../src/discussions/utils";
import * as processEntityFeaturesModule from "../../../src/permissions/_internal/processEntityFeatures";

describe("templates: computeProps:", () => {
  let authdCtxMgr: ArcGISContextManager;
  let model: IModel;
  let template: Partial<IHubTemplate>;
  let computeLinksSpy;
  let isDiscussableSpy;
  let processEntityFeaturesSpy;

  beforeEach(async () => {
    authdCtxMgr = await initContextManager();
    computeLinksSpy = spyOn(computeLinksModule, "computeLinks").and.returnValue(
      { self: "some-link", thumbnail: "some-thumbnail-link" }
    );
    isDiscussableSpy = spyOn(
      isDiscussableModule,
      "isDiscussable"
    ).and.returnValue(true);
    processEntityFeaturesSpy = spyOn(
      processEntityFeaturesModule,
      "processEntityFeatures"
    ).and.returnValue({});

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
  it("isDiscussable: determines whether the template is discussable", () => {
    const chk = computeProps(
      model,
      template,
      authdCtxMgr.context.requestOptions
    );
    expect(isDiscussableSpy).toHaveBeenCalledTimes(1);
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
});

const initContextManager = async (opts = {}) => {
  const defaults = {
    authentication: MOCK_AUTH,
    currentUser: {
      username: "casey",
      privileges: ["portal:user:shareToGroup"],
    } as unknown as IUser,
    portal: {
      name: "DC R&D Center",
      id: "BRXFAKE",
      urlKey: "fake-org",
    } as unknown as IPortal,
    portalUrl: "https://myserver.com",
  };
  return await ArcGISContextManager.create(
    mergeObjects(opts, defaults, ["currentUser"])
  );
};
