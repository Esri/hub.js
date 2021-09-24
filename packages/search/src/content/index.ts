import { UserSession } from "@esri/arcgis-rest-auth";
import {
  getHubApiUrl,
  getProp,
  hubApiSearch,
  IHubRequestOptions,
  fetchSite,
  ISiteCatalog,
  getPortalApiUrl,
  DatasetResource,
} from "@esri/hub-common";
import { IItem, ISearchOptions, ISearchResult } from "@esri/arcgis-rest-portal";
import { searchItems } from "@esri/arcgis-rest-portal";
import {
  IContentSearchOptions,
  IContentSearchRequest,
  IContentSearchResponse,
} from "../types/content";
import { ISearchService, ISearchServiceParams } from "../types/search-service";
import { convertToPortalParams } from "./helpers/convert-request-to-portal-params";
import { convertToHubParams } from "./helpers/convert-request-to-hub-params";
import { ISearchParams } from "../ago/params";
import { convertPortalResponse } from "./helpers/convert-portal-response";
import { convertHubResponse } from "./helpers/convert-hub-response";

/**
 * A search service for searching content across the Portal API only or Portal API and the
 * Hub Indexer V3 API. Has a single public method for searching.
 *
 * @param portal The Portal Sharing URL of the portal for which content should be searched
 * @param isPortal Flag to determine if content searching should be limited to a Portal API
 * @param authentication Optional User Session instance that can be used for authentication
 *
 * ```js
 * import { ContentSearchService } from '@esri/hub-search'
 *
 * const service = new ContentSearchService({
 *     portal: 'https://hub.arcgis.com/sharing/rest,
 *     isPortal: false
 *     session: new UserSession({ ... })
 * });
 *
 * const searchResults = await service.search({ filters, options })
 * ```
 */
export class ContentSearchService
  implements
    ISearchService<IContentSearchRequest, Promise<IContentSearchResponse>>
{
  private portal: string;
  private isPortal: boolean;
  private authentication: UserSession;

  constructor(params: ISearchServiceParams) {
    this.portal = params.portal;
    this.isPortal = params.isPortal;
    this.authentication = params.authentication;
  }

  /**
   * Entrypoint for Portal API-only or Portal API and Hub V3 API Search
   * @param request - the IContentSearchRequest instance for searching
   */
  search(request: IContentSearchRequest): Promise<IContentSearchResponse> {
    const isPortal = getProp(request, "options.isPortal") || this.isPortal;
    if (isPortal) {
      return this.enterpriseSearch(request);
    }
    return this.onlineSearch(request);
  }

  private enterpriseSearch(
    request: IContentSearchRequest = { filter: {}, options: {} }
  ): Promise<IContentSearchResponse> {
    return performEnterpriseContentSearch(
      request,
      this.portal,
      this.authentication
    );
  }

  private onlineSearch(
    request: IContentSearchRequest = { filter: {}, options: {} }
  ): Promise<IContentSearchResponse> {
    // merge instance's portal and authentication into options
    const { portal, authentication } = this;
    const options = { portal, authentication, ...request.options };
    return performHubContentSearch({ ...request, options });
  }
}

/**
 * A standalone function for searching Hub content
 *
 * A content search is configured by passing `searchContent` an object of type `IContentSearchRequest`.
 * This configuration object is composed of two important child objects: `filter` and `options`.
 *
 * The `filter` object allows the caller to filter results based on attributes exposed by AGO and
 * the Hub API. A complete list of attributes can be found at the docs for `IContentSearchFilter`,
 * but some examples include:
 * - access
 * - id
 * - group
 * - orgid
 *
 * The `options` object allows the caller to specify more general attributes about the request itself.
 * A complete list of options can be found at the docs for `IContentSearchOptions`, but some examples include:
 * - the authenticated user
 * - whether the call is happening in an enterprise environment
 * - what site catalog to search
 *
 * Combined, both filters and options allow you to create complex queries against AGO / Hub API.
 * Here are examples of some common use cases:
 *
 * ```js
 * import { searchContent, IBooleanOperator } from '@esri/hub-search';
 * ...
 *
 * /////////////////////////////////////////////////////////////////////
 * // Search for all public and private content associated with a site
 * /////////////////////////////////////////////////////////////////////
 * const options: IContentSearchOptions = {
 *    site: 'https://my-site.hub.arcgis.com',
 *    portal: 'https://www.arcgis.com',
 *    // Any private content that the authenticated user can access will be included in the results
 *    authentication: new UserSession(...),
 * }
 * const searchResults = await searchContent({ options });
 * ...
 *
 * ///////////////////////////////////////////////////////////
 * // Search for all public content associated with a site
 * ///////////////////////////////////////////////////////////
 * const options: IContentSearchOptions = {
 *    site: 'https://my-site.hub.arcgis.com',
 *    portal: 'https://www.arcgis.com',
 *    authentication: new UserSession(...),
 * }
 * const filter: IContentSearchFilter = {
 *    access: 'public'
 * }
 * const searchResults = await searchContent({ filter, options });
 * ...
 *
 * //////////////////////////////////////////////////////////
 * // Search for all private content associated with a site
 * ///////////////////////////////////////////////////////////
 *
 * // TODO: As of 8/17/21 the hub api has a bug in which
 * // Any query with a not filter on the access field
 * // (e.g access: not('public')) will return no results
 *
 * const options: IContentSearchOptions = {
 *    site: 'https://my-site.hub.arcgis.com',
 *    portal: 'https://www.arcgis.com',
 *    // Any private content that the authenticated user can access will be included in the results
 *    authentication: new UserSession(...),
 * }
 * const filter: IContentSearchFilter = {
 *    access: {
 *        value: ['public'],
 *        bool: IBooleanOperator.NOT
 *    }
 * }
 * const searchResults = await searchContent({ filter, options });
 *
 * ...
 * /////////////////////////////////
 * // Search for a specific item
 * /////////////////////////////////
 * const options: IContentSearchOptions = {
 *    portal: 'https://www.arcgis.com',
 *    authentication: new UserSession(...),
 * }
 * const filter: IContentSearchFilter = {
 *    id: 'my_item_id'
 * }
 * const searchResults = await searchContent({ filter, options });
 * ```
 * There are a couple gotchas that need to be accounted for:
 *
 * 1) There is no way to specify the number of results per page. If you need to fetch all
 * items that match a given query, you'll need to utilize the `hasNext` flag as well as the
 * `next` function included on the return object and make multiple XHR requests.
 *
 * 2) Results returned from the hub index (i.e. 'public items') will be structured differently than
 * results returned from AGO/Enterprise (i.e. 'private' items). A comprehensive list of differences cannot
 * be given here, but developers should be aware that they exist. Additionally, the structure of 'public'
 * items can change when either the indexing process or schema of the Hub API is modified. To showcase
 * some of the possible differences between 'public' and 'private' items, we've provided examples of both
 * types of results below:
 *
 * ```js
 * ///////////////
 * // Private
 * ///////////////
 * {
 *  access: "myself",
 *  appCategories: [],
 *  avgRating: 0,
 *  categories: [],
 *  collection: ["Map"],
 *  contentOrigin: "self",
 *  created: 1623945553000,
 *  culture: "en-us",
 *  description: “A description",
 *  extent: {
 *    coordinates: [],
 *    type: "envelope"
 *  },
 *  hubType: "map",
 *  id: "06c0cdadc2ec48509576c20da8572bf8",
 *  industries: [],
 *  isOrgItem: true,
 *  languages: [],
 *  listed: false,
 *  modified: 1629220743000,
 *  name: "Traffic Camera Enforcement Locations in Washington DC",
 *  numComments: 0,
 *  numRatings: 0,
 *  numViews: 0,
 *  owner: "juliana_pa",
 *  properties: {...}
 *  protected: false,
 *  scoreCompleteness: 66,
 *  screenshots: [],
 *  searchDescription: “A description”,
 *  size: -1,
 *  subInfo: 0,
 *  tags: ["DC GIS", "police", "speed", "speeding", "ticket", "traffic", "violation"],
 *  thumbnail: "thumbnail/ago_downloaded.png",
 *  title: "Traffic Camera Enforcement Locations in Washington DC",
 *  type: "Web Map",
 *  typeKeywords: ["ArcGIS Online", "Explorer Web Map", "Map", "Online Map", "Web Map"],
 * }
 *
 * /////////////
 * // Public
 * /////////////
 * {
 *  access: "public",
 *  additionalResources: []
 *  boundary: {...}
 *  categories: []
 *  collection: ["Map"]
 *  commentsEnabled: true
 *  composeStatus: {...}
 *  composedAt: 1629220762412
 *  content: "Web Map"
 *  created: 1619446871000
 *  culture: "en-us"
 *  description: "A pretty brief summary"
 *  downloadable: false
 *  enrichCoverage: "global"
 *  enrichQuality: 55
 *  errors: []
 *  extent: {...}
 *  groupIds: []
 *  hasApi: false
 *  hubType: "Web Map"
 *  id: "ebfe6f6712ff4a23b5447f0ce53d65c2"
 *  itemExtent: [...]
 *  itemModified: 1629220760000
 *  license: "none"
 *  modified: 1629220760000
 *  modifiedProvenance: "item.modified"
 *  name: "My map"
 *  openData: false
 *  orgExtent: {...}
 *  orgId: "Xj56SBi2udA78cC9"
 *  orgName: "QA Premium Alpha Hub"
 *  organization: "QA Premium Alpha Hub"
 *  owner: "juliana_pa"
 *  region: "US"
 *  searchDescription: "A pretty brief summary"
 *  server: null
 *  size: 1142
 *  slug: "qa-pre-a-hub::my-map"
 *  snippet: "A pretty brief summary"
 *  source: "QA Premium Alpha Hub"
 *  sourceProvenance: "org.name"
 *  structuredLicense: { type: "none" }
 *  tags: []
 *  thumbnail: "thumbnail/ago_downloaded.png"
 *  thumbnailUrl: "thumbnail/ago_downloaded.png"
 *  title: "My map"type: "Web Map"
 *  typeCategories: ["Map"]
 *  typeKeywords: ["ArcGIS Hub", "ArcGIS Online", "Explorer Web Map", "Map", "Online Map", "Web Map"]
 *  validExtent: true
 * }
 * ```
 *
 * @param request - the IContentSearchRequest instance for searching
 *
 */
export async function searchContent(
  request: IContentSearchRequest = { filter: {}, options: {} }
): Promise<IContentSearchResponse> {
  const siteCatalog = await getSiteCatalogFromOptions(request.options);
  if (siteCatalog) {
    const { groups: group, orgId: orgid } = siteCatalog;
    request.filter = {
      ...{ group, orgid },
      ...request.filter,
    };
  }

  if (getProp(request, "options.isPortal")) {
    return performEnterpriseContentSearch(request);
  }
  return performHubContentSearch(request);
}

function performEnterpriseContentSearch(
  request: IContentSearchRequest,
  defaultPortal?: string,
  defaultAuthentication?: UserSession
): Promise<IContentSearchResponse> {
  const requestParams: ISearchOptions = convertToPortalParams(
    request,
    defaultPortal,
    defaultAuthentication
  );
  return searchItems(requestParams).then((response: ISearchResult<IItem>) =>
    convertPortalResponse(requestParams, response)
  );
}

/**
 * Function to search the Hub API (v3)
 * using the same arguments as searchContent()
 *
 * NOTE: this returns the Hub API's raw JSONAPI response
 * and invalid parameters like isPortal will be ignored
 *
 * @param request - see searchContent()
 * @returns Hub API's JSONAPI response
 */
export function searchDatasets(
  request: IContentSearchRequest
): Promise<{ data: DatasetResource[] }> {
  const params: ISearchParams = convertToHubParams(request);
  const requestOptions = { ...getHubRequestOptions(request.options), params };
  return hubApiSearch(requestOptions);
}

function performHubContentSearch(
  request: IContentSearchRequest
): Promise<IContentSearchResponse> {
  const authentication: UserSession = getProp(
    request,
    "options.authentication"
  );
  return searchDatasets(request).then((response) => {
    const requestParams: ISearchParams = convertToHubParams(request);
    return convertHubResponse(requestParams, response, authentication);
  });
}

function getSiteCatalogFromOptions(
  options: IContentSearchOptions
): Promise<ISiteCatalog> {
  if (!options || !options.site) return null;

  const ro = getHubRequestOptions(options);

  return fetchSite(options.site, ro).then((siteModel) =>
    getProp(siteModel, "data.catalog")
  );
}

// used above
function getHubRequestOptions(
  options: IContentSearchOptions
): IHubRequestOptions {
  return {
    authentication: options.authentication,
    isPortal: options.isPortal,
    hubApiUrl: getHubApiUrl(options.portal),
    portal: getPortalApiUrl(options.portal),
  };
}
