import * as req from "../../../src/discussions/api/discussions-api-request";
import { Geometry } from "geojson";
import {
  createSetting,
  createSettingV2,
  fetchSetting,
  fetchSettingV2,
  getDefaultEntitySettings,
  removeSetting,
  removeSettingV2,
  updateSetting,
  updateSettingV2,
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
    requestSpy = spyOn(req, "discussionsApiRequest").and.returnValue(
      Promise.resolve(response)
    );
    requestSpyV2 = spyOn(req, "discussionsApiRequestV2").and.returnValue(
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
          allowedLocations: [polygon],
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

    expect(requestSpyV2.calls.count()).toEqual(1);
    const [url, opts] = requestSpyV2.calls.argsFor(0);
    expect(url).toEqual(`/settings`);
    expect(opts).toEqual({ ...options, httpMethod: "POST" });
  });

  it("fetchSettingV2", async () => {
    const id = "uuidv4";
    const options: IFetchSettingParams = { ...baseOpts, id };

    await fetchSettingV2(options);

    expect(requestSpyV2.calls.count()).toEqual(1);
    const [url, opts] = requestSpyV2.calls.argsFor(0);
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

    expect(requestSpyV2.calls.count()).toEqual(1);
    const [url, opts] = requestSpyV2.calls.argsFor(0);
    expect(url).toEqual(`/settings/${id}`);
    expect(opts).toEqual({ ...options, httpMethod: "PATCH" });
  });

  it("removeSettingV2", async () => {
    const id = "uuidv4";
    const options: IRemoveSettingParams = { ...baseOpts, id };

    await removeSettingV2(options);

    expect(requestSpyV2.calls.count()).toEqual(1);
    const [url, opts] = requestSpyV2.calls.argsFor(0);
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
