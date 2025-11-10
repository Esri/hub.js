import { describe, it, expect, vi } from "vitest";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IHubItemEntity } from "../../../../src/core/types/IHubItemEntity";
import {
  getDefaultImageEntityThumbnail,
  getThumbnailUiSchemaElement,
} from "../../../../src/core/schemas/internal/getThumbnailUiSchemaElement";
import { HubEntityType } from "../../../../src/core/types/HubEntityType";
import * as getCdnAssetUrlModule from "../../../../src/urls/get-cdn-asset-url";
import { IItem } from "@esri/arcgis-rest-portal";
import * as getItemDataUrlModule from "../../../../src/urls/get-item-data-url";

describe("getThumbnailUiSchemaElement:", () => {
  it("returns schema when the entity has a thumbnail", () => {
    const entity: IHubItemEntity = {
      thumbnail: "thumbnail/my-thumbnail.png",
      itemControl: "",
      owner: "",
      schemaVersion: 0,
      tags: [],
      canEdit: false,
      canDelete: false,
      id: "aef",
      name: "Test",
      createdDate: new Date(),
      createdDateSource: "item.created",
      updatedDate: new Date(),
      updatedDateSource: "item.modified",
      type: "Feature Service",
    };
    const requestOptions = {} as IRequestOptions;
    const uiSchema = getThumbnailUiSchemaElement(
      "scope",
      entity.thumbnail as unknown as string,
      entity.thumbnailUrl as unknown as string,
      entity.type as HubEntityType,
      requestOptions
    );
    expect(uiSchema.length).toBe(1);
  });

  it("returns schema when the entity has no thumbnail", () => {
    const entity: IHubItemEntity = {
      itemControl: "",
      owner: "",
      schemaVersion: 0,
      tags: [],
      canEdit: false,
      canDelete: false,
      id: "aef",
      name: "Test",
      createdDate: new Date(),
      createdDateSource: "item.created",
      updatedDate: new Date(),
      updatedDateSource: "item.modified",
      type: "Feature Service",
    };
    const requestOptions = {} as IRequestOptions;
    const uiSchema = getThumbnailUiSchemaElement(
      "scope",
      entity.thumbnail as unknown as string,
      entity.thumbnailUrl as unknown as string,
      entity.type as HubEntityType,
      requestOptions
    );
    expect(uiSchema.length).toBe(1);
  });

  it("returns schema when the entity has the default thumbnail", () => {
    const entity: IHubItemEntity = {
      thumbnail: "thumbnail/ago_downloaded.png",
      itemControl: "",
      owner: "",
      schemaVersion: 0,
      tags: [],
      canEdit: false,
      canDelete: false,
      id: "aef",
      name: "Test",
      createdDate: new Date(),
      createdDateSource: "item.created",
      updatedDate: new Date(),
      updatedDateSource: "item.modified",
      type: "Feature Service",
    };
    const requestOptions = {} as IRequestOptions;
    const uiSchema = getThumbnailUiSchemaElement(
      "scope",
      entity.thumbnail,
      entity.thumbnailUrl as unknown as string,
      entity.type as HubEntityType,
      requestOptions
    );
    expect(uiSchema.length).toBe(1);
  });

  it("sets default thumbnail when available", () => {
    const defaultImageUrl = "www.example.com/assets/discussion";
    const getCdnAssetUrlSpy = vi
      .spyOn(getCdnAssetUrlModule, "getCdnAssetUrl")
      .mockReturnValue(defaultImageUrl);
    const entity: IHubItemEntity = {
      thumbnail: "thumbnail/my-thumbnail.png",
      itemControl: "",
      owner: "",
      schemaVersion: 0,
      tags: [],
      canEdit: false,
      canDelete: false,
      id: "aef",
      name: "Test",
      createdDate: new Date(),
      createdDateSource: "item.created",
      updatedDate: new Date(),
      updatedDateSource: "item.modified",
      type: "discussion",
    };
    const requestOptions = {} as IRequestOptions;
    const uiSchema = getThumbnailUiSchemaElement(
      "scope",
      entity.thumbnail as unknown as string,
      entity.thumbnailUrl as unknown as string,
      entity.type as HubEntityType,
      requestOptions
    );
    expect(getCdnAssetUrlSpy).toHaveBeenCalled();
    expect(uiSchema[0].options?.defaultImgUrl).toBe(defaultImageUrl);
  });
});

describe("getDefaultImageEntityThumbnail:", () => {
  it("returns undefined for non-Image content", () => {
    const result = getDefaultImageEntityThumbnail(
      { type: "Web Map" } as any,
      {} as any
    );
    expect(result).toBeUndefined();
  });

  it("returns data url for Image content", async () => {
    const getItemDataUrlSpy = vi
      .spyOn(getItemDataUrlModule, "getItemDataUrl")
      .mockResolvedValue("the data url");
    const result = await getDefaultImageEntityThumbnail(
      { id: "abc", access: "private", type: "Image" },
      { hubRequestOptions: {} } as any
    );
    expect(getItemDataUrlSpy).toHaveBeenCalledWith(
      { id: "abc", access: "private" } as IItem,
      {},
      undefined
    );
    expect(result).toBe("the data url");
  });
});
