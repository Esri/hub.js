import { IArcGISContext } from "../../../src/ArcGISContext";
import { getS123ShareUrl } from "../../../src/surveys/utils/get-s123-share-url";

describe("getS123ShareUrl", () => {
  it("gets url", () => {
    const context = {
      survey123Url: "survey-url",
      portalUrl: "portal-url",
    } as any as IArcGISContext;
    const result = getS123ShareUrl("survey-id", context);
    expect(result).toEqual("survey-url/share/survey-id?portalUrl=portal-url");
  });
});
