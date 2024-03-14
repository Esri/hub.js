import { IArcGISContext } from "../../../src/ArcGISContext";
import { getS123EditUrl } from "../../../src/surveys/utils/get-s123-edit-url";

describe("getS123ShareUrl", () => {
  it("gets url", () => {
    const context = {
      survey123Url: "survey-url",
      portalUrl: "portal-url",
    } as any as IArcGISContext;
    const result = getS123EditUrl("survey-id", context);
    expect(result).toEqual("survey-url/surveys/survey-id?portalUrl=portal-url");
  });
});
