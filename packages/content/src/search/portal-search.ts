import { cloneObject, IHubContent } from "@esri/hub-common";
import { IItem, ISearchOptions, ISearchResult } from "@esri/arcgis-rest-portal";
import { searchItems } from "@esri/arcgis-rest-portal";
import { itemToContent } from "../portal";
import { chunkArray } from "@esri/hub-common";

const ALLOWED_AGGREGATIONS = [
  "access",
  "tags",
  "type",
  "categories",
  "contentstatus"
];

/**
 * 1. Take request and split into requests for data and aggregations
 * 2. Make requests and wait for responses
 * 3. Process results as Hub Content
 * 4. Combine processed and aggregations into a response
 * @param params
 *
 */
export function searchPortalContent(
  params: ISearchOptions
): Promise<ISearchResult<IHubContent>> {
  const itemRequest: ISearchOptions = _prepareItemRequest(params);
  const aggRequests: ISearchOptions[] = _prepareAggRequests(params);
  const allRequests: ISearchOptions[] = [itemRequest].concat(aggRequests);

  const promises: Array<Promise<ISearchResult<IItem>>> = allRequests.map(req =>
    searchItems(req)
  );

  return Promise.all(promises).then(
    (responses: Array<ISearchResult<IItem>>) => {
      const itemsResponse: ISearchResult<IHubContent> = _handleItemResponse(
        responses[0]
      );
      const aggsResponse: ISearchResult<IItem> = _combineAggregations(
        responses.slice(1, responses.length)
      );
      itemsResponse.aggregations = aggsResponse.aggregations;
      return itemsResponse;
    }
  );
}

function _prepareItemRequest(params: ISearchOptions): ISearchOptions {
  const itemSearchParams = cloneObject(params);
  itemSearchParams.countFields = undefined;
  itemSearchParams.countSize = undefined;
  return itemSearchParams;
}

function _prepareAggRequests(params: ISearchOptions): ISearchOptions[] {
  const chunkedAggregations: string[][] = _chunkAggregations(
    params.countFields
  );
  return chunkedAggregations.map((agg: string[]) => {
    const chunkedParams: ISearchOptions = cloneObject(params);
    return _setupCountProps(chunkedParams, agg);
  });
}

function _chunkAggregations(aggString: string = ""): string[][] {
  const aggs = aggString.split(",");
  return chunkArray(
    aggs.filter(
      (agg: string) => ALLOWED_AGGREGATIONS.indexOf(agg.toLowerCase()) > -1
    ),
    3
  );
}

function _setupCountProps(
  params: ISearchOptions,
  agg: string[]
): ISearchOptions {
  params.params.countFields = agg.join(",");
  params.params.num = 0;
  params.params.countSize = params.countSize || 200;
  params.countFields = undefined;
  params.num = undefined;
  params.countSize = undefined;
  return params;
}

function _handleItemResponse(
  response: ISearchResult<IItem>
): ISearchResult<IHubContent> {
  const content: IHubContent[] = _convertItemsToContent(response.results);
  response.results = content;
  return response as ISearchResult<IHubContent>;
}

function _convertItemsToContent(items: IItem[]): IHubContent[] {
  return items.map(item => itemToContent(item));
}

function _combineAggregations(
  responses: Array<ISearchResult<IItem>>
): ISearchResult<IItem> {
  return responses.reduce(
    (one: ISearchResult<IItem>, two: ISearchResult<IItem>) => {
      two.aggregations.counts = two.aggregations.counts.concat(
        one.aggregations.counts
      );
      return two;
    },
    { aggregations: { counts: [] } } as ISearchResult<IItem>
  );
}
