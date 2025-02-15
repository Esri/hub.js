import {
  IDiscussionsRequestOptions,
  SharingAccess,
} from "../../../src/discussions/api/types";
import {
  searchChannels,
  searchChannelsV2,
} from "../../../src/discussions/api/channels";
import * as req from "../../../src/discussions/api/discussions-api-request";

describe("channels", () => {
  let requestSpy: any;
  let requestSpyV2: any;
  const response = new Response("ok", { status: 200 });
  const baseOpts: IDiscussionsRequestOptions = {
    hubApiUrl: "https://hub.arcgis.com/api",
    authentication: null,
  } as unknown as IDiscussionsRequestOptions;

  beforeEach(() => {
    requestSpy = spyOn(req, "discussionsApiRequest").and.returnValue(
      Promise.resolve(response)
    );
    requestSpyV2 = spyOn(req, "discussionsApiRequestV2").and.returnValue(
      Promise.resolve(response)
    );
  });

  it("searchChannels", (done) => {
    const query = {
      access: [SharingAccess.PUBLIC],
      groups: ["foo"],
    };

    const options = { ...baseOpts, data: query };
    searchChannels(options)
      .then(() => {
        expect(requestSpy.calls.count()).toEqual(1);
        const [url, opts] = requestSpy.calls.argsFor(0);
        expect(url).toEqual(`/channels`);
        expect(opts).toEqual({ ...options, httpMethod: "GET" });
        done();
      })
      .catch(() => fail());
  });

  it("searchChannelsV2", (done) => {
    const query = {
      access: [SharingAccess.PUBLIC],
      groups: ["foo"],
    };

    const options = { ...baseOpts, data: query };
    searchChannelsV2(options)
      .then(() => {
        expect(requestSpyV2.calls.count()).toEqual(1);
        const [url, opts] = requestSpyV2.calls.argsFor(0);
        expect(url).toEqual(`/channels`);
        expect(opts).toEqual({ ...options, httpMethod: "GET" });
        done();
      })
      .catch(() => fail());
  });
});
