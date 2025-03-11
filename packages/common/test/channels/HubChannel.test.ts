import { IArcGISContext } from "../../src/types/IArcGISContext";
import { HubChannel } from "../../src/channels";
import {
  IHubChannel,
  IHubChannelEditor,
} from "../../src/core/types/IHubChannel";
import * as editModule from "../../src/channels/edit";
import * as getEditorConfigModule from "../../src/core/schemas/getEditorConfig";
import * as transformEntityToEditorModule from "../../src/channels/_internal/transformEntityToEditor";
import * as transformEditorToEntityModule from "../../src/channels/_internal/transformEditorToEntity";
import * as buildDefaultChannelModule from "../../src/channels/_internal/buildDefaultChannel";
import * as fetchHubChannelModule from "../../src/channels/fetch";
import { IEditorConfig } from "../../src/core/schemas/types";

describe("HubChannel", () => {
  const entity: IHubChannel = {
    canDelete: true,
    canEdit: true,
    orgId: "orgId123",
  } as IHubChannel;
  const context: IArcGISContext = {
    currentUser: {
      orgId: "orgId123",
    },
  } as IArcGISContext;

  describe("canEdit", () => {
    it("should return true when entity.canEdit is true", () => {
      const instance = new HubChannel({ ...entity, canEdit: true }, context);
      expect(instance.canEdit).toBe(true);
    });
    it("should return false when entity.canEdit is false", () => {
      const instance = new HubChannel({ ...entity, canEdit: false }, context);
      expect(instance.canEdit).toBe(false);
    });
  });
  describe("canDelete", () => {
    it("should return true when entity.canDelete is true", () => {
      const instance = new HubChannel({ ...entity, canDelete: true }, context);
      expect(instance.canDelete).toBe(true);
    });
    it("should return false when entity.canDelete is false", () => {
      const instance = new HubChannel({ ...entity, canDelete: false }, context);
      expect(instance.canDelete).toBe(false);
    });
  });
  describe("orgId", () => {
    it("should return entity.orgId", () => {
      const instance = new HubChannel(entity, context);
      expect(instance.orgId).toEqual("orgId123");
    });
  });
  describe("toJson", () => {
    it("should throw an error when isDestroyed is true", () => {
      const instance = new HubChannel(entity, context);
      /* tslint:disable-next-line */
      instance["isDestroyed"] = true;
      try {
        instance.toJson();
        fail("did not reject");
      } catch (e) {
        expect((e as Error).message).toEqual(
          "HubChannel is already destroyed."
        );
      }
    });
    it("should return a clone of the entity", () => {
      const instance = new HubChannel(entity, context);
      /* tslint:disable-next-line */
      instance["isDestroyed"] = false;
      const result = instance.toJson();
      expect(result).toEqual(entity);
    });
  });
  describe("update", () => {
    it("should throw an error when isDestroyed is true", () => {
      const changes: Partial<IHubChannel> = {
        name: "edited",
      };
      const instance = new HubChannel(entity, context);
      /* tslint:disable-next-line */
      instance["isDestroyed"] = true;
      try {
        instance.update(changes);
        fail("did not reject");
      } catch (e) {
        expect((e as Error).message).toEqual(
          "HubChannel is already destroyed."
        );
      }
    });
    it("should update the entity with the changes", () => {
      const changes: Partial<IHubChannel> = {
        name: "edited",
      };
      const instance = new HubChannel(entity, context);
      instance.update(changes);
      /* tslint:disable-next-line */
      expect(instance["entity"]).toEqual({
        ...entity,
        ...changes,
      });
    });
  });
  describe("save", () => {
    it("should throw an error when isDestroyed is true", async () => {
      const channel: IHubChannel = {
        id: "31c",
      } as IHubChannel;
      const createHubChannelSpy = spyOn(
        editModule,
        "createHubChannel"
      ).and.returnValue(Promise.resolve(channel));
      const updateHubChannelSpy = spyOn(
        editModule,
        "updateHubChannel"
      ).and.returnValue(Promise.resolve(channel));
      const instance = new HubChannel(entity, context);
      /* tslint:disable-next-line */
      instance["isDestroyed"] = true;
      try {
        await instance.save();
        fail("did not reject");
      } catch (e) {
        expect((e as Error).message).toEqual(
          "HubChannel is already destroyed."
        );
        expect(createHubChannelSpy).not.toHaveBeenCalled();
        expect(updateHubChannelSpy).not.toHaveBeenCalled();
      }
    });
    it("should call updateHubChannel", async () => {
      const channel: IHubChannel = {
        id: "31c",
        updatedDate: new Date(1741107657268),
      } as IHubChannel;
      const updatedChannel: IHubChannel = {
        id: "31c",
        updatedDate: new Date(1741107658000),
      } as IHubChannel;
      const createHubChannelSpy = spyOn(editModule, "createHubChannel");
      const updateHubChannelSpy = spyOn(
        editModule,
        "updateHubChannel"
      ).and.returnValue(Promise.resolve(updatedChannel));
      const data: Partial<IHubChannel> = {
        name: "edited",
      };
      const instance = new HubChannel(channel, context);
      await instance.save();
      expect(createHubChannelSpy).not.toHaveBeenCalled();
      expect(updateHubChannelSpy).toHaveBeenCalledTimes(1);
      expect(updateHubChannelSpy).toHaveBeenCalledWith(channel, context);
      /* tslint:disable-next-line */
      expect(instance["entity"]).toEqual(updatedChannel);
    });
    it("should call createHubChannel", async () => {
      const channel: IHubChannel = {
        updatedDate: new Date(1741107657268),
      } as IHubChannel;
      const createdChannel: IHubChannel = {
        id: "31c",
        updatedDate: new Date(1741107658000),
      } as IHubChannel;
      const createHubChannelSpy = spyOn(
        editModule,
        "createHubChannel"
      ).and.returnValue(Promise.resolve(createdChannel));
      const updateHubChannelSpy = spyOn(editModule, "updateHubChannel");
      const data: Partial<IHubChannel> = {
        name: "edited",
      };
      const instance = new HubChannel(channel, context);
      await instance.save();
      expect(createHubChannelSpy).toHaveBeenCalledTimes(1);
      expect(createHubChannelSpy).toHaveBeenCalledWith(channel, context);
      expect(updateHubChannelSpy).not.toHaveBeenCalled();
      /* tslint:disable-next-line */
      expect(instance["entity"]).toEqual(createdChannel);
    });
  });
  describe("delete", () => {
    it("should throw an error when isDestroyed is true", async () => {
      const deleteHubChannelSpy = spyOn(editModule, "deleteHubChannel");
      const entityWithId = { ...entity, id: "31c" };
      const instance = new HubChannel(entityWithId, context);
      /* tslint:disable-next-line */
      instance["isDestroyed"] = true;
      try {
        await instance.delete();
        fail("did not reject");
      } catch (e) {
        expect((e as Error).message).toEqual(
          "HubChannel is already destroyed."
        );
        expect(deleteHubChannelSpy).not.toHaveBeenCalled();
      }
    });
    it("should call deleteHubChannel", async () => {
      const deleteHubChannelSpy = spyOn(
        editModule,
        "deleteHubChannel"
      ).and.returnValue(Promise.resolve());
      const entityWithId = { ...entity, id: "31c" };
      const instance = new HubChannel(entityWithId, context);
      await instance.delete();
      expect(deleteHubChannelSpy).toHaveBeenCalledTimes(1);
      expect(deleteHubChannelSpy).toHaveBeenCalledWith(
        entityWithId.id,
        context
      );
      /* tslint:disable-next-line */
      expect(instance["isDestroyed"]).toBe(true);
    });
  });
  describe("convertToCardModel", () => {
    it("should throw an error", () => {
      try {
        const instance = new HubChannel(entity, context);
        instance.convertToCardModel({});
        fail("should have thrown");
      } catch (e) {
        expect((e as Error).message).toEqual("not implemented");
      }
    });
  });
  describe("getEditorConfig", () => {
    it("should call getEditorConfig and resolve the IEditorConfig", async () => {
      const editor: IEditorConfig = {} as IEditorConfig;
      const getEditorConfigSpy = spyOn(
        getEditorConfigModule,
        "getEditorConfig"
      ).and.returnValue(editor);
      const instance = new HubChannel(entity, context);
      const result = await instance.getEditorConfig(
        "myI18nScope",
        "hub:channel:create"
      );
      expect(result).toEqual(editor);
      expect(getEditorConfigSpy).toHaveBeenCalledTimes(1);
      expect(getEditorConfigSpy).toHaveBeenCalledWith(
        "myI18nScope",
        "hub:channel:create",
        entity,
        context
      );
    });
  });
  describe("toEditor", () => {
    it("should call transformEntityToEditor and resolve a IHubChannelEditor object", async () => {
      const editor: IHubChannelEditor = {
        id: "31c",
        name: "My channel",
        blockWords: "baad,baaaad",
        allowAsAnonymous: true,
        publicConfigs: [],
        orgConfigs: [],
        groupConfigs: [],
        userConfigs: [],
        ownerConfigs: [],
      };
      const transformEntityToEditorSpy = spyOn(
        transformEntityToEditorModule,
        "transformEntityToEditor"
      ).and.returnValue(editor);
      const instance = new HubChannel(entity, context);
      const result = await instance.toEditor({}, []);
      expect(result).toEqual(editor);
      expect(transformEntityToEditorSpy).toHaveBeenCalledTimes(1);
      expect(transformEntityToEditorSpy).toHaveBeenCalledWith(entity, context);
    });
  });
  describe("fromEditor", () => {
    it("should call transformEntityToEditor and resolve a IHubChannelEditor object", async () => {
      const editor: IHubChannelEditor = {
        id: "31c",
        name: "My channel",
        blockWords: "baad,baaaad",
        allowAsAnonymous: true,
        publicConfigs: [],
        orgConfigs: [],
        groupConfigs: [],
        userConfigs: [],
        ownerConfigs: [],
      };
      const transformedEntity: IHubChannel = {
        updatedDate: new Date(1741107657268),
      } as IHubChannel;
      const transformEditorToEntitySpy = spyOn(
        transformEditorToEntityModule,
        "transformEditorToEntity"
      ).and.returnValue(transformedEntity);
      const instance = new HubChannel(entity, context);
      const saveSpy = spyOn(instance, "save").and.returnValue(
        Promise.resolve()
      );
      const result = await instance.fromEditor(editor);
      expect(result).toEqual({
        ...entity,
        ...transformedEntity,
      });
      expect(transformEditorToEntitySpy).toHaveBeenCalledTimes(1);
      expect(transformEditorToEntitySpy).toHaveBeenCalledWith(editor);
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });
  });
  describe("fromJson", () => {
    it("should apply defaults and return a new HubChannnel", () => {
      const channel: Partial<IHubChannel> = {
        name: "My channel",
        blockWords: ["baad", "baaad"],
      };
      const buildDefaultChannelSpy = spyOn(
        buildDefaultChannelModule,
        "buildDefaultChannel"
      ).and.returnValue({
        name: "",
        blockWords: [],
        allowAsAnonymous: true,
        permissions: [],
      });
      const result = HubChannel.fromJson(channel, context);
      expect(buildDefaultChannelSpy).toHaveBeenCalledTimes(1);
      expect(buildDefaultChannelSpy).toHaveBeenCalledWith(
        context.currentUser.orgId
      );
      expect(result instanceof HubChannel).toBe(true);
      /* tslint:disable-next-line */
      expect(result["entity"]).toEqual({
        name: "My channel",
        blockWords: ["baad", "baaad"],
        allowAsAnonymous: true,
        permissions: [],
      } as IHubChannel);
    });
  });
  describe("create", () => {
    it("should apply defaults and return an instance", async () => {
      const input: Partial<IHubChannel> = {
        name: "My channel",
      };
      const defaults: Partial<IHubChannel> = {
        name: "",
        blockWords: [],
        allowAsAnonymous: false,
        permissions: [],
        orgId: "orgId123",
      };
      const merged: IHubChannel = {
        ...defaults,
        ...input,
      } as IHubChannel;
      const instance = new HubChannel(merged, context);
      const fromJsonSpy = spyOn(HubChannel, "fromJson").and.returnValue(
        instance
      );
      const buildDefaultChannelSpy = spyOn(
        buildDefaultChannelModule,
        "buildDefaultChannel"
      ).and.returnValue(defaults);
      const saveSpy = spyOn(instance, "save");
      const result = await HubChannel.create(input, context);
      expect(result instanceof HubChannel).toBe(true);
      /* tslint:disable-next-line */
      expect(result["entity"]).toEqual(merged);
      expect(buildDefaultChannelSpy).toHaveBeenCalledTimes(1);
      expect(buildDefaultChannelSpy).toHaveBeenCalledWith(
        context.currentUser.orgId
      );
      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(fromJsonSpy).toHaveBeenCalledWith(merged, context);
      expect(saveSpy).not.toHaveBeenCalled();
    });
    it("should additionally call save", async () => {
      const input: Partial<IHubChannel> = {
        name: "My channel",
      };
      const defaults: Partial<IHubChannel> = {
        name: "",
        blockWords: [],
        allowAsAnonymous: false,
        permissions: [],
        orgId: "orgId123",
      };
      const merged: IHubChannel = {
        ...defaults,
        ...input,
      } as IHubChannel;
      const instance = new HubChannel(merged, context);
      const fromJsonSpy = spyOn(HubChannel, "fromJson").and.returnValue(
        instance
      );
      const buildDefaultChannelSpy = spyOn(
        buildDefaultChannelModule,
        "buildDefaultChannel"
      ).and.returnValue(defaults);
      const saveSpy = spyOn(instance, "save");
      const result = await HubChannel.create(input, context, true);
      expect(result instanceof HubChannel).toBe(true);
      /* tslint:disable-next-line */
      expect(result["entity"]).toEqual(merged);
      expect(buildDefaultChannelSpy).toHaveBeenCalledTimes(1);
      expect(buildDefaultChannelSpy).toHaveBeenCalledWith(
        context.currentUser.orgId
      );
      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(fromJsonSpy).toHaveBeenCalledWith(merged, context);
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });
  });
  describe("fetch", () => {
    it("should reject with an error", async () => {
      const fetchHubChannelSpy = spyOn(
        fetchHubChannelModule,
        "fetchHubChannel"
      ).and.returnValue(Promise.reject(new Error("fail")));
      const fromJsonSpy = spyOn(HubChannel, "fromJson");
      try {
        await HubChannel.fetch("channelId1", context);
        fail("should have thrown");
      } catch (e) {
        expect(fetchHubChannelSpy).toHaveBeenCalledTimes(1);
        expect(fetchHubChannelSpy).toHaveBeenCalledWith("channelId1", context);
        expect(fromJsonSpy).not.toHaveBeenCalled();
        expect((e as Error).message).toEqual("Channel not found.");
      }
    });
    it("call fetchHubChannel and resolve a HubChannel instance", async () => {
      const fetchHubChannelSpy = spyOn(
        fetchHubChannelModule,
        "fetchHubChannel"
      ).and.returnValue(Promise.resolve(entity));
      const instance = new HubChannel(entity, context);
      const fromJsonSpy = spyOn(HubChannel, "fromJson").and.returnValue(
        instance
      );
      const result = await HubChannel.fetch("channelId1", context);
      expect(fetchHubChannelSpy).toHaveBeenCalledTimes(1);
      expect(fetchHubChannelSpy).toHaveBeenCalledWith("channelId1", context);
      expect(fromJsonSpy).toHaveBeenCalledTimes(1);
      expect(fromJsonSpy).toHaveBeenCalledWith(entity, context);
      /* tslint:disable-next-line */
      expect(result["entity"]).toEqual(entity);
    });
  });
});
