import { IHubItemEntity } from "../../core/types/IHubItemEntity";
import { IHubRequestOptions } from "../../hub-types";
import { getUniqueSlug, setSlugKeyword } from "../slugs";
import { truncateSlug } from "./slugs";

// NOTE: this mutates the entity that is passed in
export const ensureUniqueEntitySlug = async (
  entity: IHubItemEntity,
  requestOptions: IHubRequestOptions
): Promise<IHubItemEntity> => {
  let currentSlug: string = entity.slug as string;
  const orgUrlKey = (entity.orgUrlKey as string).toLowerCase();
  // if we got the entity from the entity editor, the slug will already have the orgUrlKey prefix
  // but it might not have been edited with the entity editor...
  // ie a dev might have just set the slug to "my-slug" and not "org|my-slug" (like i did)
  if (currentSlug && !currentSlug.startsWith(`${orgUrlKey}|`)) {
    currentSlug = truncateSlug(currentSlug, orgUrlKey);
  }
  // verify that the slug is unique
  const { id: existingId } = entity;
  const slugInfo = existingId
    ? { slug: currentSlug, existingId }
    : { slug: currentSlug };
  entity.slug = await getUniqueSlug(slugInfo, requestOptions);
  // add slug to keywords
  entity.typeKeywords = setSlugKeyword(entity.typeKeywords, entity.slug);
  return entity;
};
