import { IItem } from "@esri/arcgis-rest-portal";
import {
  EditableContentEnrichment,
  IHubEditableContentEnrichments,
  ItemOrServerEnrichment,
  fetchItemEnrichments,
} from "../../items/_enrichments";
import { isService } from "../../resources/is-service";
import type { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { IHubRequestOptions } from "../../hub-types";
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

  // NOTE: Enrichments for IHubEditableContent can be fetched one of two ways:
  //
  // 1: Via `fetchItemEnrichments()`. This was the old way that we used to fetch enrichments
  //    in the `fetchContent()` era. Since the code still works and has great error handling,
  //    there's no reason to re-invent the wheel.
  // 2. Via ad-hoc fetch functions. We typically use this for new enrichments that are not
  //   supported by `fetchItemEnrichments()` (e.g. schedule)
  //
  // Eventually we'll want to move all new enrichments to the `fetchItemEnrichments()` subsystem,
  // but before we do we'll need to evaluate any impacts that would have on existing code, since
  // `fetchContent()` is still widely used in the codebase.

  const adHocEnrichments = ["schedule"];
  const fetchItemEnrichmentKeys = enrichments.filter(
    (e) => !adHocEnrichments.includes(e)
  );

  if (fetchItemEnrichmentKeys.length) {
    // TODO: Abstract this into a helper function that can be used by enrichContentSearchResult()
    const itemOrServerEnrichments = await fetchItemEnrichments(
      item,
      fetchItemEnrichmentKeys as ItemOrServerEnrichment[],
      requestOptions as IHubRequestOptions
    );

    fetchItemEnrichmentKeys.forEach((key) => {
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
  const enrichments: EditableContentEnrichment[] = ["metadata", "schedule"];
  if (isService(item.url)) {
    enrichments.push("server");
  }
  return enrichments;
}
