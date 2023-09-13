import {
  bBoxToExtent,
  extentToBBox,
  getGeographicOrgExtent,
  isBBox,
} from "../../../extent";
import { IHubRequestOptions } from "../../../types";
import { getTypeFromEntity } from "../../getTypeFromEntity";

import { ConfigurableEntity } from "./ConfigurableEntity";
import { IHubLocation, IHubLocationOption } from "../../types/IHubLocation";
import { IExtent } from "@esri/arcgis-rest-types";

const getItemExtent = (itemExtent: number[][]): IExtent => {
  return isBBox(itemExtent)
    ? ({ ...bBoxToExtent(itemExtent), type: "extent" } as unknown as IExtent)
    : undefined;
};

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
  const typeFromEntity = getTypeFromEntity(entity);

  switch (typeFromEntity) {
    case "content":
      return getContentLocationOptions(entity, portalName, hubRequestOptions);
    default:
      return getDefaultLocationOptions(entity, portalName, hubRequestOptions);
  }
}

// TODO: Refactor parameters, they are icky gross
// TODO: Maybe move these to outside of core and into respective entities

export async function getContentLocationOptions(
  entity: ConfigurableEntity,
  portalName: string,
  hubRequestOptions: IHubRequestOptions
): Promise<IHubLocationOption[]> {
  const orgExtent: IExtent = await getGeographicOrgExtent(hubRequestOptions);
  const itemExtent: IExtent = getItemExtent(entity.extent);
  const type = "content";
  const location: IHubLocation = entity.location;
  return (
    [
      // No location
      {
        label: "{{shared.fields.location.none:translate}}",
        location: { type: "none" },
      },
      // Organization's extent
      {
        label: "{{shared.fields.location.org:translate}}",
        description: portalName,
        location: {
          type: "org",
          extent: extentToBBox(orgExtent),
          spatialReference: orgExtent.spatialReference,
        },
      },
      // Item's extent
      {
        label: "{{shared.fields.location.itemExtent:translate}}",
        entityType: type,
        location: {
          type: "item",
          extent: extentToBBox(itemExtent),
          spatialReference: itemExtent.spatialReference,
        },
      },
      // Custom location
      {
        label: "{{shared.fields.location.custom:translate}}",
        description: "{{shared.fields.location.customDescription:translate}}",
        entityType: type,
        location: {
          type: "custom",
          spatialReference: orgExtent.spatialReference,
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
