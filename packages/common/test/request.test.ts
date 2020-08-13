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
  // NOTE: successful request cases are covered by tests
  // of functions in other packages that use hubRequest
});
