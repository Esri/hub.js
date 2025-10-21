import { vi, afterEach, beforeEach } from "vitest";
import * as req from "../../../src/discussions/api/discussions-api-request";
import type { Geometry } from "geojson";
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
import {
  createSetting,
  createSettingV2,
  fetchSetting,
  fetchSettingV2,
  removeSetting,
  removeSettingV2,
  updateSetting,
  updateSettingV2,
} from "../../../src/discussions/api/settings/settings";
import { getDefaultEntitySettings } from "../../../src/discussions/api/settings/getDefaultEntitySettings";

describe("settings", () => {
  let requestSpy: any;
  let requestSpyV2: any;
  const response = new Response("ok", { status: 200 });
  const baseOpts: IDiscussionsRequestOptions = {
    hubApiUrl: "https://hub.arcgis.com/api",
    authentication: undefined,
  };

  const polygon: Geometry = {
    type: "Polygon",
    coordinates: [
      [
        [0, 0],
        [5, 0],
        [5, 5],
        [0, 5],
        [0, 0],
      ],
    ],
  };

  beforeEach(() => {
    requestSpy = vi
      .spyOn(req, "discussionsApiRequest")
      .mockReturnValue(Promise.resolve(response));
    requestSpyV2 = vi
      .spyOn(req, "discussionsApiRequestV2")
      .mockReturnValue(Promise.resolve(response));
  });

  afterEach(() => vi.restoreAllMocks());

  it("createSetting", async () => {
    const body: ICreateSetting = {
      id: "uuidv4",
      type: EntitySettingType.CONTENT,
      settings: {
        discussions: {
          allowedChannelIds: ["aaa"],
          allowedLocations: [polygon],
        },
      },
    };
    const options: ICreateSettingParams = { ...baseOpts, data: body };

    await createSetting(options);

    expect(requestSpy.mock.calls.length).toEqual(1);
    const [url, opts] = requestSpy.mock.calls[0];
    expect(url).toEqual(`/settings`);
    expect(opts).toEqual({ ...options, httpMethod: "POST" });
  });

  it("fetchSetting", async () => {
    const id = "uuidv4";
    const options: IFetchSettingParams = { ...baseOpts, id };

    await fetchSetting(options);

    expect(requestSpy.mock.calls.length).toEqual(1);
    const [url, opts] = requestSpy.mock.calls[0];
    expect(url).toEqual(`/settings/${id}`);
    expect(opts).toEqual({ ...options, httpMethod: "GET" });
  });

  it("updateSetting", async () => {
    const id = "uuidv4";
    const body: IUpdateSetting = {
      settings: {
        discussions: {
          allowedChannelIds: ["aaa"],
          allowedLocations: [polygon],
        },
      },
    };
    const options: IUpdateSettingParams = {
      ...baseOpts,
      id,
      data: body,
    };

    await updateSetting(options);

    expect(requestSpy.mock.calls.length).toEqual(1);
    const [url, opts] = requestSpy.mock.calls[0];
    expect(url).toEqual(`/settings/${id}`);
    expect(opts).toEqual({ ...options, httpMethod: "PATCH" });
  });

  it("removeSetting", async () => {
    const id = "uuidv4";
    const options: IRemoveSettingParams = { ...baseOpts, id };

    await removeSetting(options);

    expect(requestSpy.mock.calls.length).toEqual(1);
    const [url, opts] = requestSpy.mock.calls[0];
    expect(url).toEqual(`/settings/${id}`);
    expect(opts).toEqual({ ...options, httpMethod: "DELETE" });
  });

  it("createSettingV2", async () => {
    const body: ICreateSetting = {
      id: "uuidv4",
      type: EntitySettingType.CONTENT,
      settings: {
        discussions: {
          allowedChannelIds: ["aaa"],
          allowedLocations: [polygon],
        },
      },
    };
    const options: ICreateSettingParams = { ...baseOpts, data: body };

    await createSettingV2(options);

    expect(requestSpyV2.mock.calls.length).toEqual(1);
    const [url, opts] = requestSpyV2.mock.calls[0];
    expect(url).toEqual(`/settings`);
    expect(opts).toEqual({ ...options, httpMethod: "POST" });
  });

  it("fetchSettingV2", async () => {
    const id = "uuidv4";
    const options: IFetchSettingParams = { ...baseOpts, id };

    await fetchSettingV2(options);

    expect(requestSpyV2.mock.calls.length).toEqual(1);
    const [url, opts] = requestSpyV2.mock.calls[0];
    expect(url).toEqual(`/settings/${id}`);
    expect(opts).toEqual({ ...options, httpMethod: "GET" });
  });

  it("updateSettingV2", async () => {
    const id = "uuidv4";
    const body: IUpdateSetting = {
      settings: {
        discussions: {
          allowedChannelIds: ["aaa"],
          allowedLocations: [polygon],
        },
      },
    };
    const options: IUpdateSettingParams = {
      ...baseOpts,
      id,
      data: body,
    };

    await updateSettingV2(options);

    expect(requestSpyV2.mock.calls.length).toEqual(1);
    const [url, opts] = requestSpyV2.mock.calls[0];
    expect(url).toEqual(`/settings/${id}`);
    expect(opts).toEqual({ ...options, httpMethod: "PATCH" });
  });

  it("removeSettingV2", async () => {
    const id = "uuidv4";
    const options: IRemoveSettingParams = { ...baseOpts, id };

    await removeSettingV2(options);

    expect(requestSpyV2.mock.calls.length).toEqual(1);
    const [url, opts] = requestSpyV2.mock.calls[0];
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
        getDefaultEntitySettings("site");
      } catch (e) {
        expect((e as Error).message).toBe(
          "no default entity settings defined for site"
        );
      }
    });
  });
});
