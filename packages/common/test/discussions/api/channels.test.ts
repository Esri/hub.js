import {
  IDiscussionsRequestOptions,
  SharingAccess,
} from "../../../src/discussions/api/types";
import { searchChannels } from "../../../src/discussions/api/channels";
import * as req from "../../../src/discussions/api/request";

describe("channels", () => {
  let requestSpy: any;
  const response = new Response("ok", { status: 200 });
  const baseOpts: IDiscussionsRequestOptions = {
    hubApiUrl: "https://hub.arcgis.com/api",
    authentication: null,
  } as unknown as IDiscussionsRequestOptions;

  beforeEach(() => {
    requestSpy = spyOn(req, "request").and.returnValue(
      Promise.resolve(response)
    );
  });

  it("queries channels", (done) => {
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
});
