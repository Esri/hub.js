import * as fetchMock from "fetch-mock";
import { hubApiRequest } from "../src/request";

describe("hubApiRequest", () => {
  it("handles a server error", done => {
    const status = 403;
    const route = "badurl";
    fetchMock.once("*", {
      status
    });
    hubApiRequest(route).catch(e => {
      expect(e.message).toBe("Forbidden");
      expect(e.status).toBe(status);
      expect(e.url).toBe(`https://opendata.arcgis.com/api/v3/${route}`);
      done();
    });
  });
  it("stringfies params in the body of POST", done => {
    fetchMock.once("*", { the: "goods" });
    hubApiRequest("datasets", {
      isPortal: false,
      hubApiUrl: "https://some.url.com/",
      httpMethod: "POST",
      authentication: null,
      params: {
        foo: "bar"
      }
    }).then(response => {
      const [url, options] = fetchMock.calls()[0];
      expect(url).toEqual("https://some.url.com/api/v3/datasets");
      expect(options.body).toBe('{"foo":"bar"}');
      expect(response.the).toEqual("goods");
      done();
    });
  });
  // NOTE: additional request cases are covered by tests
  // of functions in other packages that use hubRequest
});
