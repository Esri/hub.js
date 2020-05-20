import { _fetchAndConvertInitiativeToTemplate } from "../src";
import * as convertInitiativeToTemplateModule from "../src/convert-initiative-to-template";
import * as getDefaultInitiativeTemplateModule from "../src/get-default-initiative-template";
import * as getInitiativeModule from "../src/get";
import { IHubRequestOptions } from "@esri/hub-common";

describe("_fetchAndConvertInitiativeToTemplate", () => {
  let convertSpy: jasmine.Spy;
  let getDefaultSpy: jasmine.Spy;
  let getInitiativeSpy: jasmine.Spy;
  beforeEach(() => {
    convertSpy = spyOn(
      convertInitiativeToTemplateModule,
      "convertInitiativeToTemplate"
    ).and.returnValue(Promise.resolve());

    getDefaultSpy = spyOn(
      getDefaultInitiativeTemplateModule,
      "getDefaultInitiativeTemplate"
    ).and.returnValue(Promise.resolve());

    getInitiativeSpy = spyOn(
      getInitiativeModule,
      "getInitiative"
    ).and.returnValue(Promise.resolve({ id: "123" }));
  });

  it("calls convert when fetch successful", async () => {
    await _fetchAndConvertInitiativeToTemplate("123", {} as IHubRequestOptions);

    expect(convertSpy).toHaveBeenCalledWith({ id: "123" }, {});
    expect(getDefaultSpy).not.toHaveBeenCalled();
  });

  it("calls convert when fetch unsuccessful", async () => {
    getInitiativeSpy.and.returnValue(Promise.reject());

    await _fetchAndConvertInitiativeToTemplate("123", {} as IHubRequestOptions);

    expect(convertSpy).not.toHaveBeenCalled();
    expect(getDefaultSpy).toHaveBeenCalledWith({});
  });
});
