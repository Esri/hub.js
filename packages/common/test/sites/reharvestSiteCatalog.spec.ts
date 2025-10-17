import * as fetchMock from "fetch-mock";
import { MOCK_CONTEXT } from "../mocks/mock-auth";
import { reharvestSiteCatalog } from "../../src/sites/reharvestSiteCatalog";

describe("reharvestSiteCatalog", () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  afterEach(fetchMock.restore);

  it("correctly calls the reharvest endpoint", async () => {
    const url = `${MOCK_CONTEXT.hubUrl}/api/v3/jobs/site/some-site-id/harvest`;
    const expectedResults = {
      groups: [
        {
          groupId: "some-group-id",
          jobId: "some-job-id",
          status: 202,
        },
      ],
    };
    fetchMock.once(url, expectedResults);
    const actualResults = await reharvestSiteCatalog(
      "some-site-id",
      MOCK_CONTEXT
    );
    expect(actualResults).toEqual(expectedResults);
  });
  it("correctly returns error from the reharvest endpoint", async () => {
    const url = `${MOCK_CONTEXT.hubUrl}/api/v3/jobs/site/some-site-id/harvest`;
    const errorResponse = {
      message: "site has been harvested too recently",
      cause: "TIME_LOCK",
    };
    const expectedResponse = {
      error: errorResponse,
    };
    fetchMock.once(url, errorResponse);
    const actualResults = await reharvestSiteCatalog(
      "some-site-id",
      MOCK_CONTEXT
    );
    expect(actualResults).toEqual(expectedResponse);
  });
});
