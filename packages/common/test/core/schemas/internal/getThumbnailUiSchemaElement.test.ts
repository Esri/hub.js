import { IHubItemEntity } from "../../../../src";
import { getThumbnailUiSchemaElement } from "../../../../src/core/schemas/internal/getThumbnailUiSchemaElement";

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
    const uiSchema = getThumbnailUiSchemaElement("scope", entity);
    expect(uiSchema.options?.messages.length).toBe(0);
  });
  // write a test that asserts the default thumbnail notice is included if the entity has no thumbnail
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
    const uiSchema = getThumbnailUiSchemaElement("scope", entity);
    expect(uiSchema.options?.messages.length).toBe(1);
  });
  // write a test that asserts the default thumbnail notice is included if the entity has the default thumbnail
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
    const uiSchema = getThumbnailUiSchemaElement("scope", entity);
    expect(uiSchema.options?.messages.length).toBe(1);
  });
});
