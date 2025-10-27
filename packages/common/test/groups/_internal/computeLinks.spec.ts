import type { IGroup, IUser } from "@esri/arcgis-rest-portal";
import { computeLinks } from "../../../src/groups/_internal/computeLinks";
import { MOCK_AUTH, createMockContext } from "../../mocks/mock-auth";
import { IPortal } from "@esri/arcgis-rest-portal";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("computeLinks", () => {
  let authdCtxMgr: any;
  let group: IGroup;

  beforeEach(async () => {
    group = {
      id: "00c",
    } as IGroup;
    const contextOptions = {
      authentication: MOCK_AUTH,
      currentUser: {} as IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
        properties: {
          hub: { enabled: true },
        },
      } as unknown as IPortal,
      portalUrl: "https://org.maps.arcgis.com",
    };
    authdCtxMgr = {
      context: createMockContext(contextOptions),
    } as unknown as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetAllMocks();
  });

  it("generates a links hash", () => {
    const chk = computeLinks(group, authdCtxMgr.context.requestOptions);

    expect(chk.siteRelative).toBe("/groups/00c");
    expect(chk.siteRelativeEntityType).toBe("");
    expect(chk.workspaceRelative).toBe("/workspace/groups/00c");
  });
});
