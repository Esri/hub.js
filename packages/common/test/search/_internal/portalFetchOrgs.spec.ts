import { portalFetchOrgs } from "../../../src/search/_internal/portalFetchOrgs";
import * as fetchOrgModule from "../../../src/org/fetch-org";
import { IPortal } from "@esri/arcgis-rest-portal";
import { IQuery } from "../../../src/search/types/IHubCatalog";
import { cloneObject } from "../../../src/util";
import { IHubSearchOptions } from "../../../src/search/types/IHubSearchOptions";

describe("portalFetchOrgs:", () => {
  afterEach(() => vi.restoreAllMocks());

  it("should fetch organizations based on id predicate", async () => {
    const fetchOrgSpy = vi
      .spyOn(fetchOrgModule as any, "fetchOrg")
      .mockResolvedValue(cloneObject(PORTAL));
    const query: IQuery = {
      targetEntity: "organization",
      filters: [
        {
          predicates: [
            {
              id: ["Xj56SBi2udA78cC9"],
            },
          ],
        },
      ],
    };
    const options: IHubSearchOptions = { requestOptions: {} } as any;

    const response = await portalFetchOrgs(query, options);

    expect(fetchOrgSpy).toHaveBeenCalledTimes(1);
    expect(response.total).toBe(1);
    expect(response.results[0].id).toBe(PORTAL.id);
  });

  it("should throw an error if no id predicate is found", async () => {
    const query: IQuery = { targetEntity: "organization", filters: [] } as any;
    const options: IHubSearchOptions = { requestOptions: {} } as any;
    await expect(portalFetchOrgs(query, options)).rejects.toThrow(
      "Organization query must contain an id predicate."
    );
  });

  it("should handle null organizations from failSafe", async () => {
    vi.spyOn(fetchOrgModule as any, "fetchOrg").mockResolvedValue(null);

    const query: IQuery = {
      targetEntity: "organization",
      filters: [
        {
          predicates: [
            {
              id: ["Xj56SBi2udA78cC9"],
            },
          ],
        },
      ],
    } as any;
    const options: IHubSearchOptions = { requestOptions: {} } as any;

    const response = await portalFetchOrgs(query, options);

    expect(response.total).toBe(0);
    expect(response.results.length).toBe(0);
  });
});

const PORTAL: IPortal = {
  /* large fixture omitted - original fixture preserved in .test.ts */
} as unknown as IPortal;
