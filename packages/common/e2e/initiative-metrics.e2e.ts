import {
  createGroup,
  IGroup,
  IGroupAdd,
  ISearchOptions,
  removeGroup,
  removeItem,
  searchItems,
} from "@esri/arcgis-rest-portal";

import {
  cloneObject,
  getProp,
  HubInitiative,
  HubProject,
  IArcGISContext,
  IHubCollection,
  IHubInitiative,
  IHubProject,
  IMetric,
  resolveInitiativeMetrics,
  resolveMetric,
  resolveMetrics,
} from "../src";

import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";
import { preprocessMetrics } from "../src/metrics/preprocessMetrics";
import {
  createInitiative,
  createProjects,
  createScopeGroup,
  ICreateOutput,
} from "./helpers/harness-crud";

const HARNESS_ID = "1c612455c49147fda5e4b86baf4f51d9";

describe("Initiative Metrics:", () => {
  let factory: Artifactory;
  const orgName = "hubPremium";
  beforeAll(() => {
    factory = new Artifactory(config);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
  });

  // STATUS
  // Initaitive seems to be good; resolving metrics is "working" in that it's not exploding
  // Next - get the resolution working, returning the hash as expected

  // describe("create harnesses", () => {
  //   it("create iniitative and projects", async () => {
  //     debugger;
  //     const created: ICreateOutput[] = [];
  //     const ctxMgr = await factory.getContextManager(orgName, "admin");
  //     const configs = [
  //       { key: "Water", count: 2, groupId: "" },
  //       // { key: "Vision Zero", count: 10 },
  //       // { key: "Parks", count: 25 },
  //       // { key: "Trees", count: 50 },
  //     ];
  //     try {
  //       for (const config of configs) {
  //         // create the group that will be the Initaitive's Project Collection Scope
  //         const group = await createScopeGroup(config, ctxMgr.context);
  //         config.groupId = group.id;
  //         // create initiative with metric definitions and project collection scope
  //         const initiative = await createInitiative(config, ctxMgr.context);
  //         // create projets with metric values, shared to the group
  //         const projects = await createProjects(
  //           config,
  //           initiative.id,
  //           ctxMgr.context
  //         );
  //         created.push({
  //           group,
  //           initiative: initiative,
  //           projects: projects,
  //         });
  //       }
  //       debugger;
  //     } finally {
  //       for (const items of created) {
  //         const initiative = items.initiative.toJson();
  //         console.info(`Initiative: ${initiative.id} Group: ${items.group.id}`);
  //         items.projects.forEach((project) => {
  //           console.log(`Project: ${project.id}`);
  //         });

  //         // await cleanupItems(items, ctxMgr.context);
  //       }
  //     }
  //   });
  // });

  // it("destroy test data", async () => {
  //   const ctxMgr = await factory.getContextManager(orgName, "admin");
  //   const context = ctxMgr.context;
  //   const initiativeIds = ["51aa6da82cd74d87beee1be2333ad149"];

  //   // Get projects associated with each initiative
  //   for (const initiativeId of initiativeIds) {
  //     const initiative = await HubInitiative.fetch(
  //       initiativeId,
  //       ctxMgr.context
  //     );
  //     const options: ISearchOptions = {
  //       q: `type: "Hub Project" AND typekeywords: initiative|${initiative.id}`,
  //     };
  //     const projects = await searchItems({
  //       ...options,
  //       authentication: context.requestOptions.authentication,
  //     });
  //     // delete each project
  //     for (const project of projects.results) {
  //       await removeItem({ id: project.id, authentication: context.session });
  //     }

  //     // Delete the initiative
  //     await initiative.delete();
  //   }
  // });

  describe("resolve initiative metrics", () => {
    it("resolve all metrics via class", async () => {
      const ctxMgr = await factory.getContextManager(orgName, "admin");
      const context = ctxMgr.context;
      // fetch the initiative by id
      const initiative = await HubInitiative.fetch(HARNESS_ID, context);

      const resolved = await initiative.resolveMetrics();
      expect(resolved).toEqual({
        countyFunding: {
          value: 400201,
          title: "Larimer County Funding",
          unit: "$",
          unitPosition: "before",
          order: 3,
          sources: [
            {
              id: "1117fc7804d94318a5ae9b11350ba28c",
              label: "Test Water Project 1",
              type: "Hub Project",
              value: 300201,
            },
            {
              id: "87323a82187d4526bc85e6078111ec41",
              label: "Test Water Project 0",
              type: "Hub Project",
              value: 100000,
            },
          ],
        },
        surveysCompleted: {
          value: 40,
          title: "Customer Surveys",
          order: 1,
          sources: [
            {
              id: "1117fc7804d94318a5ae9b11350ba28c",
              label: "Test Water Project 1",
              type: "Hub Project",
              value: 20,
            },
            {
              id: "87323a82187d4526bc85e6078111ec41",
              label: "Test Water Project 0",
              type: "Hub Project",
              value: 20,
            },
          ],
        },
      });
    });

    it("resolve all metrics via function", async () => {
      const ctxMgr = await factory.getContextManager(orgName, "admin");
      const context = ctxMgr.context;
      const initiative = await HubInitiative.fetch(HARNESS_ID, context);
      const resolved = await resolveInitiativeMetrics(
        initiative.toJson(),
        context
      );

      expect(resolved).toEqual({
        countyFunding: {
          value: 400201,
          title: "Larimer County Funding",
          unit: "$",
          unitPosition: "before",
          order: 3,
          sources: [
            {
              id: "1117fc7804d94318a5ae9b11350ba28c",
              label: "Test Water Project 1",
              type: "Hub Project",
              value: 300201,
            },
            {
              id: "87323a82187d4526bc85e6078111ec41",
              label: "Test Water Project 0",
              type: "Hub Project",
              value: 100000,
            },
          ],
        },
        surveysCompleted: {
          value: 40,
          title: "Customer Surveys",
          order: 1,
          sources: [
            {
              id: "1117fc7804d94318a5ae9b11350ba28c",
              label: "Test Water Project 1",
              type: "Hub Project",
              value: 20,
            },
            {
              id: "87323a82187d4526bc85e6078111ec41",
              label: "Test Water Project 0",
              type: "Hub Project",
              value: 20,
            },
          ],
        },
      });
    });
    it("resolve single metric via function", async () => {
      const ctxMgr = await factory.getContextManager(orgName, "admin");
      const context = ctxMgr.context;
      const initiative = await HubInitiative.fetch(HARNESS_ID, context);
      // dereference the metrics
      const metrics = preprocessMetrics(initiative.toJson());
      // now we can resolve them individually
      const cfMetric = await resolveMetric(metrics.countyFunding, context);

      const scMetric = await resolveMetric(metrics.surveysCompleted, context);

      expect(cfMetric).toEqual({
        countyFunding: {
          value: 400201,
          title: "Larimer County Funding",
          unit: "$",
          unitPosition: "before",
          order: 3,
          sources: [
            {
              id: "1117fc7804d94318a5ae9b11350ba28c",
              label: "Test Water Project 1",
              type: "Hub Project",
              value: 300201,
            },
            {
              id: "87323a82187d4526bc85e6078111ec41",
              label: "Test Water Project 0",
              type: "Hub Project",
              value: 100000,
            },
          ],
        },
      });
      expect(scMetric).toEqual({
        surveysCompleted: {
          value: 40,
          title: "Customer Surveys",
          order: 1,
          sources: [
            {
              id: "1117fc7804d94318a5ae9b11350ba28c",
              label: "Test Water Project 1",
              type: "Hub Project",
              value: 20,
            },
            {
              id: "87323a82187d4526bc85e6078111ec41",
              label: "Test Water Project 0",
              type: "Hub Project",
              value: 20,
            },
          ],
        },
      });
    });
  });
});
