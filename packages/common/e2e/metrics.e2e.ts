import {
  HubInitiative,
  HubProject,
  aggregateMetrics,
  findBy,
  getEntityMetrics,
  resolveMetric,
} from "../src";
import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";
import {
  ICreateOutput,
  cleanupItems,
  createInitiative,
  createProjects,
  createScopeGroup,
} from "./helpers/metric-fixtures-crud";

fdescribe("metrics development harness:", () => {
  let factory: Artifactory;
  const orgName = "hubPremium";
  beforeAll(() => {
    factory = new Artifactory(config);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
  });
  xdescribe("create harness items:", () => {
    xit("create initative and projects", async () => {
      const created: ICreateOutput[] = [];
      const ctxMgr = await factory.getContextManager(orgName, "admin");
      const configs = [{ key: "Vision Zero", count: 12, groupId: "" }];
      try {
        for (const cfg of configs) {
          // create the group that will be the Initaitive's Project Collection Scope
          const group = await createScopeGroup(cfg, ctxMgr.context);
          cfg.groupId = group.id;
          // create initiative with metric definitions and project collection scope
          const initiative = await createInitiative(cfg, ctxMgr.context);
          // create projets with metric values, shared to the group
          const projects = await createProjects(
            cfg,
            initiative.id,
            ctxMgr.context
          );
          created.push({
            group,
            initiative,
            projects,
          });
        }
      } finally {
        for (const items of created) {
          const initiative = items.initiative.toJson();
          // console.info(`Initiative: ${initiative.id} Group: ${items.group.id}`);
          items.projects.forEach((project) => {
            // console.log(`Project: ${project.id}`);
          });
          // await cleanupItems(items, ctxMgr.context);
        }
      }
    });
  });

  const ITEMS = {
    initiative: "bbb90f365e064f48964ef9cadf53274e",
    projects: [
      "215b2b47bbd6495e853be754c0335c98",
      "2153c39345394ef2a3f393e8ae71cacb",
      "e162e11a85924e4bbd2df1c5f77d6fcb",
      "e7d4889a77714f5ea0546043eb85173f",
      "7bdde00b8e2e430cac0674467f449576",
      "de08aa6ad2f647109afa7df575065c08",
      "211cb17c9b5345398d96bb4385243140",
      "422e1e548dc54009993114ab97bd8524",
      "422712d8d19f4a2f9815c5ec1d07216f",
      "ba9fc199e77047d7a112bbccec235196",
      "55ef4ebd66074e91b02def785cfde4b6",
      "62958fdc68384b4b9a350c696a4f9c28",
    ],
  };

  describe("resolve project metrics:", () => {
    it("resolve static via function:", async () => {
      const ctxMgr = await factory.getContextManager(orgName, "admin");
      const context = ctxMgr.context;
      const project = await HubProject.fetch(ITEMS.projects[0], context);
      // pre-process the metrics
      const metrics = getEntityMetrics(project.toJson());
      const resolved = await resolveMetric(metrics[0], context);
      expect(resolved).toBeDefined();
      const resolvedMetric = resolved[0];
      expect(resolvedMetric.id).toEqual(ITEMS.projects[0]);
      expect(resolvedMetric.metricId).toEqual(metrics[0].id);
      expect(resolvedMetric.type).toEqual("Hub Project");
    });
    it("resolve dynamic via function:", async () => {
      const ctxMgr = await factory.getContextManager(orgName, "admin");
      const context = ctxMgr.context;
      const project = await HubProject.fetch(ITEMS.projects[0], context);
      // pre-process the metrics
      const metrics = getEntityMetrics(project.toJson());
      const resolved = await resolveMetric(metrics[1], context);
      expect(resolved).toBeDefined();
      const resolvedMetric = resolved[0];
      expect(resolvedMetric.id).toEqual(ITEMS.projects[0]);
      expect(resolvedMetric.metricId).toEqual(metrics[1].id);
      expect(resolvedMetric.type).toEqual("Hub Project");
    });
    it("resolve static via class method", async () => {
      const ctxMgr = await factory.getContextManager(orgName, "admin");
      const context = ctxMgr.context;
      const project = await HubProject.fetch(ITEMS.projects[0], context);
      const cityFundingMetric = await project.resolveMetric("cityFunding");
      expect(cityFundingMetric).toBeDefined();
      expect(cityFundingMetric.length).toBe(1);
    });
    it("resolve dynamic via class method", async () => {
      const ctxMgr = await factory.getContextManager(orgName, "admin");
      const context = ctxMgr.context;
      const project = await HubProject.fetch(ITEMS.projects[0], context);
      const metric = await project.resolveMetric(
        "surveysCompleted_bbb90f365e064f48964ef9cadf53274e"
      );
      expect(metric).toBeDefined();
      expect(metric.length).toBe(1);
      expect(metric[0].value).toBeGreaterThan(0);
    });
  });
  describe("resolve initiative metrics:", () => {
    it("resolve static via function:", async () => {
      const ctxMgr = await factory.getContextManager(orgName, "admin");
      const context = ctxMgr.context;
      const initiative = await HubInitiative.fetch(ITEMS.initiative, context);

      // pre-process the metrics
      const metrics = getEntityMetrics(initiative.toJson());
      // static metric
      const budgetMetric = findBy(metrics, "id", "budget");
      const resolved = await resolveMetric(budgetMetric, context);
      expect(resolved).toBeDefined();
      const resolvedMetric = resolved[0];
      expect(resolvedMetric.id).toEqual(ITEMS.initiative);
      expect(resolvedMetric.metricId).toEqual(budgetMetric.id);
      expect(resolvedMetric.type).toEqual("Hub Initiative");
      expect(resolvedMetric.value).toEqual(203000);
    });
    it("resolve dynamic via function:", async () => {
      const ctxMgr = await factory.getContextManager(orgName, "admin");
      const context = ctxMgr.context;
      const initiative = await HubInitiative.fetch(ITEMS.initiative, context);

      // pre-process the metrics
      const metrics = getEntityMetrics(initiative.toJson());
      // static metric
      const countyFunding = findBy(metrics, "id", "countyFunding");

      const resolved = await resolveMetric(countyFunding, context);
      expect(resolved).toBeDefined();
      expect(resolved.length).toEqual(12);

      resolved.forEach((metric) => {
        expect(metric.type).toEqual("Hub Project");
        expect(metric.metricId).toEqual(countyFunding.id);
      });
      const sum = aggregateMetrics(resolved, "sum");
      const count = aggregateMetrics(resolved, "count");
      const min = aggregateMetrics(resolved, "min");
      const max = aggregateMetrics(resolved, "max");
      const avg = aggregateMetrics(resolved, "avg");

      expect(avg).toBeCloseTo(106502.9, 1);
      expect(min).toEqual(15905);
      expect(max).toEqual(232672);
      expect(sum).toEqual(1278035);
      expect(count).toEqual(12);
    });
    it("resolve dynamic with strings via function:", async () => {
      const ctxMgr = await factory.getContextManager(orgName, "admin");
      const context = ctxMgr.context;
      const initiative = await HubInitiative.fetch(ITEMS.initiative, context);

      // pre-process the metrics
      const metrics = getEntityMetrics(initiative.toJson());
      // static metric
      const contractor = findBy(metrics, "id", "contractor");

      const resolved = await resolveMetric(contractor, context);
      expect(resolved).toBeDefined();
      expect(resolved.length).toEqual(12);

      resolved.forEach((metric) => {
        expect(metric.type).toEqual("Hub Project");
        expect(metric.metricId).toEqual(contractor.id);
        expect(metric.value).toBeDefined();
        expect(
          ["KPMG", "PWC", "HDR", "Timmons"].includes(metric.value as string)
        ).toBeTruthy();
      });
      const count = aggregateMetrics(resolved, "count");
      expect(count).toEqual(12);
      const cbv = aggregateMetrics(resolved, "countByValue");
      expect(cbv).toEqual({
        KPMG: 4,
        HDR: 4,
        PWC: 1,
        Timmons: 3,
      });
    });
    it("resolve service query via function:", async () => {
      const ctxMgr = await factory.getContextManager(orgName, "admin");
      const context = ctxMgr.context;
      const initiative = await HubInitiative.fetch(ITEMS.initiative, context);

      // pre-process the metrics
      const metrics = getEntityMetrics(initiative.toJson());
      // static metric
      const surveysCompleted = findBy(metrics, "id", "surveysCompleted");
      const start = Date.now();
      const resolved = await resolveMetric(surveysCompleted, context);
      const timing = Date.now() - start;
      // console.info(`12 projects querying feature service timing: ${timing}ms`);
      expect(resolved).toBeDefined();
      expect(resolved.length).toEqual(12);

      resolved.forEach((metric) => {
        expect(metric.type).toEqual("Hub Project");
        expect(metric.metricId).toEqual(surveysCompleted.id);
        expect(metric.value).toEqual(20);
      });
      // aggregate the values
      const sum = aggregateMetrics(resolved, "sum");
      const count = aggregateMetrics(resolved, "count");
      const min = aggregateMetrics(resolved, "min");
      const max = aggregateMetrics(resolved, "max");
      const avg = aggregateMetrics(resolved, "avg");
      expect(avg).toEqual(20);
      expect(min).toEqual(20);
      expect(max).toEqual(20);
      expect(sum).toEqual(240);
      expect(count).toEqual(12);
    });
  });
});
