import {
  DynamicValueDefinition,
  HubInitiative,
  HubProject,
  IArcGISContext,
  IDynamicItemQueryDefinition,
  IDynamicPortalQueryDefinition,
  IDynamicServiceQueryDefinition,
  IHubInitiative,
  IHubProject,
  resolveDynamicValues,
  setProp,
} from "../src";

import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";

fdescribe("catalog and collection e2e:", () => {
  let factory: Artifactory;
  const orgName = "hubPremium";
  beforeAll(() => {
    factory = new Artifactory(config);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
  });
  it("create and destroy harness", async () => {
    const ctxMgr = await factory.getContextManager(orgName, "admin");
    const items = await createItems(5, false, ctxMgr.context);

    try {
      // given the initiative, resolve it's dynamic values
      const start = Date.now();
      const resolved = await resolveEntityDynamicValues(
        items.initiative.toJson(),
        ctxMgr.context
      );
      const end = Date.now();
      const duration = end - start;

      // expectations
      const expected = {
        treesPlanted: 60,
        statusCounts: {
          started: 2,
          planned: 2,
        },
        surveyCounts: 204,
        orgShort: "qa-pre-hub",
        orgName: "QA Premium Hub",
        extent: {
          xmin: -14999999.999999745,
          ymin: 2699999.999999951,
          xmax: -6199999.999999896,
          ymax: 6499999.99999985,
          spatialReference: {
            wkid: 102100,
          },
        },
      };

      expect(resolved.orgShort).toEqual(expected.orgShort, "orgShort mismatch");
      expect(resolved.orgName).toEqual(expected.orgName, "orgName mismatch");
      expect(resolved.extent).toEqual(expected.extent, "extent mismatch");

      // console.info(
      //   `Resolved for ${items.projects.length} children in ${duration}ms`
      // );
      // console.info(`Static Values took ${timings.staticValues}ms`);
      // console.info(`Query Values took ${timings.queryValues}ms`);
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

async function resolveEntityDynamicValues(
  initiative: IHubInitiative,
  context: IArcGISContext
): Promise<Record<string, any>> {
  const dv = (initiative.dynamicValues ||
    []) as unknown as DynamicValueDefinition[];
  return resolveDynamicValues(dv, context);
}

interface ICreateOutput {
  initiative: HubInitiative;
  projects: HubProject[];
}

async function createItems(
  childCount: number,
  includeFSQuery: boolean,
  context: IArcGISContext
): Promise<ICreateOutput> {
  const result: ICreateOutput = {
    // THIS IS TERRIBLE! DO NOT DO THIS IN PRODUCTION CODE!
    initiative: null as unknown as HubInitiative,
    projects: [],
  };
  // Create an initiative
  const init: Partial<IHubInitiative> = {
    name: "Test Initiative",
    description: "This is a test initiative",
    orgUrlKey: context.portal.urlKey,
  };
  const instance = await HubInitiative.create(init, context, true);
  // Construct typed dynamic value definitions
  const treesDynamicValue: IDynamicItemQueryDefinition = {
    source: "item-query",
    sourcePath: `properties.values.${instance.id}.treesPlanted`,
    outPath: "treesPlanted",
    options: {
      q: `type: "Hub Project" AND typekeywords: initiative|${instance.id}`,
    },
    aggregation: "sum",
    required: false,
  };
  const statusDynamicValue: IDynamicItemQueryDefinition = {
    source: "item-query",
    sourcePath: `properties.values.${instance.id}.status`,
    outPath: "statusCounts",
    options: {
      q: `type: "Hub Project" AND typekeywords: initiative|${instance.id}`,
    },
    aggregation: "countByValue",
    required: true,
  };
  const cascadeDynamicValue: IDynamicItemQueryDefinition = {
    source: "item-query",
    options: {
      q: `type: "Hub Project" AND typekeywords: initiative|${instance.id}`,
    },
    sourcePath: `properties.values.${instance.id}.surveyCount`,
    outPath: "surveyCounts",
    aggregation: "sum",
    required: false,
  };

  const dynamicValues = [
    treesDynamicValue,
    statusDynamicValue,
    cascadeDynamicValue,
    {
      source: "portal",
      sourcePath: `urlKey`,
      outPath: "orgShort",
    } as IDynamicPortalQueryDefinition,
    {
      source: "portal",
      sourcePath: `name`,
      outPath: "orgName",
    } as IDynamicPortalQueryDefinition,
    {
      source: "portal",
      sourcePath: `defaultExtent`,
      outPath: "extent",
    } as IDynamicPortalQueryDefinition,
  ];
  // This is icky... makes me consider adding methods to the class
  const json = instance.toJson();
  json.dynamicValues = dynamicValues;
  instance.update(json);
  await instance.save();
  result.initiative = instance;
  // add 2 metrics to the initiative
  // Create N projects connected to the initiative
  const connectingKeyword = `initiative|${instance.id}`;
  // assign values to tne metrics for each project
  for (let i = 0; i < childCount; i++) {
    const prj: Partial<IHubProject> = {
      name: `Test Project ${i}`,
      description: "This is a test project",
      orgUrlKey: context.portal.urlKey,
      typeKeywords: [connectingKeyword, "HubProject"],
      values: {
        [instance.id]: {
          treesPlanted: i * 10,
          status: i % 2 === 0 ? "planned" : "started",
        },
      },
    };
    if (includeFSQuery) {
      const colors = ["red", "orange", "yellow", "blue", "green"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const sc: IDynamicServiceQueryDefinition = {
        source: "service-query",
        // The actual service is contrived from another test harness, but it's a simple point service with 100 features
        options: {
          url: "https://servicesqa.arcgis.com/T5cZDlfUaBpDnk6P/arcgis/rest/services/hub_e2e_fixture_tc121302_simple_point_100/FeatureServer/0",
          where: `expected_color = '${color}'`,
          field: "quant_val",
          statisticType: "count",
        },
        aggregation: "count",
        outPath: "surveyCount",
        required: false,
      };
      setProp(`values.${instance.id}.surveyCount`, sc, prj);
    } else {
      setProp(`values.${instance.id}.surveyCount`, i * 34, prj);
    }
    const project = await HubProject.create(prj, context, true);
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
