import { UserSession } from "@esri/arcgis-rest-auth";
import * as fetchMock from "fetch-mock";
import { DatasetResource, fetchDatasets } from "../../src";

describe("fetchDatasets", function () {
  const response = {
    data: [] as DatasetResource[],
  };
  // TODO: is this needed?
  afterEach(fetchMock.restore);
  it("POSTs to the correct URL and serializes authentication", async function () {
    const authentication = new UserSession({
      username: "tom",
      password: "notreal",
    });
    fetchMock.once("*", response);
    await fetchDatasets({
      authentication,
    });
    const [url, options] = fetchMock.lastCall();
    expect(url).toBe("https://hub.arcgis.com/api/v3/search");
    // ts will throw errors if you try to access headers w/o casting to any
    const headers = options.headers as any;
    expect(headers.authentication).toBe(authentication.serialize());
  });
});
