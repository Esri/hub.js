import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IHubItemEntity } from "../../../../src";
import { getThumbnailUiSchemaElement } from "../../../../src/core/schemas/internal/getThumbnailUiSchemaElement";
import { HubEntityType } from "../../../../dist/types/core/types/HubEntityType";
import * as urlUtils from "../../../../src/urls";
import { UiSchemaRuleEffects } from "../../../../src/core/schemas/types";

describe("getThumbnailUiSchemaElement:", () => {
  it("excludes the default thumbnail notice if the entity has a thumbnail", () => {
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
    expect(uiSchema.length).toBe(2);
    expect(uiSchema[1].rules).toEqual([
      {
        effect: UiSchemaRuleEffects.SHOW,
        conditions: [false],
      },
    ]);
  });

  it("includes the default thumbnail notice if the entity has no thumbnail", () => {
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
    expect(uiSchema.length).toBe(2);
    expect(uiSchema[1].rules).toEqual([
      {
        effect: UiSchemaRuleEffects.SHOW,
        conditions: [true],
      },
    ]);
  });

  it("includes the default thumbnail notice if the entity has the default thumbnail", () => {
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
      entity.thumbnail as string,
      entity.thumbnailUrl as unknown as string,
      entity.type as HubEntityType,
      requestOptions
    );
    expect(uiSchema.length).toBe(2);
    expect(uiSchema[1].rules).toEqual([
      {
        effect: UiSchemaRuleEffects.SHOW,
        conditions: [true],
      },
    ]);
  });

  it("sets default thumbnail when available", () => {
    const defaultImageUrl = "www.example.com/assets/discussion";
    const getCdnAssetUrlSpy = spyOn(urlUtils, "getCdnAssetUrl").and.returnValue(
      defaultImageUrl
    );
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
