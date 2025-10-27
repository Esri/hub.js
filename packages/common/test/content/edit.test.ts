import * as portalModule from "@esri/arcgis-rest-portal";
import * as featureLayerModule from "@esri/arcgis-rest-feature-service";
import * as adminModule from "@esri/arcgis-rest-feature-service";
import { MOCK_AUTH, MOCK_HUB_REQOPTS, TOMORROW } from "../mocks/mock-auth";
import * as modelUtils from "../../src/models";
import { IModel } from "../../src/hub-types";
import { IGeometryInstance, IHubEditableContent } from "../../src/core/types";
import {
  createContent,
  deleteContent,
  updateContent,
} from "../../src/content/edit";
import { cloneObject } from "../../src/util";
import * as getDefaultEntitySettingsUtils from "../../src/discussions/api/settings/getDefaultEntitySettings";
import * as createOrUpdateEntitySettingsUtils from "../../src/core/_internal/createOrUpdateEntitySettings";

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
  let createOrUpdateEntitySettingsSpy: jasmine.Spy;
  describe("create content:", () => {
    it("converts to a model and creates the item", async () => {
      const createSpy = spyOn(modelUtils, "createModel").and.callFake(
        (m: IModel) => {
          const newModel = cloneObject(m);
          newModel.item.id = GUID;
          return Promise.resolve(newModel);
        }
      );
      createOrUpdateEntitySettingsSpy = spyOn(
        createOrUpdateEntitySettingsUtils,
        "createOrUpdateEntitySettings"
      ).and.returnValue(
        Promise.resolve({
          id: GUID,
          ...DEFAULT_SETTINGS,
        })
      );
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
      expect(createSpy.calls.count()).toBe(1);
      const modelToCreate = createSpy.calls.argsFor(0)[0];
      expect(modelToCreate.item.title).toBe("Hello World");
      // expect(modelToCreate.item.type).toBe("Hub Content");
      expect(modelToCreate.item.properties.orgUrlKey).toBe("dcdev");
      expect(createOrUpdateEntitySettingsSpy.calls.count()).toBe(1);
    });
    it("doesn't set entity settings in enterprise", async () => {
      const createSpy = spyOn(modelUtils, "createModel").and.callFake(
        (m: IModel) => {
          const newModel = cloneObject(m);
          newModel.item.id = GUID;
          return Promise.resolve(newModel);
        }
      );
      createOrUpdateEntitySettingsSpy = spyOn(
        createOrUpdateEntitySettingsUtils,
        "createOrUpdateEntitySettings"
      ).and.returnValue(
        Promise.resolve({
          id: GUID,
          ...DEFAULT_SETTINGS,
        })
      );
      const chk = await createContent(
        {
          name: "Hello World",
          orgUrlKey: "dcdev",
          type: "Web Map",
        },
        {
          ...MOCK_HUB_REQOPTS,
          authentication: myMockAuth,
          isPortal: true,
        }
      );

      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      // should create the item
      expect(createSpy.calls.count()).toBe(1);
      const modelToCreate = createSpy.calls.argsFor(0)[0];
      expect(modelToCreate.item.title).toBe("Hello World");
      // expect(modelToCreate.item.type).toBe("Hub Content");
      expect(modelToCreate.item.properties.orgUrlKey).toBe("dcdev");
      expect(createOrUpdateEntitySettingsSpy.calls.count()).toBe(0);
    });
  });
  describe("update content:", () => {
    let getItemSpy: jasmine.Spy;
    let getServiceSpy: jasmine.Spy;
    let updateModelSpy: jasmine.Spy;
    let updateServiceSpy: jasmine.Spy;
    let createOrUpdateEntitySettingsSpy: jasmine.Spy;

    beforeEach(() => {
      getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
        Promise.resolve({
          item: {
            typeKeywords: [],
          },
        })
      );
      getServiceSpy = spyOn(featureLayerModule, "getService");
      updateModelSpy = spyOn(modelUtils, "updateModel").and.callFake(
        (m: IModel) => {
          return Promise.resolve(m);
        }
      );
      updateServiceSpy = spyOn(
        adminModule,
        "updateServiceDefinition"
      ).and.callFake((_url: string, opts: any) =>
        Promise.resolve(opts.updateDefinition)
      );
      createOrUpdateEntitySettingsSpy = spyOn(
        createOrUpdateEntitySettingsUtils,
        "createOrUpdateEntitySettings"
      ).and.returnValue(
        Promise.resolve({
          id: GUID,
          ...DEFAULT_SETTINGS,
        })
      );
    });
    afterEach(() => {
      getItemSpy.calls.reset();
      getServiceSpy.calls.reset();
      updateModelSpy.calls.reset();
      updateServiceSpy.calls.reset();
      createOrUpdateEntitySettingsSpy.calls.reset();
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
      expect(getItemSpy.calls.count()).toBe(1);
      expect(updateModelSpy.calls.count()).toBe(1);
      const modelToUpdate = updateModelSpy.calls.argsFor(0)[0];
      expect(modelToUpdate.item.description).toBe(content.description);
      // No service is associated with Hub Initiatives
      expect(getServiceSpy).not.toHaveBeenCalled();
      expect(updateServiceSpy).not.toHaveBeenCalled();
      expect(createOrUpdateEntitySettingsSpy.calls.count()).toBe(1);
    });
    it("doesn't update entity settings in portal", async () => {
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
        isPortal: true,
      });
      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(chk.description).toBe("Some longer description");
      expect(getItemSpy.calls.count()).toBe(1);
      expect(updateModelSpy.calls.count()).toBe(1);
      const modelToUpdate = updateModelSpy.calls.argsFor(0)[0];
      expect(modelToUpdate.item.description).toBe(content.description);
      // No service is associated with Hub Initiatives
      expect(getServiceSpy).not.toHaveBeenCalled();
      expect(updateServiceSpy).not.toHaveBeenCalled();
      expect(createOrUpdateEntitySettingsSpy.calls.count()).toBe(0);
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
      expect(getItemSpy.calls.count()).toBe(1);
      expect(updateModelSpy.calls.count()).toBe(1);
      const modelToUpdate = updateModelSpy.calls.argsFor(0)[0];
      expect(modelToUpdate.item.description).toBe(content.description);
      // No service is associated with Hub Initiatives
      expect(getServiceSpy).not.toHaveBeenCalled();
      expect(updateServiceSpy).not.toHaveBeenCalled();
    });
    it("doesn't update the hosted service if configurations haven't changed", async () => {
      const currentDefinition: Partial<featureLayerModule.IFeatureServiceDefinition> =
        { capabilities: "Extract" };
      getServiceSpy.and.returnValue(Promise.resolve(currentDefinition));

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
      expect(getItemSpy.calls.count()).toBe(1);
      expect(updateModelSpy.calls.count()).toBe(1);
      expect(getServiceSpy).toHaveBeenCalledTimes(1);
      expect(updateServiceSpy).not.toHaveBeenCalled();
    });
    it("updates the hosted service if configurations have changed", async () => {
      const currentDefinition: Partial<featureLayerModule.IFeatureServiceDefinition> =
        { currentVersion: 11.2, capabilities: "Query" };
      getServiceSpy.and.returnValue(Promise.resolve(currentDefinition));

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
      expect(getItemSpy.calls.count()).toBe(1);
      expect(updateModelSpy.calls.count()).toBe(1);
      expect(getServiceSpy).toHaveBeenCalledTimes(1);
      expect(updateServiceSpy).toHaveBeenCalledTimes(1);
      const [url, { updateDefinition }] = updateServiceSpy.calls.argsFor(0);
      expect(url).toEqual(
        "https://services.arcgis.com/:orgId/arcgis/rest/services/:serviceName/FeatureServer"
      );
      expect(updateDefinition).toEqual({ capabilities: "Query,Extract" });
    });
    it("sets the download object on the model", async () => {
      const currentDefinition: Partial<featureLayerModule.IFeatureServiceDefinition> =
        { capabilities: "Extract" };
      getServiceSpy.and.returnValue(Promise.resolve(currentDefinition));
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
      expect(createOrUpdateEntitySettingsSpy.calls.count()).toBe(1);
    });
  });
  describe("delete content", () => {
    it("deletes the item", async () => {
      const removeSpy = spyOn(portalModule, "removeItem").and.returnValue(
        Promise.resolve({ success: true })
      );

      const result = await deleteContent("3ef", {
        authentication: MOCK_AUTH,
      });
      expect(result).toBeUndefined();
      expect(removeSpy.calls.count()).toBe(1);
      expect(removeSpy.calls.argsFor(0)[0].authentication).toBe(MOCK_AUTH);
      expect(removeSpy.calls.argsFor(0)[0].id).toBe("3ef");
    });
  });
});
