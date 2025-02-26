import { IHubItemEntity } from "../../core";
import { IHubRequestOptions } from "../../hub-types";
import { getUniqueSlug, setSlugKeyword } from "../slugs";

// NOTE: this mutates the entity that is passed in
export const ensureUniqueEntitySlug = async (
  entity: IHubItemEntity,
  requestOptions: IHubRequestOptions
): Promise<IHubItemEntity> => {
  // verify that the slug is unique
  const { id: existingId, slug } = entity;
  const slugInfo = existingId ? { slug, existingId } : { slug };
  entity.slug = await getUniqueSlug(slugInfo, requestOptions);
  // add slug to keywords
  entity.typeKeywords = setSlugKeyword(entity.typeKeywords, entity.slug);
  return entity;
};
