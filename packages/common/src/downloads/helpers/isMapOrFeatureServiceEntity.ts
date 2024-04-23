import { HubEntity } from "../../core/types/HubEntity";

export function isMapOrFeatureServiceEntity(entity: HubEntity): boolean {
  return entity.type === "Feature Service" || entity.type === "Map Service";
}
