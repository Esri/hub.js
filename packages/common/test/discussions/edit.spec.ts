// make arcgis-rest-portal exports configurable for spying in ESM
import { vi, afterEach } from "vitest";
vi.mock("@esri/arcgis-rest-portal", async () => {
  const original = await vi.importActual("@esri/arcgis-rest-portal");
  return { ...(original as any), removeItem: vi.fn().mockResolvedValue({}) };
});
import * as portalModule from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as createModelUtils from "../../src/models/createModel";
import * as getModelUtils from "../../src/models/getModel";
import * as updateModelUtils from "../../src/models/updateModel";
import * as slugUtils from "../../src/items/slugs";
import { IModel } from "../../src/hub-types";
import {
  createDiscussion,
  deleteDiscussion,
  updateDiscussion,
} from "../../src/discussions/edit";
import { IHubDiscussion } from "../../src/core/types/IHubDiscussion";
import { cloneObject } from "../../src/util";
import * as settingUtils from "../../src/discussions/api/settings/settings";
import * as getDefaultEntitySettingsUtils from "../../src/discussions/api/settings/getDefaultEntitySettings";
import * as terraformer from "@terraformer/arcgis";
import type { Polygon } from "geojson";
import { IGeometryInstance } from "../../src/core/types/IGeometryInstance";
import * as createOrUpdateEntitySettingsUtils from "../../src/core/_internal/createOrUpdateEntitySettings";

// TODO: update
const GUID = "9b77674e43cf4bbd9ecad5189b3f1fdc";
const DISCUSSION_ITEM: portalModule.IItem = {
  id: GUID,
  title: "Fake Discussion",
  description: "fake description",
  snippet: "fake snippet",
  properties: {
    schemaVersion: 1,
  },
  owner: "vader",
  type: "Discussion",
  created: 1643646881000,
  modified: 1643646881000,
  tags: [],
  typeKeywords: [],
  thumbnail: "vader.png",
  numViews: 10,
  size: 0,
} as portalModule.IItem;

const DISCUSSION_DATA = {
  settings: { capabilities: {} },
};

const DISCUSSION_MODEL = {
  item: DISCUSSION_ITEM,
  data: DISCUSSION_DATA,
} as IModel;

const DEFAULT_SETTINGS =
  getDefaultEntitySettingsUtils.getDefaultEntitySettings("discussion");

const requestOptions = { authentication: MOCK_AUTH };

const geometry: Partial<IGeometryInstance> = {
  type: "polygon",
  spatialReference: { wkid: 4326 },
  toJSON: () => null,
};
const geometryTransformed: Polygon = {
  type: "Polygon",
  coordinates: [[[0], [0]]],
};

describe("discussions edit:", () => {
  // use a loose any for the spy handles used in tests
  let createOrUpdateEntitySettingsSpy: any;
  afterEach(() => vi.restoreAllMocks());
  describe("deleteDiscussion:", () => {
    it("deletes the item", async () => {
      const removeSettingSpy = vi
        .spyOn(settingUtils, "removeSettingV2")
        .mockResolvedValue({ success: true } as any);

      const result = await deleteDiscussion("3ef", {
        authentication: MOCK_AUTH,
      });
      expect(result).toBeUndefined();
      // ensure settings removal was attempted
      expect(removeSettingSpy.mock.calls.length).toBe(1);
      expect(removeSettingSpy.mock.calls[0][0].authentication).toBe(MOCK_AUTH);
    });
  });

  describe("createDiscussion:", () => {
    beforeEach(() => {
      createOrUpdateEntitySettingsSpy = vi
        .spyOn(
          createOrUpdateEntitySettingsUtils,
          "createOrUpdateEntitySettings"
        )
        .mockResolvedValue({ id: GUID, ...DEFAULT_SETTINGS } as any) as any;
    });
    afterEach(() => {
      // noop: global restoreAllMocks will clear mocks
    });
    it("works with very limited structure", async () => {
      const slugSpy = vi
        .spyOn(slugUtils, "getUniqueSlug")
        .mockResolvedValue("dcdev|hello-world" as any);
      const createSpy = vi
        .spyOn(createModelUtils, "createModel")
        .mockImplementation(async (m: IModel) => {
          const newModel = cloneObject(m);
          newModel.item.id = GUID;
          return newModel;
        });
      const chk = await createDiscussion(
        { name: "Hello World", orgUrlKey: "dcdev" },
        requestOptions
      );

      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(chk.entitySettingsId).toBe(GUID);
      expect(chk.discussionSettings).toEqual(
        DEFAULT_SETTINGS.settings?.discussions
      );
      // should ensure unique slug
      expect(slugSpy.mock.calls.length).toBe(1);
      expect(slugSpy.mock.calls[0][0]).toEqual(
        { slug: "dcdev|hello-world" },
        "should recieve slug"
      );
      const modelToCreate = createSpy.mock.calls[0][0];
      expect(modelToCreate.item.title).toBe("Hello World");
      expect(modelToCreate.item.type).toBe("Discussion");
      expect(modelToCreate.item.properties.slug).toBe("dcdev|hello-world");
      expect(modelToCreate.item.properties.orgUrlKey).toBe("dcdev");
      expect(createOrUpdateEntitySettingsSpy).toHaveBeenCalledTimes(1);
    });
    it("works with more complete object", async () => {
      // Note: this covers a branch when a slug is passed in
      const slugSpy = vi
        .spyOn(slugUtils, "getUniqueSlug")
        .mockResolvedValue("dcdev|hello-world" as any);
      const createSpy = vi
        .spyOn(createModelUtils, "createModel")
        .mockImplementation((m: IModel) => {
          const newModel = cloneObject(m);
          newModel.item.id = GUID;
          return Promise.resolve(newModel);
        });
      const chk = await createDiscussion(
        {
          name: "Hello World",
          slug: "dcdev|hello-world", // important for coverage
          description: "my desc",
          orgUrlKey: "dcdev",
          discussionSettings: {
            allowedChannelIds: ["c1"],
            allowedLocations: [geometryTransformed],
          },
        },
        requestOptions
      );
      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(chk.description).toBe("my desc");
      expect(chk.entitySettingsId).toBe(GUID);
      expect(chk.discussionSettings).toEqual(
        DEFAULT_SETTINGS.settings?.discussions
      );
      // should ensure unique slug
      expect(slugSpy.mock.calls.length).toBe(1);
      expect(slugSpy.mock.calls[0][0]).toEqual(
        { slug: "dcdev|hello-world" },
        "should recieve slug"
      );
      const modelToCreate = createSpy.mock.calls[0][0];
      expect(modelToCreate.item.properties.slug).toBe("dcdev|hello-world");
      expect(modelToCreate.item.properties.orgUrlKey).toBe("dcdev");
      expect(createOrUpdateEntitySettingsSpy).toHaveBeenCalledTimes(1);
    });
    it("coerces allowedChannelIds and allowedLocations to null when they are empty arrays", async () => {
      // Note: this covers a branch when a slug is passed in
      const slugSpy = vi
        .spyOn(slugUtils, "getUniqueSlug")
        .mockResolvedValue("dcdev|hello-world" as any);
      const createSpy = vi
        .spyOn(createModelUtils, "createModel")
        .mockImplementation((m: IModel) => {
          const newModel = cloneObject(m);
          newModel.item.id = GUID;
          return Promise.resolve(newModel);
        });
      const chk = await createDiscussion(
        {
          name: "Hello World",
          slug: "dcdev|hello-world", // important for coverage
          description: "my desc",
          orgUrlKey: "dcdev",
          discussionSettings: {
            allowedChannelIds: [],
            allowedLocations: [],
          },
        },
        requestOptions
      );
      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(chk.description).toBe("my desc");
      expect(chk.entitySettingsId).toBe(GUID);
      expect(chk.discussionSettings).toEqual(
        DEFAULT_SETTINGS.settings?.discussions
      );
      // should ensure unique slug
      expect(slugSpy.mock.calls.length).toBe(1);
      expect(slugSpy.mock.calls[0][0]).toEqual(
        { slug: "dcdev|hello-world" },
        "should recieve slug"
      );
      const modelToCreate = createSpy.mock.calls[0][0];
      expect(modelToCreate.item.properties.slug).toBe("dcdev|hello-world");
      expect(modelToCreate.item.properties.orgUrlKey).toBe("dcdev");
      expect(createOrUpdateEntitySettingsSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateDiscussion: ", () => {
    beforeEach(() => {
      createOrUpdateEntitySettingsSpy = vi
        .spyOn(
          createOrUpdateEntitySettingsUtils,
          "createOrUpdateEntitySettings"
        )
        .mockResolvedValue({ id: GUID, ...DEFAULT_SETTINGS } as any);
    });
    afterEach(() => {
      // noop - global restoreAllMocks will reset mocks
    });
    it("updates backing model and creates settings if none exist", async () => {
      const slugSpy = vi
        .spyOn(slugUtils, "getUniqueSlug")
        .mockResolvedValue("dcdev|dcdev-wat-blarg-1" as any);
      const getModelSpy = vi
        .spyOn(getModelUtils, "getModel")
        .mockResolvedValue(DISCUSSION_MODEL as any);
      const updateModelSpy = vi
        .spyOn(updateModelUtils, "updateModel")
        .mockImplementation((m: IModel) => {
          return Promise.resolve(m);
        });
      const disc: IHubDiscussion = {
        itemControl: "edit",
        id: GUID,
        name: "Hello World",
        tags: ["Transportation"],
        description: "Some longer description",
        slug: "dcdev-wat-blarg",
        orgUrlKey: "dcdev",
        owner: "dcdev_dude",
        type: "Discussion",
        createdDate: new Date(1595878748000),
        createdDateSource: "item.created",
        updatedDate: new Date(1595878750000),
        updatedDateSource: "item.modified",
        thumbnailUrl: "",
        permissions: [],
        catalog: {
          schemaVersion: 1,
        },
        schemaVersion: 1,
        canEdit: false,
        canDelete: false,
        typeKeywords: [],
      };
      const chk = await updateDiscussion(disc, requestOptions);
      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(chk.description).toBe("Some longer description");
      expect(chk.entitySettingsId).toBe(GUID);
      expect(chk.discussionSettings).toEqual(
        DEFAULT_SETTINGS.settings?.discussions
      );
      // should ensure unique slug
      expect(slugSpy.mock.calls.length).toBe(1);
      expect(slugSpy.mock.calls[0][0]).toEqual(
        { slug: "dcdev|dcdev-wat-blarg", existingId: GUID },
        "should receive slug"
      );
      expect(getModelSpy.mock.calls.length).toBe(1);
      expect(updateModelSpy.mock.calls.length).toBe(1);
      const modelToUpdate = updateModelSpy.mock.calls[0][0];
      expect(modelToUpdate.item.description).toBe(disc.description);
      expect(modelToUpdate.item.properties.slug).toBe(
        "dcdev|dcdev-wat-blarg-1"
      );
      expect(createOrUpdateEntitySettingsSpy).toHaveBeenCalledTimes(1);
    });
    it("updates backing model and updates settings when settings id exists", async () => {
      const slugSpy = vi
        .spyOn(slugUtils, "getUniqueSlug")
        .mockResolvedValue("dcdev|dcdev-wat-blarg-1" as any);
      const getModelSpy = vi
        .spyOn(getModelUtils, "getModel")
        .mockResolvedValue(DISCUSSION_MODEL as any);
      const updateModelSpy = vi
        .spyOn(updateModelUtils, "updateModel")
        .mockImplementation((m: IModel) => {
          return Promise.resolve(m);
        });
      vi.spyOn(terraformer, "arcgisToGeoJSON").mockReturnValue(
        geometryTransformed as any
      );
      const disc: IHubDiscussion = {
        itemControl: "edit",
        id: GUID,
        name: "Hello World",
        tags: ["Transportation"],
        description: "Some longer description",
        slug: "dcdev-wat-blarg",
        orgUrlKey: "dcdev",
        owner: "dcdev_dude",
        type: "Discussion",
        createdDate: new Date(1595878748000),
        createdDateSource: "item.created",
        updatedDate: new Date(1595878750000),
        updatedDateSource: "item.modified",
        thumbnailUrl: "",
        permissions: [],
        catalog: {
          schemaVersion: 1,
        },
        schemaVersion: 1,
        canEdit: false,
        canDelete: false,
        typeKeywords: [],
        entitySettingsId: "an id",
        location: {
          type: "custom",
          geometries: [geometry],
        },
        discussionSettings: {
          allowedChannelIds: ["c1"],
          allowedLocations: [geometryTransformed],
        },
      };
      const chk = await updateDiscussion(disc, requestOptions);
      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(chk.description).toBe("Some longer description");
      expect(chk.entitySettingsId).toBe(GUID);
      expect(chk.discussionSettings).toEqual(
        DEFAULT_SETTINGS.settings?.discussions
      );
      // should ensure unique slug
      expect(slugSpy.mock.calls.length).toBe(1);
      expect(slugSpy.mock.calls[0][0]).toEqual(
        { slug: "dcdev|dcdev-wat-blarg", existingId: GUID },
        "should receive slug"
      );
      expect(getModelSpy.mock.calls.length).toBe(1);
      expect(updateModelSpy.mock.calls.length).toBe(1);
      const modelToUpdate = updateModelSpy.mock.calls[0][0];
      expect(modelToUpdate.item.description).toBe(disc.description);
      expect(modelToUpdate.item.properties.slug).toBe(
        "dcdev|dcdev-wat-blarg-1"
      );
      expect(createOrUpdateEntitySettingsSpy).toHaveBeenCalledTimes(1);
    });
    describe("allowedLocations", () => {
      it("processes locations and persists them to settings", async () => {
        const slugSpy = vi
          .spyOn(slugUtils, "getUniqueSlug")
          .mockResolvedValue("dcdev|dcdev-wat-blarg-1" as any);
        const getModelSpy = vi
          .spyOn(getModelUtils, "getModel")
          .mockResolvedValue(DISCUSSION_MODEL as any);
        const updateModelSpy = vi
          .spyOn(updateModelUtils, "updateModel")
          .mockImplementation((m: IModel) => {
            return Promise.resolve(m);
          });
        const arcgisToGeoJSONSpy = vi
          .spyOn(terraformer, "arcgisToGeoJSON")
          .mockReturnValue(geometryTransformed as any);
        const disc: IHubDiscussion = {
          itemControl: "edit",
          id: GUID,
          name: "Hello World",
          tags: ["Transportation"],
          description: "Some longer description",
          slug: "dcdev-wat-blarg",
          orgUrlKey: "dcdev",
          owner: "dcdev_dude",
          type: "Discussion",
          createdDate: new Date(1595878748000),
          createdDateSource: "item.created",
          updatedDate: new Date(1595878750000),
          updatedDateSource: "item.modified",
          thumbnailUrl: "",
          permissions: [],
          catalog: {
            schemaVersion: 1,
          },
          schemaVersion: 1,
          canEdit: false,
          canDelete: false,
          typeKeywords: [],
          entitySettingsId: "an id",
          location: {
            type: "custom",
            geometries: [geometry],
          },
        };
        const chk = await updateDiscussion(disc, requestOptions);
        expect(chk.id).toBe(GUID);
        expect(chk.name).toBe("Hello World");
        expect(chk.description).toBe("Some longer description");
        expect(chk.entitySettingsId).toBe(GUID);
        expect(chk.discussionSettings).toEqual(
          DEFAULT_SETTINGS.settings?.discussions
        );
        // should ensure unique slug
        expect(slugSpy.mock.calls.length).toBe(1);
        expect(slugSpy.mock.calls[0][0]).toEqual(
          { slug: "dcdev|dcdev-wat-blarg", existingId: GUID },
          "should receive slug"
        );
        expect(getModelSpy.mock.calls.length).toBe(1);
        expect(updateModelSpy.mock.calls.length).toBe(1);
        expect(createOrUpdateEntitySettingsSpy.mock.calls.length).toBe(1);
        const modelToUpdate = updateModelSpy.mock.calls[0][0];
        expect(modelToUpdate.item.description).toBe(disc.description);
        expect(modelToUpdate.item.properties.slug).toBe(
          "dcdev|dcdev-wat-blarg-1"
        );
        // should transform location and persist to settings
        expect(arcgisToGeoJSONSpy.mock.calls.length).toBe(1);
        const settingsToUpdate =
          createOrUpdateEntitySettingsSpy.mock.calls[0][2];
        expect(settingsToUpdate).toEqual([geometryTransformed]);
      });
      it("processes locations of type = 'none' and persists them to settings", async () => {
        const slugSpy = vi
          .spyOn(slugUtils, "getUniqueSlug")
          .mockResolvedValue("dcdev|dcdev-wat-blarg-1" as any);
        const getModelSpy = vi
          .spyOn(getModelUtils, "getModel")
          .mockResolvedValue(DISCUSSION_MODEL as any);
        const updateModelSpy = vi
          .spyOn(updateModelUtils, "updateModel")
          .mockImplementation((m: IModel) => {
            return Promise.resolve(m);
          });
        const arcgisToGeoJSONSpy = vi
          .spyOn(terraformer, "arcgisToGeoJSON")
          .mockReturnValue(geometryTransformed as any);
        const disc: IHubDiscussion = {
          itemControl: "edit",
          id: GUID,
          name: "Hello World",
          tags: ["Transportation"],
          description: "Some longer description",
          slug: "dcdev-wat-blarg",
          orgUrlKey: "dcdev",
          owner: "dcdev_dude",
          type: "Discussion",
          createdDate: new Date(1595878748000),
          createdDateSource: "item.created",
          updatedDate: new Date(1595878750000),
          updatedDateSource: "item.modified",
          thumbnailUrl: "",
          permissions: [],
          catalog: {
            schemaVersion: 1,
          },
          schemaVersion: 1,
          canEdit: false,
          canDelete: false,
          typeKeywords: [],
          entitySettingsId: "an id",
          location: {
            type: "none",
          },
        };
        const chk = await updateDiscussion(disc, requestOptions);
        expect(chk.id).toBe(GUID);
        expect(chk.name).toBe("Hello World");
        expect(chk.description).toBe("Some longer description");
        expect(chk.entitySettingsId).toBe(GUID);
        expect(chk.discussionSettings).toEqual(
          DEFAULT_SETTINGS.settings?.discussions
        );
        // should ensure unique slug
        expect(slugSpy.mock.calls.length).toBe(1);
        expect(slugSpy.mock.calls[0][0]).toEqual(
          { slug: "dcdev|dcdev-wat-blarg", existingId: GUID },
          "should receive slug"
        );
        expect(getModelSpy.mock.calls.length).toBe(1);
        expect(updateModelSpy.mock.calls.length).toBe(1);
        expect(createOrUpdateEntitySettingsSpy.mock.calls.length).toBe(1);
        const modelToUpdate = updateModelSpy.mock.calls[0][0];
        expect(modelToUpdate.item.description).toBe(disc.description);
        expect(modelToUpdate.item.properties.slug).toBe(
          "dcdev|dcdev-wat-blarg-1"
        );
        // should transform location and persist to settings
        expect(arcgisToGeoJSONSpy.mock.calls.length).toBe(0);
        const settingsToUpdate =
          createOrUpdateEntitySettingsSpy.mock.calls[0][0];
        expect(settingsToUpdate.discussionSettings.allowedLocations).toBeNull();
      });
      it("processes locations and handles error if thrown", async () => {
        const slugSpy = vi
          .spyOn(slugUtils, "getUniqueSlug")
          .mockResolvedValue("dcdev|dcdev-wat-blarg-1" as any);
        const getModelSpy = vi
          .spyOn(getModelUtils, "getModel")
          .mockResolvedValue(DISCUSSION_MODEL as any);
        const updateModelSpy = vi
          .spyOn(updateModelUtils, "updateModel")
          .mockImplementation((m: IModel) => {
            return Promise.resolve(m);
          });
        const arcgisToGeoJSONSpy = vi
          .spyOn(terraformer, "arcgisToGeoJSON")
          .mockImplementation(() => {
            throw new Error("error message");
          });
        const consoleWarnSpy = vi
          .spyOn(console, "warn")
          .mockImplementation(() => {
            return;
          });
        const disc: IHubDiscussion = {
          itemControl: "edit",
          id: GUID,
          name: "Hello World",
          tags: ["Transportation"],
          description: "Some longer description",
          slug: "dcdev-wat-blarg",
          orgUrlKey: "dcdev",
          owner: "dcdev_dude",
          type: "Discussion",
          createdDate: new Date(1595878748000),
          createdDateSource: "item.created",
          updatedDate: new Date(1595878750000),
          updatedDateSource: "item.modified",
          thumbnailUrl: "",
          permissions: [],
          catalog: {
            schemaVersion: 1,
          },
          schemaVersion: 1,
          canEdit: false,
          canDelete: false,
          typeKeywords: [],
          entitySettingsId: "an id",
          location: {
            type: "custom",
            geometries: [geometry],
          },
        };
        const chk = await updateDiscussion(disc, requestOptions);
        expect(chk.id).toBe(GUID);
        expect(chk.name).toBe("Hello World");
        expect(chk.description).toBe("Some longer description");
        expect(chk.entitySettingsId).toBe(GUID);
        expect(chk.discussionSettings).toEqual(
          DEFAULT_SETTINGS.settings?.discussions
        );
        // should ensure unique slug
        expect(slugSpy.mock.calls.length).toBe(1);
        expect(slugSpy.mock.calls[0][0]).toEqual(
          { slug: "dcdev|dcdev-wat-blarg", existingId: GUID },
          "should receive slug"
        );
        expect(getModelSpy.mock.calls.length).toBe(1);
        expect(updateModelSpy.mock.calls.length).toBe(1);
        expect(createOrUpdateEntitySettingsSpy.mock.calls.length).toBe(1);
        const modelToUpdate = updateModelSpy.mock.calls[0][0];
        expect(modelToUpdate.item.description).toBe(disc.description);
        expect(modelToUpdate.item.properties.slug).toBe(
          "dcdev|dcdev-wat-blarg-1"
        );
        // should transform location and persist to settings
        expect(arcgisToGeoJSONSpy.mock.calls.length).toBe(1);
        const settingsToUpdate =
          createOrUpdateEntitySettingsSpy.mock.calls[0][0];
        expect(settingsToUpdate.discussionSettings.allowedLocations).toEqual(
          null
        );
        expect(consoleWarnSpy.mock.calls.length).toBe(1);
      });
    });
  });
});
