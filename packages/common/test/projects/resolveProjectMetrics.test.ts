import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import {
  ArcGISContextManager,
  IHubProject,
  ResolvedMetrics,
  resolveProjectMetrics,
} from "../../src";
import * as PreprocessModule from "../../src/metrics/preprocessMetrics";
import * as ResolveMetricsModule from "../../src/metrics/resolveMetrics";
import { MOCK_AUTH } from "../mocks/mock-auth";

describe("resolveProjectMetrics:", () => {
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
      PreprocessModule,
      "preprocessMetrics"
    ).and.callThrough();
  });
  it("dereferences and resolves if no metrics defined", async () => {
    const project: IHubProject = {
      id: "00c",
      name: "Fake project",
    } as unknown as IHubProject;

    const metrics = await resolveProjectMetrics(project, authdCtxMgr.context);
    expect(metrics).toEqual({ from: "spy" } as unknown as ResolvedMetrics);
    expect(resolveMetricsSpy).toHaveBeenCalledTimes(1);
    expect(derefMetricsSpy).toHaveBeenCalledTimes(1);
  });
  it("derefs and resolves metrics", async () => {
    const project: IHubProject = {
      id: "00c",
      name: "Fake project",
      type: "Hub Project",
      metrics: {
        budget: {
          definition: {
            type: "static-value",
            value: 1000000,
            outPath: "budget",
          },
        },
      },
    } as unknown as IHubProject;
    const metrics = await resolveProjectMetrics(project, authdCtxMgr.context);
    expect(metrics).toEqual({ from: "spy" } as unknown as ResolvedMetrics);
    expect(resolveMetricsSpy).toHaveBeenCalledTimes(1);
    expect(derefMetricsSpy).toHaveBeenCalledTimes(1);
  });
});
