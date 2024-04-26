import { HubEntity } from "../../core/types/HubEntity";

export function isServiceEntity(entity: HubEntity): boolean {
  return (
    entity.type === "Feature Service" ||
    entity.type === "Map Service" ||
    entity.type === "Image Service"
  );
}
