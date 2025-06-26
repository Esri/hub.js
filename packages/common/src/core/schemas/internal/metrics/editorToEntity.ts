import { IPortal } from "@esri/arcgis-rest-portal";
import { cloneObject } from "../../../../util";
import {
  IHubItemEntity,
  IHubItemEntityEditor,
  IHubLocation,
} from "../../../../core/types";
import { truncateSlug } from "../../../../items/_internal/slugs";

// NOTE: this is covered by pre-existing tests for project to entity
/**
 * extract the common ephemeral properties from the editor
 * and then clone into an entity that has all common properties
 * @param editor
 * @param portal
 * @returns
 */
export function editorToEntity(
  editor: IHubItemEntityEditor<IHubItemEntity>,
  portal: IPortal
): IHubItemEntity {
  // 1. remove the ephemeral props we graft onto the editor
  const _slug = editor._slug;
  delete editor._slug;

  // convert back to an entity. Apply any reverse transforms used in
  // of the toEditor method
  const entity = cloneObject(editor) as IHubItemEntity;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  entity.orgUrlKey = editor.orgUrlKey
    ? editor.orgUrlKey
    : portal.urlKey || ("" as string);

  // copy the location extent up one level
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  entity.extent = (editor.location as IHubLocation)?.extent;

  if (_slug) {
    // ensure the slug is truncated
    entity.slug = truncateSlug(_slug, entity.orgUrlKey);
  } else {
    // if no slug is passed in, save an empty string as the slug, so that
    // it is not saved as the orgUrlKey truncated with an empty string
    entity.slug = "";
  }

  return entity;
}
