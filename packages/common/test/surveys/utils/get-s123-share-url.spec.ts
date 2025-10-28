import { IArcGISContext } from "../../../src/types/IArcGISContext";
import { getS123ShareUrl } from "../../../src/surveys/utils/get-s123-share-url";
import { describe, it, expect } from "vitest";

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
