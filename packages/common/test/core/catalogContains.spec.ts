import { IPortal, IUser } from "@esri/arcgis-rest-portal";

import * as HubSearchModule from "../../src/search/hubSearch";
import { MOCK_AUTH } from "../mocks/mock-auth";
import {
  IFilter,
  IHubCatalog,
  IPredicate,
} from "../../src/search/types/IHubCatalog";
import { IArcGISContext } from "../../src/types/IArcGISContext";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { catalogContains } from "../../src/core/catalogContains";
import { cloneObject } from "../../src/util";

const catalogJson: IHubCatalog = {
  title: "Demo Catalog",
  schemaVersion: 1,
  scopes: {
    item: {
      targetEntity: "item",
      filters: [
        {
          predicates: [
            {
              group: ["3ef", "bc5"],
            },
          ],
        },
      ],
    },
    group: {
      targetEntity: "group",
      filters: [
        {
          predicates: [
            {
              orgid: "abc123",
            },
          ],
        },
      ],
    },
    user: {
      targetEntity: "user",
      filters: [
        {
          predicates: [
            {
              orgid: "abc123",
            },
          ],
        },
      ],
    },
  },
  collections: [
    {
      key: "teams",
      label: "Project Teams",
      targetEntity: "group",
      scope: {
        targetEntity: "group",
        filters: [
          {
            predicates: [
              {
                tag: "Project Team",
              },
            ],
          },
        ],
      },
    },
    {
      key: "environment",
      label: "Environment",
      targetEntity: "item",
      scope: {
        targetEntity: "item",
        filters: [
          {
            predicates: [
              {
                type: "Feature Service",
                tag: "authoritative",
              },
            ],
          },
        ],
      },
    },
  ],
};

const noScopeCatalog: IHubCatalog = {
  title: "No Scope Catalog",
  schemaVersion: 1,

  collections: [
    {
      key: "teams",
      label: "Project Teams",
      targetEntity: "group",
      scope: {
        targetEntity: "group",
        filters: [
          {
            predicates: [
              {
                tag: "Project Team",
              },
            ],
          },
        ],
      },
    },
  ],
};

describe("catalogContains:", () => {
  let hubSearchSpy: any;
  let context: IArcGISContext;
  beforeEach(async () => {
    const authdCtxMgr = await ArcGISContextManager.create({
      authentication: MOCK_AUTH,
      currentUser: {
        username: "casey",
      } as unknown as IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
      } as unknown as IPortal,
      portalUrl: "https://myserver.com",
    });
    context = authdCtxMgr.context;
  });

  it("returns false if scope does not exist for entityType ", async () => {
    hubSearchSpy = vi
      .spyOn(HubSearchModule as any, "hubSearch")
      .mockImplementation(() => Promise.resolve({ fake: "response" }));

    const res = await catalogContains(
      "1950189b18a64ab78fc478d97ea502e0",
      catalogJson,
      context,
      { entityType: "groupMember" }
    );

    expect(res.isContained).toBe(false);
    expect(hubSearchSpy).toHaveBeenCalledTimes(0);
  });
  it("returns false if no scope or collection for entityType", async () => {
    hubSearchSpy = vi
      .spyOn(HubSearchModule as any, "hubSearch")
      .mockImplementation(() => Promise.resolve({ fake: "response" }));
    const noScopeOrCollections = cloneObject(noScopeCatalog);
    delete noScopeOrCollections.collections;
    const res = await catalogContains(
      "1950189b18a64ab78fc478d97ea502e0",
      noScopeOrCollections,
      context,
      { entityType: "groupMember" }
    );

    expect(res.isContained).toBe(false);
    expect(hubSearchSpy).toHaveBeenCalledTimes(0);
  });
  it("executes scope search if entity type specified and scope exists", async () => {
    hubSearchSpy = vi
      .spyOn(HubSearchModule as any, "hubSearch")
      .mockImplementation(() =>
        Promise.resolve({ results: ["results just needs to have an entry"] })
      );

    const res = await catalogContains(
      "1950189b18a64ab78fc478d97ea502e0",
      catalogJson,
      context,
      { entityType: "item" }
    );
    expect(res.isContained).toBe(true);
    expect(hubSearchSpy).toHaveBeenCalledTimes(1);
    const chkQry = hubSearchSpy.mock.calls[0][0];
    const predicates: IPredicate = chkQry.filters.reduce(
      (acc: IPredicate[], f: IFilter) => {
        return acc.concat(f.predicates);
      },
      []
    );
    // one predicate must have the id
    expect(
      predicates.some(
        (p: IPredicate) => p.id === "1950189b18a64ab78fc478d97ea502e0"
      )
    ).toBe(true);
  });
  it("executes collection search if no scope", async () => {
    hubSearchSpy = vi
      .spyOn(HubSearchModule as any, "hubSearch")
      .mockImplementation(() =>
        Promise.resolve({ results: ["results just needs to have an entry"] })
      );
    const scopelessCatalog = cloneObject(catalogJson);
    delete scopelessCatalog.scopes?.item;

    const res = await catalogContains(
      "1950189b18a64ab78fc478d97ea502e0",
      scopelessCatalog,
      context,
      { entityType: "item" }
    );
    expect(res.isContained).toBe(true);
    expect(hubSearchSpy).toHaveBeenCalledTimes(1);
    const chkQry = hubSearchSpy.mock.calls[0][0];
    const predicates: IPredicate = chkQry.filters.reduce(
      (acc: IPredicate[], f: IFilter) => {
        return acc.concat(f.predicates);
      },
      []
    );
    // one predicate must have the id
    expect(
      predicates.some(
        (p: IPredicate) => p.id === "1950189b18a64ab78fc478d97ea502e0"
      )
    ).toBe(true);
  });

  it("assumes slug if not guid", async () => {
    hubSearchSpy = vi
      .spyOn(HubSearchModule as any, "hubSearch")
      .mockImplementation(() =>
        Promise.resolve({
          results: [
            { typeKeywords: ["slug|org|my-name-is-vader-1"] },
            { typeKeywords: ["slug|org|my-name-is-vader"] },
          ],
        })
      );

    const res = await catalogContains(
      "org|my-name-is-vader",
      catalogJson,
      context,
      { entityType: "item" }
    );

    expect(res.isContained).toBe(true);
    expect(hubSearchSpy).toHaveBeenCalledTimes(1);
    const chkQry = hubSearchSpy.mock.calls[0][0];
    const predicates: IPredicate = chkQry.filters.reduce(
      (acc: IPredicate[], f: IFilter) => {
        return acc.concat(f.predicates);
      },
      []
    );
    // one predicate must have the slug
    expect(
      predicates.some((p: IPredicate) =>
        p.typekeywords?.includes("slug|org|my-name-is-vader")
      )
    ).toBe(true);
  });
  it("executes one search per-scope if entity type not specified", async () => {
    let called = false;
    hubSearchSpy = vi
      .spyOn(HubSearchModule as any, "hubSearch")
      .mockImplementation(() => {
        let response: any = { results: [] };
        if (!called) {
          response = { results: ["results just needs to have an entry"] };
          called = true;
        }
        return Promise.resolve(response);
      });

    const res = await catalogContains(
      "1950189b18a64ab78fc478d97ea502e0",
      catalogJson,
      context
    );
    expect(res.isContained).toBe(true);
    expect(hubSearchSpy).toHaveBeenCalledTimes(3);
  });
});
