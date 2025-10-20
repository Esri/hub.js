import { IHubRequestOptions } from "../../src/hub-types";
import { _addTokenToResourceUrl } from "../../src/resources/_add-token-to-resource-url";

describe("_addTokenToResourceUrl", () => {
  const ro = {
    authentication: { token: "new-token", portal: "foo-bar-baz" },
  } as unknown as IHubRequestOptions;

  it("adds a token", () => {
    const url = "https://foo-bar-baz.com/";

    const result = _addTokenToResourceUrl(url, ro);
    expect(result).toBe(`${url}?token=new-token`);
  });

  it("skips when portal doesnt match", () => {
    const url = "https://some-other-portal.com/";

    const result = _addTokenToResourceUrl(url, ro);
    expect(result).toBe(url);
  });

  it("skips when already has token", () => {
    const url = "https://foo-bar-baz.com/?token=hehe";

    const result = _addTokenToResourceUrl(url, ro);
    expect(result).toBe(url);
  });
});
