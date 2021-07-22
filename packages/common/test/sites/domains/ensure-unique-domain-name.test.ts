import { ensureUniqueDomainName, IHubRequestOptions } from "../../../src";
import * as fetchMock from "fetch-mock";
import { UserSession } from "@esri/arcgis-rest-auth";

describe("ensureUniqueDomainName", () => {
  // it("ensureUniqueDomainName for AGO", async function() {
  //   // return a 200 for the default domain, forcing it to increment
  //   fetchMock.once("glob:*/domains/foo-org*", {
  //     status: 200,
  //     body: JSON.stringify({ id: 12, siteId: "3ef" })
  //   });
  //   // return 404 so it will
  //   fetchMock.once("glob:*/domains/foo-1-org*", {
  //     status: 404,
  //     body: JSON.stringify({
  //       error: {
  //         title: "Domain record not found",
  //         detail: "The domain record with the id zoidberg.io does not exist",
  //         status: 404
  //       }
  //     })
  //   });
  //   const chkAGO = await ensureUniqueDomainName("foo", MOCK_HUB_REQOPTS);
  //   expect(fetchMock.called()).toBeTruthy("fetch should be intercepted");
  //   expect(chkAGO).toBe("foo-1", "should increment");
  // });
  // it("ensureUniqueDomainName for Portal", async function() {
  //   fetchMock.once("glob:*/search*", { results: [] });
  //   const chkPortal = await ensureUniqueDomainName("foo", {} as IHubRequestOptions);
  //   expect(fetchMock.called()).toBeTruthy("fetch should be intercepted");
  //   expect(chkPortal).toBe("foo", "should return unique value");
  // });
});
