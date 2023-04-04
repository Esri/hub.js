import {
  ISearchOptions,
  removeItem,
  searchItems,
} from "@esri/arcgis-rest-portal";
import {
  HubInitiative,
  HubProject,
  IArcGISContext,
  IDynamicServiceQueryDefinition,
  IHubInitiative,
  IHubProject,
  setProp,
  IMetric,
  IMetricEditor,
} from "../src";

import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";

describe("catalog and collection e2e:", () => {
  let factory: Artifactory;
  const orgName = "hubPremium";
  beforeAll(() => {
    factory = new Artifactory(config);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
  });

  // // Used as one-off generator for test data
  // it("create test items", async () => {
  //   const created: ICreateOutput[] = [];
  //   const ctxMgr = await factory.getContextManager(orgName, "admin");
  //   const configs = [
  //     { key: "Water", count: 5 },
  //     // { key: "Vision Zero", count: 10 },
  //     // { key: "Parks", count: 25 },
  //     // { key: "Trees", count: 50 },
  //   ];
  //   try {
  //     for (const c of configs) {
  //       const items = await createItems(c.key, c.count, false, ctxMgr.context);
  //       created.push(items);
  //     }
  //     // debugger;
  //   } finally {
  //     for (const items of created) {
  //       const initiative = items.initiative.toJson();
  //       // console.info(
  //       //   `Harness Initiative: ${initiative.id} - ${initiative.name} - ${initiative.owner}`
  //       // );
  //       // await cleanupItems(items, ctxMgr.context);
  //     }
  //   }
  // });

  // it("destroy test data", async () => {
  //   const ctxMgr = await factory.getContextManager(orgName, "admin");
  //   const context = ctxMgr.context;
  //   const initiativeIds = [
  //     "4d0952f99491427dbd3a0b1d7af74851",
  //     "bc8e958e41654d169bed81d7936e1b3e",
  //   ];

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

  it("debug Metric resolution", async () => {
    const ctxMgr = await factory.getContextManager(orgName, "admin");
    const items = await createItems(
      "Metric Debugging",
      3,
      false,
      ctxMgr.context
    );

    try {
      // given the initiative, resolve it's dynamic values
      const start = Date.now();

      const resolved = await items.initiative.resolveMetrics();
      const end = Date.now();
      const duration = end - start;
    } catch (ex) {
      expect(ex).toBeNull('Exception thrown: "' + ex + '"');
    } finally {
      await cleanupItems(items, ctxMgr.context);
    }
  });
});

const timings: Record<string, number> = {
  total: 0,
  staticValues: 0,
  queryValues: 0,
};

interface ICreateOutput {
  initiative: HubInitiative;
  projects: HubProject[];
}

async function createItems(
  key: string,
  childCount: number,
  includeFSQuery: boolean,
  context: IArcGISContext
): Promise<ICreateOutput> {
  const result: ICreateOutput = {
    // --------------------------------------------
    // NOTE: DO NOT DO THIS TYPE OF CASTING IN PRODUCTION CODE!
    // it's fine in tests, but this is nuking type safety
    initiative: null as unknown as HubInitiative,
    // --------------------------------------------
    projects: [],
  };
  // Create an initiative
  const init: Partial<IHubInitiative> = {
    name: `Test ${key} Initiative with ${childCount} Projects`,
    description: `This is a test initiative with ${childCount} Projects`,
    typeKeywords: ["doNotDelete"],
    orgUrlKey: context.portal.urlKey,
  };
  const instance = await HubInitiative.create(init, context, true);

  // Construct typed dynamic value definitions
  const treesMetric: IMetric = {
    id: "treesPlanted",
    required: false,
    display: {
      title: "Trees Planted",
      subtitle: "Total Trees Planed by all projects",
      order: 1,
    },
    source: {
      type: "item-query",
      sourcePath: `properties.metrics.${instance.id}.treesPlanted`,
      outPath: "treesPlanted",
      query: {
        targetEntity: "item",
        filters: [
          {
            operation: "AND",
            predicates: [
              {
                type: "Hub Project",
                typekeywords: `initiative|${instance.id}`,
              },
            ],
          },
        ],
      },
      aggregation: "sum",
    },
    editor: {} as IMetricEditor,
  };
  const projectsMetric: IMetric = {
    id: "projectCount",
    display: {
      title: "Total Projects",
      order: 2,
    },
    source: {
      type: "item-query",
      sourcePath: `id`,
      outPath: "projectCount",
      query: {
        targetEntity: "item",
        filters: [
          {
            operation: "AND",
            predicates: [
              {
                type: "Hub Project",
                typekeywords: `initiative|${instance.id}`,
              },
            ],
          },
        ],
      },
      aggregation: "count",
    },
    editor: {} as IMetricEditor,
    required: false,
  };
  const staticMetric: IMetric = {
    id: "startYear",
    display: { title: "Start Year", order: 3 },
    source: {
      type: "static-value",
      value: 2020,
      outPath: "startYear",
    },
    editor: {} as IMetricEditor,

    required: false,
  };
  const statusMetric: IMetric = {
    id: "statusCounts",
    display: { title: "Status Counts", order: 4 },
    source: {
      type: "item-query",
      sourcePath: `properties.metrics.${instance.id}.status`,
      outPath: "statusCounts",
      query: {
        targetEntity: "item",
        filters: [
          {
            operation: "AND",
            predicates: [
              {
                type: "Hub Project",
                typekeywords: `initiative|${instance.id}`,
              },
            ],
          },
        ],
      },
      aggregation: "countByValue",
    },
    editor: {} as IMetricEditor,
    required: true,
  };
  const cascadeMetric: IMetric = {
    id: "surveyCounts",
    display: { title: "Budget", unit: "$", unitPosition: "before", order: 5 },
    source: {
      type: "item-query",
      query: {
        targetEntity: "item",
        filters: [
          {
            operation: "AND",
            predicates: [
              {
                type: "Hub Project",
                typekeywords: `initiative|${instance.id}`,
              },
            ],
          },
        ],
      },
      sourcePath: `properties.metrics.${instance.id}.surveyCount`,
      outPath: "surveyCounts",
      aggregation: "sum",
    },
    editor: {} as IMetricEditor,
    required: false,
  };

  const dynamicValues = {
    startYear: staticMetric,
    projectCount: projectsMetric,
    treesPlanted: treesMetric,
    statusCounts: statusMetric,
    surveyCounts: cascadeMetric,
  };
  // This is icky... makes me consider adding methods to the class
  const json = instance.toJson();
  json.metrics = dynamicValues;
  instance.update(json);
  await instance.save();
  await instance.setAccess("public");
  result.initiative = instance;
  // add 2 Imetrics to the initiative
  // Create N projects connected to the initiative
  const connectingKeyword = `initiative|${instance.id}`;
  // assign values to tne Imetrics for each project
  for (let i = 0; i < childCount; i++) {
    const prj: Partial<IHubProject> = {
      name: `Test ${key} Project ${i}`,
      description: "This is a test project",
      orgUrlKey: context.portal.urlKey,
      typeKeywords: [connectingKeyword, "HubProject", "doNotDelete"],
      metrics: {},
    };
    if (includeFSQuery) {
      const colors = ["red", "orange", "yellow", "blue", "green"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const sc: IDynamicServiceQueryDefinition = {
        type: "service-query",
        // The actual service is contrived from another test harness, but it's a simple point service with 100 features
        options: {
          url: "https://servicesqa.arcgis.com/T5cZDlfUaBpDnk6P/arcgis/rest/services/hub_e2e_fixture_tc121302_simple_point_100/FeatureServer/0",
          where: `expected_color = '${color}'`,
          field: "quant_val",
          statisticType: "count",
        },
        aggregation: "count",
        outPath: "surveyCount",
      };
      setProp(`metrics.${instance.id}.surveyCount`, sc, prj);
    } else {
      setProp(`metrics.${instance.id}.surveyCount`, i * 34, prj);
    }
    const project = await HubProject.create(prj, context, true);
    await project.setAccess("public");
    result.projects.push(project);
  }
  return result;
}

async function cleanupItems(
  created: ICreateOutput,
  context: IArcGISContext
): Promise<any> {
  // delete the initiative
  await created.initiative.delete();
  // delete the projects
  return Promise.all(
    created.projects.map(async (project) => {
      return project.delete();
    })
  );
}
