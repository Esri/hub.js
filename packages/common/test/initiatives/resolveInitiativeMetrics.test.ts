import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import {
  ArcGISContextManager,
  IHubInitiative,
  ResolvedMetrics,
  resolveInitiativeMetrics,
} from "../../src";
import * as PreProcessModule from "../../src/metrics/preprocessMetrics";
import * as ResolveMetricsModule from "../../src/metrics/resolveMetrics";
import { MOCK_AUTH } from "../mocks/mock-auth";

describe("resolveInitiativeMetrics:", () => {
  let authdCtxMgr: ArcGISContextManager;
  let resolveMetricsSpy: jasmine.Spy;
  let derefMetricsSpy: jasmine.Spy;
  beforeEach(async () => {
    // When we pass in all this information, the context
    // manager will not try to fetch anything, so no need
    // to mock those calls
    authdCtxMgr = await ArcGISContextManager.create({
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
    resolveMetricsSpy = spyOn(
      ResolveMetricsModule,
      "resolveMetrics"
    ).and.returnValue(Promise.resolve({ from: "spy" }));
    derefMetricsSpy = spyOn(
      PreProcessModule,
      "preprocessMetrics"
    ).and.callThrough();
  });
  it("dereferences and resolves if no metrics defined", async () => {
    const initiative: IHubInitiative = {
      id: "00c",
      name: "Fake Initiative",
    } as unknown as IHubInitiative;

    const metrics = await resolveInitiativeMetrics(
      initiative,
      authdCtxMgr.context
    );
    expect(metrics).toEqual({ from: "spy" } as unknown as ResolvedMetrics);
    expect(resolveMetricsSpy).toHaveBeenCalledTimes(1);
    expect(derefMetricsSpy).toHaveBeenCalledTimes(1);
  });
  it("derefs and resolves metrics", async () => {
    const initiative: IHubInitiative = {
      id: "00c",
      name: "Fake Initiative",
      type: "Hub Initiative",
      metrics: {
        budget: {
          definition: {
            type: "static-value",
            value: 1000000,
            outPath: "budget",
          },
        },
      },
    } as unknown as IHubInitiative;
    const metrics = await resolveInitiativeMetrics(
      initiative,
      authdCtxMgr.context
    );
    expect(metrics).toEqual({ from: "spy" } as unknown as ResolvedMetrics);
    expect(resolveMetricsSpy).toHaveBeenCalledTimes(1);
    expect(derefMetricsSpy).toHaveBeenCalledTimes(1);
  });
});
