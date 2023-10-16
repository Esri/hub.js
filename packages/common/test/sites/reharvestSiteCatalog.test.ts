import * as fetchMock from "fetch-mock";
import { MOCK_CONTEXT } from "../mocks/mock-auth";
import { reharvestSiteCatalog } from "../../src/sites/reharvestSiteCatalog";

describe("reharvestSiteCatalog", () => {
  it("correctly calls the reharvest endpoint", async () => {
    const url = `${MOCK_CONTEXT.hubUrl}/api/v3/jobs/site/some-site-id/harvest`;
    const expectedResults = [
      {
        groupId: "some-group-id",
        jobId: "some-job-id",
        status: 202,
      },
    ];
    fetchMock.once(url, expectedResults);
    const actualResults = await reharvestSiteCatalog(
      "some-site-id",
      MOCK_CONTEXT
    );
    expect(actualResults).toEqual(expectedResults);
  });
});
