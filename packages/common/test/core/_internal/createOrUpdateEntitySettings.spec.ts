import type { Polygon } from "geojson";
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import { createOrUpdateEntitySettings } from "../../../src/core/_internal/createOrUpdateEntitySettings";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import * as settingUtils from "../../../src/discussions/api/settings/settings";
import * as getDefaultEntitySettingsUtils from "../../../src/discussions/api/settings/getDefaultEntitySettings";
import { IHubDiscussion } from "../../../src/core/types/IHubDiscussion";
import { EntitySettingType } from "../../../src/discussions/api/enums/entitySettingsType";

describe("createOrUpdateEntitySettings", () => {
  const MOCK_REQUEST_OPTIONS = { authentication: MOCK_AUTH };
  const DEFAULT_SETTINGS =
    getDefaultEntitySettingsUtils.getDefaultEntitySettings("discussion");
  let createSettingsSpy: any;
  let updateSettingsSpy: any;
  const GUID = "9b77674e43cf4bbd9ecad5189b3f1fdc";
  const MOCK_POLYGONS: Polygon[] = [
    {
      type: "Polygon",
      coordinates: [
        [
          [0, 0],
          [1, 1],
          [2, 2],
          [0, 0],
        ],
      ],
    },
  ];

  beforeEach(() => {
    createSettingsSpy = vi
      .spyOn(settingUtils, "createSettingV2")
      .mockResolvedValue({ id: GUID, ...DEFAULT_SETTINGS } as any);
    updateSettingsSpy = vi
      .spyOn(settingUtils, "updateSettingV2")
      .mockResolvedValue({ id: GUID, ...DEFAULT_SETTINGS } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("creates settings when entitySettingsId is undefined", async () => {
    const MOCK_ENTITY: IHubDiscussion = {
      id: GUID,
      type: "Discussion",
    } as IHubDiscussion;
    const result = await createOrUpdateEntitySettings(
      MOCK_ENTITY,
      MOCK_REQUEST_OPTIONS,
      MOCK_POLYGONS
    );
    expect(createSettingsSpy).toHaveBeenCalledTimes(1);
    expect(createSettingsSpy).toHaveBeenCalledWith({
      data: {
        id: GUID,
        type: EntitySettingType.CONTENT,
        settings: {
          discussions: {
            allowedChannelIds: null,
            allowedLocations: MOCK_POLYGONS,
          },
        },
      },
      ...MOCK_REQUEST_OPTIONS,
    });
    expect(result.id).toBe("9b77674e43cf4bbd9ecad5189b3f1fdc");
    expect(result.settings.discussions.allowedChannelIds).toBeNull();
    expect(result.settings.discussions.allowedLocations).toBeNull();
  });

  it("updates settings when entitySettingsId is present", async () => {
    const MOCK_ENTITY: IHubDiscussion = {
      id: GUID,
      type: "Discussion",
      entitySettingsId: GUID,
      discussionSettings: {
        allowedChannelIds: ["c1"],
        allowedLocations: MOCK_POLYGONS,
      },
    } as IHubDiscussion;
    const result = await createOrUpdateEntitySettings(
      MOCK_ENTITY,
      MOCK_REQUEST_OPTIONS,
      null
    );
    expect(updateSettingsSpy).toHaveBeenCalledTimes(1);
    expect(updateSettingsSpy).toHaveBeenCalledWith({
      id: GUID,
      data: {
        settings: {
          discussions: {
            allowedChannelIds: ["c1"],
            allowedLocations: null,
          },
        },
      },
      authentication: MOCK_REQUEST_OPTIONS.authentication,
    });
    expect(result.id).toBe("9b77674e43cf4bbd9ecad5189b3f1fdc");
    expect(result.settings.discussions.allowedChannelIds).toBeNull();
    expect(result.settings.discussions.allowedLocations).toBeNull();
  });

  it("normalizes allowedChannelIds and allowedLocations to null if empty", async () => {
    const entity: IHubDiscussion = {
      id: GUID,
      type: "Discussion",
      discussionSettings: {
        allowedChannelIds: [],
        allowedLocations: [],
      },
    } as IHubDiscussion;
    const result = await createOrUpdateEntitySettings(
      entity,
      MOCK_REQUEST_OPTIONS
    );
    expect(result.settings.discussions.allowedChannelIds).toBeNull();
    expect(result.settings.discussions.allowedLocations).toBeNull();
  });
});
