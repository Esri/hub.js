import * as restPortal from "@esri/arcgis-rest-portal";
import * as getFormInfoJsonUtil from "../../../src/surveys/utils/get-form-info-json";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { mockUserSession } from "../../test-helpers/fake-user-session";
import { getFormJson } from "../../../src/surveys/utils/get-form-json";

describe("getFormJson", () => {
  let requestOptions: IRequestOptions;

  beforeEach(() => {
    spyOn(getFormInfoJsonUtil, "getFormInfoJson").and.callFake(() => {
      return Promise.resolve({ name: "my form" });
    });
    requestOptions = { authentication: mockUserSession };
  });

  it("get form json", async () => {
    spyOn(restPortal, "getItemInfo").and.returnValue(
      Promise.resolve({ questions: [{ description: "hello%20world" }] })
    );
    const survey = { id: "3ef" } as any as restPortal.IItem;
    const result = await getFormJson(survey, requestOptions);
    expect(result).toEqual({ questions: [{ description: "hello world" }] });
  });

  it("get form json when created by survey123", async () => {
    spyOn(restPortal, "getItemInfo").and.returnValue(
      Promise.resolve({ questions: [{ description: "hello%20world" }] })
    );
    const survey = {
      id: "3ef",
      typeKeywords: ["Survey123 Connect"],
    } as any as restPortal.IItem;
    const result = await getFormJson(survey, requestOptions);
    expect(result).toEqual({
      settings: {
        openStatusInfo: {
          status: "open",
          schedule: { end: null, status: null },
        },
        multiSubmissionInfo: { maxAllowed: 0 },
      },
      questions: [],
    });
  });

  it("handle when form is null", async () => {
    spyOn(restPortal, "getItemInfo").and.returnValues(Promise.resolve(null));
    const survey = { id: "3ef" } as any as restPortal.IItem;
    const result = await getFormJson(survey, requestOptions);
    expect(result).toEqual(null);
  });
});
