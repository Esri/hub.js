import { extentToBBox, getGeographicOrgExtent } from "../../../extent";
import { IHubRequestOptions } from "../../../types";
import { getTypeFromEntity } from "../../getTypeFromEntity";

import { ConfigurableEntity } from "./ConfigurableEntity";
import { IHubLocation, IHubLocationOption } from "../../types/IHubLocation";
import { IExtent } from "@esri/arcgis-rest-types";

/**
 * Construct the dynamic location picker options with the entity's
 * configured location using the following logic:
 *
 * 1. If there is no entity (e.g. we're creating an entity),
 * select the "custom" option by default
 * 2. Else if there is no location set on the entity, select the
 * "none" option
 * 3. Else if the entity has a location and it's the same as the
 * current option, select it and update the option with the entity's
 * location
 */
export async function getLocationOptions(
  entity: ConfigurableEntity,
  portalName: string,
  hubRequestOptions: IHubRequestOptions
): Promise<IHubLocationOption[]> {
  const typeFromEntity: any = getTypeFromEntity(entity);

  switch (typeFromEntity) {
    case "content":
      return getContentLocationOptions(entity, hubRequestOptions);
    default:
      return getDefaultLocationOptions(entity, portalName, hubRequestOptions);
  }
}

// TODO: Refactor parameters, they are icky gross
// TODO: Maybe move these to outside of core and into respective entities

export async function getContentLocationOptions(
  entity: ConfigurableEntity,
  hubRequestOptions: IHubRequestOptions
): Promise<IHubLocationOption[]> {
  const defaultExtent: IExtent = await getGeographicOrgExtent(
    hubRequestOptions
  );
  const location: IHubLocation = entity.location;
  return (
    [
      {
        label: "{{shared.fields.location.none:translate}}",
        location: { type: "none" },
      },
      {
        label: "{{shared.fields.location.itemExtent:translate}}",
        entityType: "content",
        location: {
          type: "custom",
          // TODO: Add custom bbox option here
          // TODO: Remove "Add another location?" notification that appears when selecting a location
          extent: extentToBBox(defaultExtent),
          spatialReference: defaultExtent.spatialReference,
        },
      },
    ] as IHubLocationOption[]
  ).map((option) => {
    // If this is a new entity, select the custom option by default
    if (!entity.id && option.location.type === "custom") {
      option.selected = true;
    } else if (entity.id && !location && option.location.type === "none") {
      option.selected = true;
    } else if (location?.type === option.location.type) {
      option.location = location;
      option.selected = true;
    }

    return option;
  });
}

export async function getDefaultLocationOptions(
  entity: ConfigurableEntity,
  portalName: string,
  hubRequestOptions: IHubRequestOptions
): Promise<IHubLocationOption[]> {
  const defaultExtent: IExtent = await getGeographicOrgExtent(
    hubRequestOptions
  );
  const location: IHubLocation = entity.location;
  return (
    [
      {
        label: "{{shared.fields.location.none:translate}}",
        location: { type: "none" },
      },
      {
        label: "{{shared.fields.location.org:translate}}",
        description: portalName,
        location: {
          type: "org",
          extent: extentToBBox(defaultExtent),
          spatialReference: defaultExtent.spatialReference,
        },
      },
      {
        label: "{{shared.fields.location.custom:translate}}",
        description: "{{shared.fields.location.customDescription:translate}}",
        entityType: getTypeFromEntity(entity),
        location: {
          type: "custom",
          spatialReference: defaultExtent.spatialReference,
        },
      },
    ] as IHubLocationOption[]
  ).map((option) => {
    // If this is a new entity, select the custom option by default
    if (!entity.id && option.location.type === "custom") {
      option.selected = true;
    } else if (entity.id && !location && option.location.type === "none") {
      option.selected = true;
    } else if (location?.type === option.location.type) {
      option.location = location;
      option.selected = true;
    }

    return option;
  });
}

// TODO: Add other location options here
