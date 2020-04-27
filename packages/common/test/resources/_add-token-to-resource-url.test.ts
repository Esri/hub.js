import { _addTokenToResourceUrl, IHubRequestOptions } from "../../src";

describe("_addTokenToResourceUrl", function() {
  const ro = ({
    authentication: { token: "new-token", portal: "foo-bar-baz" }
  } as unknown) as IHubRequestOptions;

  it("adds a token", function() {
    const url = "https://foo-bar-baz.com/";

    const result = _addTokenToResourceUrl(url, ro);
    expect(result).toBe(`${url}?token=new-token`, "Added token");
  });

  it("skips when portal doesnt match", function() {
    const url = "https://some-other-portal.com/";

    const result = _addTokenToResourceUrl(url, ro);
    expect(result).toBe(url, "left the url alone");
  });

  it("skips when already has token", function() {
    const url = "https://foo-bar-baz.com/?token=hehe";

    const result = _addTokenToResourceUrl(url, ro);
    expect(result).toBe(url, "left the url alone");
  });
});
