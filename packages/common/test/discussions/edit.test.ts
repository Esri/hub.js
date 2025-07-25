import * as portalModule from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as modelUtils from "../../src/models";
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
import { EntitySettingType } from "../../src/discussions/api/types";
import { Polygon } from "geojson";
import { IGeometryInstance } from "../../src/core/types/IGeometryInstance";

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
  describe("deleteDiscussion:", () => {
    it("deletes the item", async () => {
      const removeItemSpy = spyOn(portalModule, "removeItem").and.returnValue(
        Promise.resolve({ success: true })
      );
      const removeSettingSpy = spyOn(
        settingUtils,
        "removeSettingV2"
      ).and.returnValue(Promise.resolve({ success: true }));

      const result = await deleteDiscussion("3ef", {
        authentication: MOCK_AUTH,
      });
      expect(result).toBeUndefined();
      expect(removeSettingSpy.calls.count()).toBe(1);
      expect(removeSettingSpy.calls.argsFor(0)[0].authentication).toBe(
        MOCK_AUTH
      );
      expect(removeItemSpy.calls.count()).toBe(1);
      expect(removeItemSpy.calls.argsFor(0)[0]).toEqual({
        id: "3ef",
        authentication: MOCK_AUTH,
      });
      expect(removeItemSpy.calls.argsFor(0)[0].id).toBe("3ef");
    });
  });

  describe("createDiscussion:", () => {
    it("works with very limited structure", async () => {
      const slugSpy = spyOn(slugUtils, "getUniqueSlug").and.returnValue(
        Promise.resolve("dcdev|hello-world")
      );
      const createSpy = spyOn(modelUtils, "createModel").and.callFake(
        (m: IModel) => {
          const newModel = cloneObject(m);
          newModel.item.id = GUID;
          return Promise.resolve(newModel);
        }
      );
      const createSettingsSpy = spyOn(
        settingUtils,
        "createSettingV2"
      ).and.returnValue(
        Promise.resolve({
          id: GUID,
          ...DEFAULT_SETTINGS,
        })
      );
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
      expect(slugSpy.calls.count()).toBe(1);
      expect(slugSpy.calls.argsFor(0)[0]).toEqual(
        { slug: "dcdev|hello-world" },
        "should recieve slug"
      );
      // should create the item
      expect(createSpy.calls.count()).toBe(1);
      const modelToCreate = createSpy.calls.argsFor(0)[0];
      expect(createSettingsSpy).toHaveBeenCalledTimes(1);
      expect(createSettingsSpy).toHaveBeenCalledWith({
        data: {
          id: GUID,
          type: EntitySettingType.CONTENT,
          settings: {
            discussions: {
              allowedChannelIds: null,
              allowedLocations: null,
            },
          },
        },
        ...requestOptions,
      });
      expect(modelToCreate.item.title).toBe("Hello World");
      expect(modelToCreate.item.type).toBe("Discussion");
      expect(modelToCreate.item.properties.slug).toBe("dcdev|hello-world");
      expect(modelToCreate.item.properties.orgUrlKey).toBe("dcdev");
    });
    it("works with more complete object", async () => {
      // Note: this covers a branch when a slug is passed in
      const slugSpy = spyOn(slugUtils, "getUniqueSlug").and.returnValue(
        Promise.resolve("dcdev|hello-world")
      );
      const createSpy = spyOn(modelUtils, "createModel").and.callFake(
        (m: IModel) => {
          const newModel = cloneObject(m);
          newModel.item.id = GUID;
          return Promise.resolve(newModel);
        }
      );
      const createSettingsSpy = spyOn(
        settingUtils,
        "createSettingV2"
      ).and.returnValue(
        Promise.resolve({
          id: GUID,
          ...DEFAULT_SETTINGS,
        })
      );
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
      expect(slugSpy.calls.count()).toBe(1);
      expect(slugSpy.calls.argsFor(0)[0]).toEqual(
        { slug: "dcdev|hello-world" },
        "should recieve slug"
      );
      // should create the item
      expect(createSpy.calls.count()).toBe(1);
      const modelToCreate = createSpy.calls.argsFor(0)[0];
      expect(createSettingsSpy).toHaveBeenCalledTimes(1);
      expect(createSettingsSpy).toHaveBeenCalledWith({
        data: {
          id: GUID,
          type: EntitySettingType.CONTENT,
          settings: {
            discussions: {
              allowedChannelIds: ["c1"],
              allowedLocations: [geometryTransformed],
            },
          },
        },
        ...requestOptions,
      });
      expect(modelToCreate.item.properties.slug).toBe("dcdev|hello-world");
      expect(modelToCreate.item.properties.orgUrlKey).toBe("dcdev");
    });
    it("coerces allowedChannelIds and allowedLocations to null when they are empty arrays", async () => {
      // Note: this covers a branch when a slug is passed in
      const slugSpy = spyOn(slugUtils, "getUniqueSlug").and.returnValue(
        Promise.resolve("dcdev|hello-world")
      );
      const createSpy = spyOn(modelUtils, "createModel").and.callFake(
        (m: IModel) => {
          const newModel = cloneObject(m);
          newModel.item.id = GUID;
          return Promise.resolve(newModel);
        }
      );
      const createSettingsSpy = spyOn(
        settingUtils,
        "createSettingV2"
      ).and.returnValue(
        Promise.resolve({
          id: GUID,
          ...DEFAULT_SETTINGS,
        })
      );
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
      expect(slugSpy.calls.count()).toBe(1);
      expect(slugSpy.calls.argsFor(0)[0]).toEqual(
        { slug: "dcdev|hello-world" },
        "should recieve slug"
      );
      // should create the item
      expect(createSpy.calls.count()).toBe(1);
      const modelToCreate = createSpy.calls.argsFor(0)[0];
      expect(createSettingsSpy).toHaveBeenCalledTimes(1);
      expect(createSettingsSpy).toHaveBeenCalledWith({
        data: {
          id: GUID,
          type: EntitySettingType.CONTENT,
          settings: {
            discussions: {
              allowedChannelIds: null,
              allowedLocations: null,
            },
          },
        },
        ...requestOptions,
      });
      expect(modelToCreate.item.properties.slug).toBe("dcdev|hello-world");
      expect(modelToCreate.item.properties.orgUrlKey).toBe("dcdev");
    });
  });

  describe("updateDiscussion: ", () => {
    it("updates backing model and creates settings if none exist", async () => {
      const slugSpy = spyOn(slugUtils, "getUniqueSlug").and.returnValue(
        Promise.resolve("dcdev|dcdev-wat-blarg-1")
      );
      const getModelSpy = spyOn(modelUtils, "getModel").and.returnValue(
        Promise.resolve(DISCUSSION_MODEL)
      );
      const updateModelSpy = spyOn(modelUtils, "updateModel").and.callFake(
        (m: IModel) => {
          return Promise.resolve(m);
        }
      );
      const createSettingsSpy = spyOn(
        settingUtils,
        "createSettingV2"
      ).and.returnValue(
        Promise.resolve({
          id: GUID,
          ...DEFAULT_SETTINGS,
        })
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
      expect(slugSpy.calls.count()).toBe(1);
      expect(slugSpy.calls.argsFor(0)[0]).toEqual(
        { slug: "dcdev|dcdev-wat-blarg", existingId: GUID },
        "should receive slug"
      );
      expect(getModelSpy.calls.count()).toBe(1);
      expect(updateModelSpy.calls.count()).toBe(1);
      const modelToUpdate = updateModelSpy.calls.argsFor(0)[0];
      expect(createSettingsSpy).toHaveBeenCalledTimes(1);
      expect(createSettingsSpy).toHaveBeenCalledWith({
        data: {
          id: GUID,
          type: EntitySettingType.CONTENT,
          settings: {
            discussions: {
              allowedChannelIds: null,
              allowedLocations: null,
            },
          },
        },
        ...requestOptions,
      });
      expect(modelToUpdate.item.description).toBe(disc.description);
      expect(modelToUpdate.item.properties.slug).toBe(
        "dcdev|dcdev-wat-blarg-1"
      );
    });
    it("updates backing model and updates settings when settings id exists", async () => {
      const slugSpy = spyOn(slugUtils, "getUniqueSlug").and.returnValue(
        Promise.resolve("dcdev|dcdev-wat-blarg-1")
      );
      const getModelSpy = spyOn(modelUtils, "getModel").and.returnValue(
        Promise.resolve(DISCUSSION_MODEL)
      );
      const updateModelSpy = spyOn(modelUtils, "updateModel").and.callFake(
        (m: IModel) => {
          return Promise.resolve(m);
        }
      );
      const updateSettingsSpy = spyOn(
        settingUtils,
        "updateSettingV2"
      ).and.returnValue(
        Promise.resolve({
          id: GUID,
          ...DEFAULT_SETTINGS,
        })
      );
      spyOn(terraformer, "arcgisToGeoJSON").and.returnValue(
        geometryTransformed
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
      expect(slugSpy.calls.count()).toBe(1);
      expect(slugSpy.calls.argsFor(0)[0]).toEqual(
        { slug: "dcdev|dcdev-wat-blarg", existingId: GUID },
        "should receive slug"
      );
      expect(getModelSpy.calls.count()).toBe(1);
      expect(updateModelSpy.calls.count()).toBe(1);
      expect(updateSettingsSpy).toHaveBeenCalledTimes(1);
      expect(updateSettingsSpy).toHaveBeenCalledWith({
        id: disc.entitySettingsId,
        data: {
          settings: {
            discussions: {
              allowedChannelIds: ["c1"],
              allowedLocations: [geometryTransformed],
            },
          },
        },
        ...requestOptions,
      });
      const modelToUpdate = updateModelSpy.calls.argsFor(0)[0];
      expect(modelToUpdate.item.description).toBe(disc.description);
      expect(modelToUpdate.item.properties.slug).toBe(
        "dcdev|dcdev-wat-blarg-1"
      );
    });
    describe("allowedLocations", () => {
      it("processes locations and persists them to settings", async () => {
        const slugSpy = spyOn(slugUtils, "getUniqueSlug").and.returnValue(
          Promise.resolve("dcdev|dcdev-wat-blarg-1")
        );
        const getModelSpy = spyOn(modelUtils, "getModel").and.returnValue(
          Promise.resolve(DISCUSSION_MODEL)
        );
        const updateModelSpy = spyOn(modelUtils, "updateModel").and.callFake(
          (m: IModel) => {
            return Promise.resolve(m);
          }
        );
        const arcgisToGeoJSONSpy = spyOn(
          terraformer,
          "arcgisToGeoJSON"
        ).and.returnValue(geometryTransformed);
        const updateSettingsSpy = spyOn(
          settingUtils,
          "updateSettingV2"
        ).and.returnValue(
          Promise.resolve({
            id: GUID,
            ...DEFAULT_SETTINGS,
          })
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
        expect(slugSpy.calls.count()).toBe(1);
        expect(slugSpy.calls.argsFor(0)[0]).toEqual(
          { slug: "dcdev|dcdev-wat-blarg", existingId: GUID },
          "should receive slug"
        );
        expect(getModelSpy.calls.count()).toBe(1);
        expect(updateModelSpy.calls.count()).toBe(1);
        expect(updateSettingsSpy.calls.count()).toBe(1);
        const modelToUpdate = updateModelSpy.calls.argsFor(0)[0];
        expect(modelToUpdate.item.description).toBe(disc.description);
        expect(modelToUpdate.item.properties.slug).toBe(
          "dcdev|dcdev-wat-blarg-1"
        );
        // should transform location and persist to settings
        expect(arcgisToGeoJSONSpy.calls.count()).toBe(1);
        const settingsToUpdate = updateSettingsSpy.calls.argsFor(0)[0];
        expect(
          settingsToUpdate.data.settings.discussions.allowedLocations
        ).toEqual([geometryTransformed]);
      });
      it("processes locations of type = 'none' and persists them to settings", async () => {
        const slugSpy = spyOn(slugUtils, "getUniqueSlug").and.returnValue(
          Promise.resolve("dcdev|dcdev-wat-blarg-1")
        );
        const getModelSpy = spyOn(modelUtils, "getModel").and.returnValue(
          Promise.resolve(DISCUSSION_MODEL)
        );
        const updateModelSpy = spyOn(modelUtils, "updateModel").and.callFake(
          (m: IModel) => {
            return Promise.resolve(m);
          }
        );
        const arcgisToGeoJSONSpy = spyOn(
          terraformer,
          "arcgisToGeoJSON"
        ).and.returnValue(geometryTransformed);
        const updateSettingsSpy = spyOn(
          settingUtils,
          "updateSettingV2"
        ).and.returnValue(
          Promise.resolve({
            id: GUID,
            ...DEFAULT_SETTINGS,
          })
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
        expect(slugSpy.calls.count()).toBe(1);
        expect(slugSpy.calls.argsFor(0)[0]).toEqual(
          { slug: "dcdev|dcdev-wat-blarg", existingId: GUID },
          "should receive slug"
        );
        expect(getModelSpy.calls.count()).toBe(1);
        expect(updateModelSpy.calls.count()).toBe(1);
        expect(updateSettingsSpy.calls.count()).toBe(1);
        const modelToUpdate = updateModelSpy.calls.argsFor(0)[0];
        expect(modelToUpdate.item.description).toBe(disc.description);
        expect(modelToUpdate.item.properties.slug).toBe(
          "dcdev|dcdev-wat-blarg-1"
        );
        // should transform location and persist to settings
        expect(arcgisToGeoJSONSpy.calls.count()).toBe(0);
        const settingsToUpdate = updateSettingsSpy.calls.argsFor(0)[0];
        expect(
          settingsToUpdate.data.settings.discussions.allowedLocations
        ).toBeNull();
      });
      it("processes locations and handles error if thrown", async () => {
        const slugSpy = spyOn(slugUtils, "getUniqueSlug").and.returnValue(
          Promise.resolve("dcdev|dcdev-wat-blarg-1")
        );
        const getModelSpy = spyOn(modelUtils, "getModel").and.returnValue(
          Promise.resolve(DISCUSSION_MODEL)
        );
        const updateModelSpy = spyOn(modelUtils, "updateModel").and.callFake(
          (m: IModel) => {
            return Promise.resolve(m);
          }
        );
        const arcgisToGeoJSONSpy = spyOn(
          terraformer,
          "arcgisToGeoJSON"
        ).and.throwError("error message");
        const consoleWarnSpy = spyOn(console, "warn").and.callFake(() => {
          return;
        });
        const updateSettingsSpy = spyOn(
          settingUtils,
          "updateSettingV2"
        ).and.returnValue(
          Promise.resolve({
            id: GUID,
            ...DEFAULT_SETTINGS,
          })
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
        expect(slugSpy.calls.count()).toBe(1);
        expect(slugSpy.calls.argsFor(0)[0]).toEqual(
          { slug: "dcdev|dcdev-wat-blarg", existingId: GUID },
          "should receive slug"
        );
        expect(getModelSpy.calls.count()).toBe(1);
        expect(updateModelSpy.calls.count()).toBe(1);
        expect(updateSettingsSpy.calls.count()).toBe(1);
        const modelToUpdate = updateModelSpy.calls.argsFor(0)[0];
        expect(modelToUpdate.item.description).toBe(disc.description);
        expect(modelToUpdate.item.properties.slug).toBe(
          "dcdev|dcdev-wat-blarg-1"
        );
        // should transform location and persist to settings
        expect(arcgisToGeoJSONSpy.calls.count()).toBe(1);
        const settingsToUpdate = updateSettingsSpy.calls.argsFor(0)[0];
        expect(
          settingsToUpdate.data.settings.discussions.allowedLocations
        ).toEqual(null);
        expect(consoleWarnSpy.calls.count()).toBe(1);
      });
    });
  });
});
