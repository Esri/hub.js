import {
  HubProject,
  IArcGISContext,
  IHubProject,
  dereferenceProjectMetrics,
  resolveProjectMetrics,
  resolveMetric,
} from "../src";
import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";

const HARNESS_ID = "69da6b84ffe84fec86c6699d47f62a51";

fdescribe("Project Metrics:", () => {
  let factory: Artifactory;
  const orgName = "hubPremium";
  beforeAll(() => {
    factory = new Artifactory(config);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
  });
  xdescribe("create harness item", () => {
    it("create a project with metrics", async () => {
      const ctxMgr = await factory.getContextManager(orgName, "admin");
      const project = await createTestProject(ctxMgr.context);
      // console.info(`Created project ${project.id}`);
    });
    // it("destroy harness item", async () => {
    //   const ctxMgr = await factory.getContextManager(orgName, "admin");
    //   const context = ctxMgr.context;
    //   const project = await HubProject.fetch(HARNESS_ID, context);
    //   await project.delete();
    // });
  });
  describe("resolve project metrics", () => {
    it("resolve all metrics via class", async () => {
      const ctxMgr = await factory.getContextManager(orgName, "admin");
      const context = ctxMgr.context;
      const project = await HubProject.fetch(HARNESS_ID, context);
      const resolved = await project.resolveMetrics();
      expect(resolved).toEqual({
        cityFunding: {
          value: 30400,
          type: "stat-card",
          title: "City Funding",
          unit: "$",
          unitPosition: "before",
          order: 3,
        },
        surveyCount: {
          value: 20,
          type: "stat-card",
          title: "Completed Surveys",
          order: 4,
        },
      });
    });

    it("resolve all metrics via function", async () => {
      const ctxMgr = await factory.getContextManager(orgName, "admin");
      const context = ctxMgr.context;
      const project = await HubProject.fetch(HARNESS_ID, context);
      const resolved = await resolveProjectMetrics(project.toJson(), context);
      expect(resolved).toEqual({
        cityFunding: {
          value: 30400,
          type: "stat-card",
          title: "City Funding",
          unit: "$",
          unitPosition: "before",
          order: 3,
        },
        surveyCount: {
          value: 20,
          type: "stat-card",
          title: "Completed Surveys",
          order: 4,
        },
      });
    });
    it("resolve single metric via function", async () => {
      const ctxMgr = await factory.getContextManager(orgName, "admin");
      const context = ctxMgr.context;
      const project = await HubProject.fetch(HARNESS_ID, context);
      // dereference the metrics
      const metrics = dereferenceProjectMetrics(project.toJson());
      // resolve the metrics separately
      const cfMetric = await resolveMetric(metrics.cityFunding, context);
      expect(cfMetric).toEqual({
        cityFunding: {
          value: 30400,
          type: "stat-card",
          title: "City Funding",
          unit: "$",
          unitPosition: "before",
          order: 3,
        },
      });
      const scMetric = await resolveMetric(metrics.surveysCompleted, context);
      expect(scMetric).toEqual({
        surveyCount: {
          value: 20,
          type: "stat-card",
          title: "Completed Surveys",
          order: 4,
        },
      });
    });
  });
});

async function createTestProject(context: IArcGISContext): Promise<HubProject> {
  const project: Partial<IHubProject> = {
    name: `Test Project for Metrics`,
    description: `This is a test Project with stand-alone metrics`,
    typeKeywords: ["doNotDelete"],
    orgUrlKey: context.portal.urlKey,
  };
  const instance = await HubProject.create(project, context, true);

  // construct metrics
  const metrics: Record<string, any> = {};

  metrics.cityFunding = {
    source: {
      type: "static-value",
      value: 30400,
    },
    display: {
      type: "stat-card",
      title: "City Funding",
      unit: "$",
      unitPosition: "before",
      order: 3,
    },
    editor: {
      type: "number",
      label: "Funding from City",
      description: "City funding for this project",
    },
  };

  const colors = ["red", "orange", "yellow", "blue", "green"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  metrics.surveysCompleted = {
    source: {
      type: "service-query",
      options: {
        url: "https://servicesqa.arcgis.com/T5cZDlfUaBpDnk6P/arcgis/rest/services/hub_e2e_fixture_tc121302_simple_point_100/FeatureServer/0",
        where: `expected_color = '${color}'`,
        field: "quant_val",
        statisticType: "count",
      },
      aggregation: "count",
      outPath: "surveyCount",
      required: false,
    },
    display: {
      type: "stat-card",
      title: "Completed Surveys",
      order: 4,
    },
  };

  const json = instance.toJson();
  json.metrics = metrics;
  instance.update(json);
  await instance.save();
  await instance.setAccess("public");

  return instance;
}
