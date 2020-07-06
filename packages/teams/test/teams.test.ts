import { comingSoon } from "../src/index";
import * as fetchMock from "fetch-mock";

describe("what's currently here, which aint much", () => {
  afterEach(fetchMock.restore);
  it("should make an item request w/o fetching data", done => {
    fetchMock.once("*", { the: "goods" });
    comingSoon()
      .then(response => {
        const [url, options] = fetchMock.calls()[0];
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
        expect(options.body).toContain("f=json");
        expect(response.the).toEqual("goods");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });
});
