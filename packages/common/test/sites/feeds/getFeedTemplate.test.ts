import * as legacyFeedsModule from "../../../src/sites/feed-configuration";
import { getFeedTemplate } from "../../../src/sites/feeds/getFeedTemplate";
import {
  FeedFormat,
  IFeedsConfiguration,
} from "../../../src/sites/feeds/types";
describe("getFeedTemplate", () => {
  let getFeedConfigurationSpy: jasmine.Spy;
  beforeEach(() => {
    getFeedConfigurationSpy = spyOn(legacyFeedsModule, "getFeedConfiguration");
  });
  it("delegates to getFeedConfiguration to get the configured template", () => {
    const feedsConfig: IFeedsConfiguration = {};
    const format: FeedFormat = "dcat-us";
    const version = "1.1";
    getFeedConfigurationSpy.and.returnValue({ foo: "bar" });
    const result = getFeedTemplate({ feedsConfig, format, version });
    expect(result).toEqual({ foo: "bar" });
    expect(getFeedConfigurationSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({ data: { feeds: feedsConfig } }),
      format,
      version
    );
  });
  it("gets the default template if no template is configured", () => {
    const feedsConfig: IFeedsConfiguration = {};
    const format: FeedFormat = "dcat-ap";
    const version = "2.1.1";
    getFeedConfigurationSpy.and.returnValue(undefined);
    const result = getFeedTemplate({ feedsConfig, format, version });
    expect(result).toEqual({
      "dct:title": "{{name}}",
      "dct:description": "{{description}}",
      "dcat:contactPoint": {
        "vcard:fn": "{{owner}}",
        "vcard:hasEmail": "{{orgContactEmail}}",
      },
    });
  });
});
