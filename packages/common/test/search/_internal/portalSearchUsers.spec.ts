// make arcgis-rest-portal named exports spyable in ESM
vi.mock("@esri/arcgis-rest-portal", async () => ({
  ...((await vi.importActual("@esri/arcgis-rest-portal")) as any),
}));

import {
  searchPortalUsers,
  searchPortalUsersLegacy,
  searchCommunityUsers,
} from "../../../src/search/_internal/portalSearchUsers";
import * as portalModule from "@esri/arcgis-rest-portal";
import * as hubUsersModule from "../../../src/users/HubUsers";
import * as expandPredicateModule from "../../../src/search/_internal/expandPredicate";
import { IQuery } from "../../../src/search/types/IHubCatalog";
import { IHubSearchOptions } from "../../../src/search/types/IHubSearchOptions";

describe("portalSearchUsers", () => {
  afterEach(() => vi.restoreAllMocks());

  const PAGE = { results: [{ id: "u1" }], nextStart: -1, total: 1 } as any;
  const query: IQuery = { query: true, filters: [] } as any;
  const options = {
    options: true,
    requestOptions: {
      requestOptions: true,
      authentication: { serialize: () => "{}", token: "abc" },
    },
  } as unknown as IHubSearchOptions;

  beforeEach(() => {
    vi.spyOn(portalModule as any, "searchUsers").mockResolvedValue(PAGE);
    // stub enrichUserSearchResult to avoid downstream parsing that expects full user objects
    vi.spyOn(
      hubUsersModule as any,
      "enrichUserSearchResult"
    ).mockImplementation(() => Promise.resolve({}));
  });

  it("should call portal.searchUsers and return results", async () => {
    const res = await searchPortalUsers(query, options);
    expect(portalModule.searchUsers).toHaveBeenCalledTimes(1);
    expect(res.total).toBe(1);
  });

  it("throws when options.requestOptions is missing", () => {
    expect(() => searchPortalUsers({ filters: [] } as any, {} as any)).toThrow(
      "requestOptions: IHubRequestOptions is required."
    );
  });

  it("throws when requestOptions.authentication is missing", () => {
    const noAuthOptions = {
      requestOptions: { portal: "https://portal.example.com" },
    } as any;
    expect(() =>
      searchPortalUsers({ filters: [] } as any, noAuthOptions)
    ).toThrow("requestOptions must pass authentication.");
  });

  it("legacy and community wrappers call portal and return results", async () => {
    // portalModule.searchUsers is already stubbed in beforeEach
    const legacyRes = await searchPortalUsersLegacy(query, options);
    expect(legacyRes.total).toBe(1);

    // mock community search function (different export)
    vi.spyOn(portalModule as any, "searchCommunityUsers").mockResolvedValue(
      PAGE
    );
    const communityRes = await searchCommunityUsers(query, options);
    expect(communityRes.total).toBe(1);
  });

  it("expands the predicates in each filter", async () => {
    const expandSpy = vi
      .spyOn(expandPredicateModule, "expandPredicate")
      .mockImplementation((p: any) => p);

    const testQuery: IQuery = {
      filters: [
        {
          predicates: [
            {
              type: ["Person"],
            },
          ],
        },
      ],
    } as any;

    await searchPortalUsers(testQuery, options);
    expect(expandSpy).toHaveBeenCalled();
  });
});
