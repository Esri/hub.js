import * as fetchMock from "fetch-mock";
import { hubRequest } from "../src/request";

describe("hubRequest", () => {
  it("handles a server error", done => {
    const status = 403;
    const url = "badurl";
    fetchMock.once("*", {
      status
    });
    hubRequest(url).catch(e => {
      expect(e.message).toBe("Forbidden");
      expect(e.status).toBe(status);
      expect(e.url).toBe(url);
      done();
    });
  });
  // NOTE: successful request cases are covered by tests
  // of functions in other packages that use hubRequest
});
