import { getInitiativeTemplate } from "../src";
import * as defaultTemplateModule from "../src/get-default-initiative-template";
import { IModelTemplate, IHubRequestOptions } from "@esri/hub-common";

describe("getInitiativeTemplate", () => {
  it("returns template when found in properties", async () => {
    const siteTemplate = ({
      item: {},
      data: {},
      properties: {
        initiativeTemplate: { from: "model" }
      }
    } as unknown) as IModelTemplate;

    const getSpy = spyOn(
      defaultTemplateModule,
      "getDefaultInitiativeTemplate"
    ).and.returnValue(Promise.resolve({ from: "api" }));

    const res = await getInitiativeTemplate(
      siteTemplate,
      {} as IHubRequestOptions
    );

    expect(res.from).toBe("model", "got template off site template");
    expect(getSpy).not.toHaveBeenCalled();
  });

  it("fetches default template when not found in properties", async () => {
    const siteTemplate = ({
      item: {},
      data: {},
      properties: {}
    } as unknown) as IModelTemplate;

    const getSpy = spyOn(
      defaultTemplateModule,
      "getDefaultInitiativeTemplate"
    ).and.returnValue(Promise.resolve({ from: "api" }));

    const res = await getInitiativeTemplate(
      siteTemplate,
      {} as IHubRequestOptions
    );

    expect(res.from).toBe("api", "got template from api");
    expect(getSpy).toHaveBeenCalled();
  });
});
