import { helloHub } from "../src/index";
import * as fetchMock from "fetch-mock";

describe("request()", () => {
  afterEach(fetchMock.restore);

  it("should make a basic POST request", done => {
    fetchMock.once("*", {
      currentVersion: 10.6,
      folders: [],
      services: []
    });

    helloHub()
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(options.body).toContain("f=json");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });
});
