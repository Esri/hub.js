import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
// provide mocked versions of external arcgis-rest modules so tests can
// control named exports (getItem/getService/updateServiceDefinition/removeItem)
// Return only the specific functions we need typed to avoid spreading unknown
// module shapes which causes TS "spread types" errors.
vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => {
  // Merge the original ESM namespace and override only the functions we need.
  const actual = await importOriginal();
  return {
    ...(actual as any),
    // override only the remote calls we control in tests
    getItem: vi.fn(),
    removeItem: vi.fn(),
  } as Partial<typeof import("@esri/arcgis-rest-portal")>;
});
vi.mock("@esri/arcgis-rest-feature-service", async (importOriginal) => {
  // Merge the original ESM namespace and override only the functions we need.
  const actual = await importOriginal();
  return {
    ...(actual as any),
    // mock the remote calls we control in tests
    getService: vi.fn(),
    updateServiceDefinition: vi.fn(),
  } as Partial<typeof import("@esri/arcgis-rest-feature-service")>;
});
import * as portalModule from "@esri/arcgis-rest-portal";
import * as featureLayerModule from "@esri/arcgis-rest-feature-service";
import * as adminModule from "@esri/arcgis-rest-feature-service";

// Mock internal helpers that we override in tests. Returning mock fns at
// module-mock time avoids trying to assign to read-only ESM namespace exports.
vi.mock("../../src/models/createModel", () => ({ createModel: vi.fn() }));
vi.mock("../../src/models/updateModel", () => ({ updateModel: vi.fn() }));
vi.mock("../../src/core/_internal/createOrUpdateEntitySettings", () => ({
  createOrUpdateEntitySettings: vi.fn(),
}));
import { MOCK_AUTH, MOCK_HUB_REQOPTS, TOMORROW } from "../mocks/mock-auth";
import * as createModelUtils from "../../src/models/createModel";
import * as updateModelUtils from "../../src/models/updateModel";
import { IModel } from "../../src/hub-types";
import {
  createContent,
  deleteContent,
  updateContent,
} from "../../src/content/edit";
import { cloneObject } from "../../src/util";
import * as getDefaultEntitySettingsUtils from "../../src/discussions/api/settings/getDefaultEntitySettings";
import * as createOrUpdateEntitySettingsUtils from "../../src/core/_internal/createOrUpdateEntitySettings";
import { IGeometryInstance } from "../../src/core/types/IGeometryInstance";
import { IHubEditableContent } from "../../src/core/types/IHubEditableContent";
import * as internalContentUtils from "../../src/content/_internal/internalContentUtils";
import * as manageSchedule from "../../src/content/manageSchedule";

const GUID = "9b77674e43cf4bbd9ecad5189b3f1fdc";
const myMockAuth = {
  clientId: "clientId",
  redirectUri: "https://example-app.com/redirect-uri",
  token: "fake-token",
  tokenExpires: TOMORROW,
  refreshToken: "refreshToken",
  refreshTokenExpires: TOMORROW,
  refreshTokenTTL: 1440,
  username: "casey",
  password: "123456",
  portal: MOCK_HUB_REQOPTS.hubApiUrl,
  getToken: () => Promise.resolve("fake-token"),
} as any;
const geometry: Partial<IGeometryInstance> = {
  type: "polygon",
  spatialReference: { wkid: 4326 },
  toJSON: () => null,
};
export const DEFAULT_SETTINGS =
  getDefaultEntitySettingsUtils.getDefaultEntitySettings("content");

describe("content editing:", () => {
  // typed spies to avoid unsafe any calls
  let createOrUpdateEntitySettingsSpy: ReturnType<typeof vi.fn>;
  afterEach(() => {
    // ensure module-level mocks do not leak call history between tests
    vi.resetAllMocks();
  });

  // Restore any spied module state after each top-level describe run to avoid
  // cross-test leakage for ESM namespace spies/mocks.
  afterEach(() => {
    vi.restoreAllMocks();
  });
  describe("create content:", () => {
    it("converts to a model and creates the item", async () => {
      const createSpy = vi.fn((m: IModel) => {
        const newModel = cloneObject(m);
        newModel.item.id = GUID;
        return Promise.resolve(newModel);
      });
      (createModelUtils as any).createModel = createSpy;
      createOrUpdateEntitySettingsSpy = vi.fn().mockResolvedValue({
        id: GUID,
        ...DEFAULT_SETTINGS,
      });
      (createOrUpdateEntitySettingsUtils as any).createOrUpdateEntitySettings =
        createOrUpdateEntitySettingsSpy;
      const chk = await createContent(
        {
          name: "Hello World",
          orgUrlKey: "dcdev",
          type: "Web Map",
        },
        {
          ...MOCK_HUB_REQOPTS,
          authentication: myMockAuth,
        }
      );

      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      // should create the item
      expect(createSpy).toHaveBeenCalledTimes(1);
      const modelToCreate = createSpy.mock.calls[0][0];
      expect(modelToCreate.item.title).toBe("Hello World");
      // expect(modelToCreate.item.type).toBe("Hub Content");
      expect(modelToCreate.item.properties.orgUrlKey).toBe("dcdev");
      expect(createOrUpdateEntitySettingsSpy).toHaveBeenCalledTimes(1);
    });
  });
  describe("update content:", () => {
    let getItemSpy: ReturnType<typeof vi.fn>;
    let getServiceSpy: ReturnType<typeof vi.fn>;
    let updateModelSpy: ReturnType<typeof vi.fn>;
    let updateServiceSpy: ReturnType<typeof vi.fn>;
    let createOrUpdateEntitySettingsSpy: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      // use the module-level mocks returned by vi.mock above
      getItemSpy = portalModule.getItem as unknown as ReturnType<typeof vi.fn>;
      getServiceSpy = featureLayerModule.getService as unknown as ReturnType<
        typeof vi.fn
      >;
      updateModelSpy = updateModelUtils.updateModel as unknown as ReturnType<
        typeof vi.fn
      >;
      updateServiceSpy =
        adminModule.updateServiceDefinition as unknown as ReturnType<
          typeof vi.fn
        >;
      createOrUpdateEntitySettingsSpy =
        createOrUpdateEntitySettingsUtils.createOrUpdateEntitySettings as unknown as ReturnType<
          typeof vi.fn
        >;

      // initialize mocked behaviors
      getItemSpy.mockResolvedValue({ item: { typeKeywords: [] } });
      updateModelSpy.mockImplementation((m: IModel) => Promise.resolve(m));
      createOrUpdateEntitySettingsSpy.mockResolvedValue({
        id: GUID,
        ...DEFAULT_SETTINGS,
      });
    });
    afterEach(() => {
      getItemSpy.mockReset();
      getServiceSpy.mockReset();
      updateModelSpy.mockReset();
      updateServiceSpy.mockReset();
      createOrUpdateEntitySettingsSpy.mockReset();
    });
    it("converts to a model and updates the item", async () => {
      const content: IHubEditableContent = {
        itemControl: "edit",
        id: GUID,
        name: "Hello World",
        tags: ["Transportation"],
        description: "Some longer description",
        slug: "dcdev-wat-blarg",
        orgUrlKey: "dcdev",
        owner: "dcdev_dude",
        type: "Hub Initiative",
        createdDate: new Date(1595878748000),
        createdDateSource: "item.created",
        updatedDate: new Date(1595878750000),
        updatedDateSource: "item.modified",
        thumbnailUrl: "",
        permissions: [],
        schemaVersion: 1,
        canEdit: false,
        canDelete: false,
        location: { type: "none" },
        licenseInfo: "",
        schedule: { mode: "automatic" },
      };
      const chk = await updateContent(content, {
        ...MOCK_HUB_REQOPTS,
        authentication: myMockAuth,
      });
      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(chk.description).toBe("Some longer description");
      expect(getItemSpy).toHaveBeenCalledTimes(1);
      expect(updateModelSpy).toHaveBeenCalledTimes(1);
      const modelToUpdate = updateModelSpy.mock.calls[0][0];
      expect(modelToUpdate.item.description).toBe(content.description);
      // No service is associated with Hub Initiatives
      expect(getServiceSpy).not.toHaveBeenCalled();
      expect(updateServiceSpy).not.toHaveBeenCalled();
      expect(createOrUpdateEntitySettingsSpy).toHaveBeenCalledTimes(1);
    });
    it("handles when a location is explicitly set", async () => {
      const content: IHubEditableContent = {
        itemControl: "edit",
        id: GUID,
        name: "Hello World",
        tags: ["Transportation"],
        description: "Some longer description",
        slug: "dcdev-wat-blarg",
        orgUrlKey: "dcdev",
        owner: "dcdev_dude",
        type: "Hub Initiative",
        createdDate: new Date(1595878748000),
        createdDateSource: "item.created",
        updatedDate: new Date(1595878750000),
        updatedDateSource: "item.modified",
        thumbnailUrl: "",
        permissions: [],
        schemaVersion: 1,
        canEdit: false,
        canDelete: false,
        location: { type: "item" },
        licenseInfo: "",
        schedule: { mode: "automatic" },
      };
      const chk = await updateContent(content, {
        ...MOCK_HUB_REQOPTS,
        portal: "https://not-portal.com",
        authentication: myMockAuth,
      });
      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(chk.description).toBe("Some longer description");
      expect(getItemSpy).toHaveBeenCalledTimes(1);
      expect(updateModelSpy).toHaveBeenCalledTimes(1);
      const modelToUpdate = updateModelSpy.mock.calls[0][0];
      expect(modelToUpdate.item.description).toBe(content.description);
      // No service is associated with Hub Initiatives
      expect(getServiceSpy).not.toHaveBeenCalled();
      expect(updateServiceSpy).not.toHaveBeenCalled();
    });
    it("doesn't update the hosted service if configurations haven't changed", async () => {
      const currentDefinition: Partial<featureLayerModule.IFeatureServiceDefinition> =
        { capabilities: "Extract" };
      getServiceSpy.mockResolvedValue(currentDefinition);
      const maybeUpdateScheduleSpy = vi
        .spyOn(manageSchedule, "maybeUpdateSchedule")
        .mockResolvedValue({ message: "schedule updated" });

      const content: IHubEditableContent = {
        itemControl: "edit",
        id: GUID,
        name: "Hello World",
        tags: ["Transportation"],
        description: "Some longer description",
        slug: "dcdev-wat-blarg",
        orgUrlKey: "dcdev",
        owner: "dcdev_dude",
        type: "Feature Service",
        typeKeywords: ["Hosted Service"],
        createdDate: new Date(1595878748000),
        createdDateSource: "item.created",
        updatedDate: new Date(1595878750000),
        updatedDateSource: "item.modified",
        thumbnailUrl: "",
        permissions: [],
        schemaVersion: 1,
        canEdit: false,
        canDelete: false,
        location: { type: "item" },
        licenseInfo: "",
        url: "https://services.arcgis.com/:orgId/arcgis/rest/services/:serviceName/FeatureServer",
        // Indicates that Extract should enabled on the service,
        // Since it already is, nothing should change
        serverExtractCapability: true,
        schedule: { mode: "automatic" },
        _forceUpdate: [],
        access: "public",
      };
      const chk = await updateContent(content, {
        ...MOCK_HUB_REQOPTS,
        authentication: myMockAuth,
      });
      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(chk.description).toBe("Some longer description");
      expect(getItemSpy).toHaveBeenCalledTimes(1);
      expect(updateModelSpy).toHaveBeenCalledTimes(1);
      expect(getServiceSpy).toHaveBeenCalledTimes(1);
      expect(updateServiceSpy).not.toHaveBeenCalled();
      expect(maybeUpdateScheduleSpy).toHaveBeenCalledTimes(1);
    });
    it("updates the hosted service if configurations have changed", async () => {
      const currentDefinition: Partial<featureLayerModule.IFeatureServiceDefinition> =
        { currentVersion: 11.2, capabilities: "Query" };
      getServiceSpy.mockResolvedValue(currentDefinition);
      const maybeUpdateScheduleSpy = vi
        .spyOn(manageSchedule, "maybeUpdateSchedule")
        .mockResolvedValue({ message: "schedule updated" });
      const forceUpdateContentSpy = vi
        .spyOn(internalContentUtils, "forceUpdateContent")
        .mockResolvedValue(true);

      const content: IHubEditableContent = {
        itemControl: "edit",
        id: GUID,
        name: "Hello World",
        tags: ["Transportation"],
        description: "Some longer description",
        slug: "dcdev-wat-blarg",
        orgUrlKey: "dcdev",
        owner: "dcdev_dude",
        type: "Feature Service",
        typeKeywords: ["Hosted Service"],
        createdDate: new Date(1595878748000),
        createdDateSource: "item.created",
        updatedDate: new Date(1595878750000),
        updatedDateSource: "item.modified",
        thumbnailUrl: "",
        permissions: [],
        schemaVersion: 1,
        canEdit: false,
        canDelete: false,
        location: { type: "item" },
        licenseInfo: "",
        url: "https://services.arcgis.com/:orgId/arcgis/rest/services/:serviceName/FeatureServer",
        // Indicates that Extract should enabled on the service,
        // Since it currently isn't, the service will be updated
        serverExtractCapability: true,
        schedule: { mode: "automatic" },
        _forceUpdate: [true],
        access: "public",
      };
      const chk = await updateContent(content, {
        ...MOCK_HUB_REQOPTS,
        authentication: myMockAuth,
      });
      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(chk.description).toBe("Some longer description");
      expect(getItemSpy).toHaveBeenCalledTimes(1);
      expect(updateModelSpy).toHaveBeenCalledTimes(1);
      expect(getServiceSpy).toHaveBeenCalledTimes(1);
      expect(updateServiceSpy).toHaveBeenCalledTimes(1);
      expect(forceUpdateContentSpy).toHaveBeenCalledTimes(1);
      expect(maybeUpdateScheduleSpy).toHaveBeenCalledTimes(1);
      const [url, { updateDefinition }] = updateServiceSpy.mock.calls[0];
      expect(url).toEqual(
        "https://services.arcgis.com/:orgId/arcgis/rest/services/:serviceName/FeatureServer"
      );
      expect(updateDefinition).toEqual({ capabilities: "Query,Extract" });
    });
    it("sets the download object on the model", async () => {
      const currentDefinition: Partial<featureLayerModule.IFeatureServiceDefinition> =
        { capabilities: "Extract" };
      getServiceSpy.mockResolvedValue(currentDefinition);
      const maybeUpdateScheduleSpy = vi
        .spyOn(manageSchedule, "maybeUpdateSchedule")
        .mockResolvedValue({ message: "schedule updated" });
      const content: IHubEditableContent = {
        itemControl: "edit",
        id: GUID,
        name: "Hello World",
        tags: ["Transportation"],
        description: "Some longer description",
        slug: "dcdev-wat-blarg",
        orgUrlKey: "dcdev",
        owner: "dcdev_dude",
        type: "Feature Service",
        typeKeywords: ["Hosted Service"],
        createdDate: new Date(1595878748000),
        createdDateSource: "item.created",
        updatedDate: new Date(1595878750000),
        updatedDateSource: "item.modified",
        thumbnailUrl: "",
        permissions: [],
        schemaVersion: 1,
        canEdit: false,
        canDelete: false,
        location: { type: "item" },
        licenseInfo: "",
        url: "https://services.arcgis.com/:orgId/arcgis/rest/services/:serviceName/FeatureServer/0",
        // Indicates that Extract should enabled on the service,
        // Since it already is, nothing should change
        serverExtractCapability: true,
        schedule: { mode: "automatic" },
        _forceUpdate: [],
        access: "public",
        extendedProps: {
          downloads: {
            flowType: "createReplica",
            formats: [
              {
                key: "filegdb",
                hidden: false,
              },
            ],
          },
          kind: "content",
        },
      };
      const chk = await updateContent(content, {
        ...MOCK_HUB_REQOPTS,
        authentication: myMockAuth,
      });
      expect(chk.extendedProps?.downloads).toEqual(
        content.extendedProps?.downloads
      );
      expect(maybeUpdateScheduleSpy).toHaveBeenCalledTimes(1);
    });
    it("creates settings if none exists", async () => {
      const content: IHubEditableContent = {
        itemControl: "edit",
        id: GUID,
        name: "Hello World",
        tags: ["Transportation"],
        description: "Some longer description",
        slug: "dcdev-wat-blarg",
        orgUrlKey: "dcdev",
        owner: "dcdev_dude",
        type: "Hub Initiative",
        createdDate: new Date(1595878748000),
        createdDateSource: "item.created",
        updatedDate: new Date(1595878750000),
        updatedDateSource: "item.modified",
        thumbnailUrl: "",
        permissions: [],
        schemaVersion: 1,
        canEdit: false,
        canDelete: false,
        location: { type: "none" },
        licenseInfo: "",
        schedule: { mode: "automatic" },
      };
      const chk = await updateContent(content, {
        ...MOCK_HUB_REQOPTS,
        authentication: myMockAuth,
      });
      expect(chk.entitySettingsId).toBe(GUID);
      expect(chk.discussionSettings).toEqual(
        DEFAULT_SETTINGS.settings?.discussions
      );
    });
    it("updates settings when settings id exists", async () => {
      const content: IHubEditableContent = {
        itemControl: "edit",
        id: GUID,
        name: "Hello World",
        tags: ["Transportation"],
        description: "Some longer description",
        slug: "dcdev-wat-blarg",
        orgUrlKey: "dcdev",
        owner: "dcdev_dude",
        type: "Hub Initiative",
        createdDate: new Date(1595878748000),
        createdDateSource: "item.created",
        updatedDate: new Date(1595878750000),
        updatedDateSource: "item.modified",
        thumbnailUrl: "",
        permissions: [],
        schemaVersion: 1,
        canEdit: false,
        canDelete: false,
        licenseInfo: "",
        schedule: { mode: "automatic" },
        entitySettingsId: "mock entity settings id",
        location: {
          type: "custom",
          geometries: [geometry],
        },
        discussionSettings: {
          allowedChannelIds: ["c1"],
          allowedLocations: null,
        },
      };
      const chk = await updateContent(content, {
        ...MOCK_HUB_REQOPTS,
        authentication: myMockAuth,
      });
      expect(chk.entitySettingsId).toBe(GUID);
      expect(chk.discussionSettings).toEqual(
        DEFAULT_SETTINGS.settings?.discussions
      );
      expect(createOrUpdateEntitySettingsSpy).toHaveBeenCalledTimes(1);
    });
  });
  describe("delete content", () => {
    it("deletes the item", async () => {
      const removeSpy = vi.fn().mockResolvedValue({ success: true });
      (portalModule as any).removeItem = removeSpy;

      const result = await deleteContent("3ef", { authentication: MOCK_AUTH });
      expect(result).toBeUndefined();
      expect(removeSpy).toHaveBeenCalledTimes(1);
      expect(removeSpy.mock.calls[0][0].authentication).toBe(MOCK_AUTH);
      expect(removeSpy.mock.calls[0][0].id).toBe("3ef");
    });
  });
});
