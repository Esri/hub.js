import * as restPortal from "@esri/arcgis-rest-portal";
import { getFormInfoJson } from "../../../src/surveys/utils/get-form-info-json";
import { mockUserSession } from "../../test-helpers/fake-user-session";
import { IRequestOptions } from "@esri/arcgis-rest-request";

describe("getFormInfoJson", () => {
  let getItemInfoSpy: jasmine.Spy;
  let requestOptions: IRequestOptions;

  beforeEach(() => {
    getItemInfoSpy = spyOn(restPortal, "getItemInfo").and.returnValue(
      Promise.resolve({ name: "my form" })
    );
    requestOptions = { authentication: mockUserSession };
  });

  it("calls getItemInfo with expected parameters", async () => {
    await getFormInfoJson("some id", requestOptions);
    expect(getItemInfoSpy).toHaveBeenCalledWith("some id", {
      fileName: "forminfo.json",
      readAs: "json",
      authentication: mockUserSession,
    });
  });
});
