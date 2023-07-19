import * as req from "../src/request";
import {
  createDiscussionSetting,
  fetchDiscussionSetting,
  removeDiscussionSetting,
} from "../src/discussion-settings";
import {
  DiscussionSettingType,
  ICreateDiscussionSetting,
  ICreateDiscussionSettingParams,
  IDiscussionsRequestOptions,
  IRemoveDiscussionSettingParams,
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

  it("createDiscussionSetting", async () => {
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

  it("fetchDiscussionSetting", async () => {
    const id = "uuidv4";
    const options: IRemoveDiscussionSettingParams = { ...baseOpts, id };

    await fetchDiscussionSetting(options);

    expect(requestSpy.calls.count()).toEqual(1);
    const [url, opts] = requestSpy.calls.argsFor(0);
    expect(url).toEqual(`/discussion_settings/${id}`);
    expect(opts).toEqual({ ...options, httpMethod: "GET" });
  });

  it("removeDiscussionSetting", async () => {
    const id = "uuidv4";
    const options: IRemoveDiscussionSettingParams = { ...baseOpts, id };

    await removeDiscussionSetting(options);

    expect(requestSpy.calls.count()).toEqual(1);
    const [url, opts] = requestSpy.calls.argsFor(0);
    expect(url).toEqual(`/discussion_settings/${id}`);
    expect(opts).toEqual({ ...options, httpMethod: "DELETE" });
  });
});
