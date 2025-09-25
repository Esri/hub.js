import { HubEntity } from "./types/HubEntity";

interface IWithThumbnailUrl {
  thumbnailUrl: string;
}

// stop gap so we don't need to keep propagating
// use of the deprecated thumbnailUrl property
export const getEntityThumbnailUrl = (entity: HubEntity) => {
  return entity.links?.thumbnail || (entity as IWithThumbnailUrl).thumbnailUrl;
};
