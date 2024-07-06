import { IItem } from "@esri/arcgis-rest-portal";
import {
  EditableContentEnrichment,
  IHubEditableContentEnrichments,
  ItemOrServerEnrichment,
  fetchItemEnrichments,
} from "../../items/_enrichments";
import { isService } from "../../resources/_internal/_validate-url-helpers";
import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { IHubRequestOptions } from "../../types";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { fetchItemScheduleEnrichment } from "./fetchItemScheduleEnrichment";

/**
 * @private
 *
 * Fetches the enrichments for a content item to be converted into an IHubEditableContent object.
 * If no enrichment keys are provided, the default enrichments will be fetched. Default enrichments
 * vary by item type.
 *
 * @param item item to fetch enrichments for
 * @param requestOptions
 * @param enrichments optional override for the enrichments to fetch
 * @returns a hash of enrichments
 */
export async function fetchEditableContentEnrichments(
  item: IItem,
  requestOptions: IRequestOptions,
  enrichments?: EditableContentEnrichment[]
): Promise<IHubEditableContentEnrichments> {
  const result: IHubEditableContentEnrichments = {};

  if (!enrichments) {
    enrichments = getDefaultEnrichmentKeys(item);
  }

  // Leverage the existing fetchItemEnrichments() function to fetch supported enrichments
  const itemOrServerEnrichmentKeys = enrichments.filter(
    (e) => e !== "schedule"
  );
  if (itemOrServerEnrichmentKeys.length) {
    // TODO: Abstract this into a helper function that can be used by enrichContentSearchResult()
    const itemOrServerEnrichments = await fetchItemEnrichments(
      item,
      itemOrServerEnrichmentKeys as ItemOrServerEnrichment[],
      requestOptions as IHubRequestOptions
    );

    itemOrServerEnrichmentKeys.forEach((key) => {
      result[key] = itemOrServerEnrichments[key as ItemOrServerEnrichment];
    });
  }

  // Fetch the schedule separately if it's requested
  // TODO: should we add scheduling to the fetchItemEnrichments() subsystem?
  if (enrichments.includes("schedule")) {
    result.schedule = await fetchItemScheduleEnrichment(
      item,
      requestOptions as IUserRequestOptions
    );
  }

  return result;
}

function getDefaultEnrichmentKeys(item: IItem): EditableContentEnrichment[] {
  const enrichments: EditableContentEnrichment[] = [
    "data",
    "metadata",
    "schedule",
  ];
  if (isService(item.url)) {
    enrichments.push("server");
  }
  return enrichments;
}
