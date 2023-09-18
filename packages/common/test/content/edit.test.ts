import * as portalModule from "@esri/arcgis-rest-portal";
import * as featureLayerModule from "@esri/arcgis-rest-feature-layer";
import * as adminModule from "@esri/arcgis-rest-service-admin";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as modelUtils from "../../src/models";
import { IModel } from "../../src/types";
import { IHubEditableContent } from "../../src/core/types";
import {
  createContent,
  deleteContent,
  updateContent,
} from "../../src/content/edit";
import { cloneObject } from "../../src/util";

const GUID = "9b77674e43cf4bbd9ecad5189b3f1fdc";

describe("content editing:", () => {
  describe("create content:", () => {
    it("converts to a model and creates the item", async () => {
      const createSpy = spyOn(modelUtils, "createModel").and.callFake(
        (m: IModel) => {
          const newModel = cloneObject(m);
          newModel.item.id = GUID;
          return Promise.resolve(newModel);
        }
      );
      const chk = await createContent(
        { name: "Hello World", orgUrlKey: "dcdev" },
        { authentication: MOCK_AUTH }
      );

      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      // should create the item
      expect(createSpy.calls.count()).toBe(1);
      const modelToCreate = createSpy.calls.argsFor(0)[0];
      expect(modelToCreate.item.title).toBe("Hello World");
      // expect(modelToCreate.item.type).toBe("Hub Content");
      expect(modelToCreate.item.properties.orgUrlKey).toBe("dcdev");
    });
  });
  describe("update content:", () => {
    let getItemSpy: jasmine.Spy;
    let getServiceSpy: jasmine.Spy;
    let updateModelSpy: jasmine.Spy;
    let updateServiceSpy: jasmine.Spy;
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
    });
    afterEach(() => {
      getItemSpy.calls.reset();
      getServiceSpy.calls.reset();
      updateModelSpy.calls.reset();
      updateServiceSpy.calls.reset();
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
      };
      const chk = await updateContent(content, { authentication: MOCK_AUTH });
      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(chk.description).toBe("Some longer description");
      expect(getItemSpy.calls.count()).toBe(1);
      expect(updateModelSpy.calls.count()).toBe(1);
      const modelToUpdate = updateModelSpy.calls.argsFor(0)[0];
      expect(modelToUpdate.item.description).toBe(content.description);
      expect(modelToUpdate.item.properties.boundary).toBe("none");
      // No service is associated with Hub Initiatives
      expect(getServiceSpy).not.toHaveBeenCalled();
      expect(updateServiceSpy).not.toHaveBeenCalled();
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
      };
      const chk = await updateContent(content, { authentication: MOCK_AUTH });
      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(chk.description).toBe("Some longer description");
      expect(getItemSpy.calls.count()).toBe(1);
      expect(updateModelSpy.calls.count()).toBe(1);
      const modelToUpdate = updateModelSpy.calls.argsFor(0)[0];
      expect(modelToUpdate.item.description).toBe(content.description);
      expect(modelToUpdate.item.properties.boundary).toBe("item");
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
      };
      const chk = await updateContent(content, { authentication: MOCK_AUTH });
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
        { capabilities: "Query" };
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
      };
      const chk = await updateContent(content, { authentication: MOCK_AUTH });
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
