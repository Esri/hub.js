import * as fetchMock from "fetch-mock";
import { hubApiRequest } from "../src/request";

describe("hubApiRequest", () => {
  afterEach(() => {
    fetchMock.restore();
  });
  it("handles a server error", (done) => {
    const status = 403;
    const route = "badurl";
    fetchMock.once("*", {
      status,
    });
    hubApiRequest(route).catch((e) => {
      const error = e as { message?: string; status?: number; url?: string };
      expect(error.message).toBe("Forbidden");
      expect(error.status).toBe(status);
      expect(error.url).toBe(`https://hub.arcgis.com/api/v3/${route}`);
      done();
    });
  });
  it("stringfies params in the body of POST", async () => {
    fetchMock.once("*", { the: "goods" });
    const response = await hubApiRequest("datasets", {
      isPortal: false,
      hubApiUrl: "https://some.url.com/",
      httpMethod: "POST",
      authentication: null,
      params: {
        foo: "bar",
      },
    });
    const [url, options] = fetchMock.calls()[0];
    expect(url).toEqual("https://some.url.com/api/v3/datasets");
    expect(options.body).toBe('{"foo":"bar"}');
    expect(response.the).toEqual("goods");
  });
  // NOTE: additional request cases are covered by tests
  // of functions in other packages that use hubRequest
});
