import { IHubEditableContent } from "../core/types/IHubEditableContent";
import { isMapOrFeatureServerUrl } from "../urls/feature-service-urls";

export function canUseHubDownloadSystem(entity: IHubEditableContent): boolean {
  const isMapOrFeatureService = isMapOrFeatureServerUrl(entity.url);
  const isPublic = entity.access === "public";
  // TODO: use `extendedProps.serverQueryCapability` instead
  const isQueryEnabled = entity.serverQueryCapability;
  return isMapOrFeatureService && isPublic && isQueryEnabled;
}
