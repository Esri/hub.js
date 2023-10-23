import { HubEntityType } from "../../../src";
import * as req from "../../../src/discussions/api/request";
import {
  createSetting,
  fetchSetting,
  getDefaultEntitySettings,
  removeSetting,
  updateSetting,
} from "../../../src/discussions/api/settings";
import {
  EntitySettingType,
  ICreateSetting,
  ICreateSettingParams,
  IDiscussionsRequestOptions,
  IRemoveSettingParams,
  IUpdateSetting,
  IUpdateSettingParams,
  IFetchSettingParams,
} from "../../../src/discussions/api/types";

describe("settings", () => {
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

  it("createSetting", async () => {
    const body: ICreateSetting = {
      id: "uuidv4",
      type: EntitySettingType.CONTENT,
      settings: {
        discussions: {
          allowedChannelIds: ["aaa"],
          allowedLocations: [
            {
              type: "Point",
              coordinates: [-101.25, 37.996162679728116],
            },
          ],
        },
      },
    };
    const options: ICreateSettingParams = { ...baseOpts, data: body };

    await createSetting(options);

    expect(requestSpy.calls.count()).toEqual(1);
    const [url, opts] = requestSpy.calls.argsFor(0);
    expect(url).toEqual(`/settings`);
    expect(opts).toEqual({ ...options, httpMethod: "POST" });
  });

  it("fetchSetting", async () => {
    const id = "uuidv4";
    const options: IFetchSettingParams = { ...baseOpts, id };

    await fetchSetting(options);

    expect(requestSpy.calls.count()).toEqual(1);
    const [url, opts] = requestSpy.calls.argsFor(0);
    expect(url).toEqual(`/settings/${id}`);
    expect(opts).toEqual({ ...options, httpMethod: "GET" });
  });

  it("updateSetting", async () => {
    const id = "uuidv4";
    const body: IUpdateSetting = {
      settings: {
        discussions: {
          allowedChannelIds: ["aaa"],
          allowedLocations: [
            {
              type: "Point",
              coordinates: [-101.25, 37.996162679728116],
            },
          ],
        },
      },
    };
    const options: IUpdateSettingParams = {
      ...baseOpts,
      id,
      data: body,
    };

    await updateSetting(options);

    expect(requestSpy.calls.count()).toEqual(1);
    const [url, opts] = requestSpy.calls.argsFor(0);
    expect(url).toEqual(`/settings/${id}`);
    expect(opts).toEqual({ ...options, httpMethod: "PATCH" });
  });

  it("removeSetting", async () => {
    const id = "uuidv4";
    const options: IRemoveSettingParams = { ...baseOpts, id };

    await removeSetting(options);

    expect(requestSpy.calls.count()).toEqual(1);
    const [url, opts] = requestSpy.calls.argsFor(0);
    expect(url).toEqual(`/settings/${id}`);
    expect(opts).toEqual({ ...options, httpMethod: "DELETE" });
  });

  describe("getDefaultEntitySettings", () => {
    it("returns default entity settings", () => {
      const result = getDefaultEntitySettings("discussion");
      expect(result).toEqual({
        type: EntitySettingType.CONTENT,
        settings: {
          discussions: {
            allowedChannelIds: null,
            allowedLocations: null,
          },
        },
      });
    });

    it("throws error if entity type not valid", () => {
      try {
        getDefaultEntitySettings("org");
      } catch (e) {
        expect(e.message).toBe("no default entity settings defined for org");
      }
    });
  });
});
