import * as req from "../src/request";
import { createDiscussionSetting } from "../src/discussion-settings";
import {
  DiscussionSettingType,
  ICreateDiscussionSetting,
  ICreateDiscussionSettingParams,
  IDiscussionsRequestOptions,
} from "../src/types";

describe("discussion-settings", () => {
  let requestSpy: any;
  const response = new Response("ok", { status: 200 });
  const baseOpts: IDiscussionsRequestOptions = {
    hubApiUrl: "https://hub.arcgis.com/api",
    authentication: undefined,
  };

  beforeEach(() => {
    requestSpy = spyOn(req, "request").and.returnValue(
      Promise.resolve(response)
    );
  });

  it("creates a discussionSetting", async () => {
    const body: ICreateDiscussionSetting = {
      id: "uuidv4",
      type: DiscussionSettingType.CONTENT,
      settings: {
        allowedChannelIds: ["aaa"],
      },
    };
    const options: ICreateDiscussionSettingParams = { ...baseOpts, data: body };

    await createDiscussionSetting(options);

    expect(requestSpy.calls.count()).toEqual(1);
    const [url, opts] = requestSpy.calls.argsFor(0);
    expect(url).toEqual(`/discussion_settings`);
    expect(opts).toEqual({ ...options, httpMethod: "POST" });
  });
});
