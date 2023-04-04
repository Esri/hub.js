import { createGroup, removeGroup } from "@esri/arcgis-rest-portal";
import { IGroup, IGroupAdd } from "@esri/arcgis-rest-types";
import {
  IArcGISContext,
  HubInitiative,
  IHubInitiative,
  IHubCollection,
  HubProject,
  IHubProject,
} from "../../src";

export async function createScopeGroup(
  config: { key: string; count: number },
  context: IArcGISContext
): Promise<IGroup> {
  const group: IGroupAdd = {
    title: `Test ${config.key} Group with ${config.count} Projects`,
    description: `This is a test Group connecting to projects`,
    tags: ["doNotDelete"],
    access: "public",
  };
  const resp = await createGroup({
    group,
    authentication: context.requestOptions.authentication,
  });
  return resp.group;
}

export async function createInitiative(
  config: { key: string; count: number; groupId: string },
  context: IArcGISContext
): Promise<HubInitiative> {
  const init: Partial<IHubInitiative> = {
    name: `Test ${config.key} Initiative with ${config.count} Projects`,
    description: `This is a test Initiative connecting to projects`,
    typeKeywords: ["doNotDelete"],
    orgUrlKey: context.portal.urlKey,
  };
  const instance = await HubInitiative.create(init, context, true);

  const initiativeId = instance.id;
  // construct metrics
  const metrics: Record<string, any> = {};
  // add metrics to the initiative
  metrics.cc1_cty_funding = {
    $use: "#/metrics/countyFunding",
  };
  metrics.countyFunding = {
    source: {
      type: "item-query",
      outPath: "countyFunding",
      sourcePath: `properties.metrics.countyFunding_${initiativeId}.source`,
      query: {
        targetEntity: "item",
        filters: [
          {
            operation: "AND",
            predicates: [
              {
                type: "Hub Project",
                typekeywords: `initiative|${initiativeId}`,
              },
            ],
          },
        ],
      },
      scope: {
        $use: "catalog.collections[findBy(key,projects)].scope",
      },
      aggregation: "sum",
      includeRawValues: true,
    },
    display: {
      title: "Larimer County Funding",
      units: "$",
      unitPosition: "before",
      order: 3,
    },
    editor: {
      type: "number",
      label: "County Funding",
      description: "Total funding from Larimer County",
    },
  };
  metrics.surveysCompleted = {
    source: {
      type: "item-query",
      sourcePath: `properties.metrics.surveysCompleted_${initiativeId}.source`,
      outPath: "surveysCompleted",
      aggregation: "sum",
      query: {
        targetEntity: "item",
        filters: [
          {
            operation: "AND",
            predicates: [
              {
                type: "Hub Project",
                typekeywords: `initiative|${initiativeId}`,
              },
            ],
          },
        ],
      },
      scope: {
        $use: "catalog.collections[findBy(key,projects)].scope",
      },
      includeRawValues: true,
    },
    display: {
      title: "Customer Surveys",
      order: 1,
    },
    editor: {},
  };

  // add metrics to the initiative
  const json = instance.toJson();
  json.metrics = metrics;
  // cfreate the projects collection with the scope pointing to the group
  const projectCollection: IHubCollection = {
    key: "projects",
    label: "Projects",
    targetEntity: "item",
    scope: {
      targetEntity: "item",
      filters: [
        {
          operation: "AND",
          predicates: [{ group: [config.groupId] }],
        },
      ],
    },
  };
  json.catalog.collections = [projectCollection];
  instance.update(json);
  await instance.save();
  await instance.setAccess("public");

  return instance;
}

export async function createProjects(
  config: { key: string; count: number; groupId: string },
  parentId: string,
  context: IArcGISContext
): Promise<HubProject[]> {
  const projects: HubProject[] = [];
  for (let i = 0; i < config.count; i++) {
    const project = await createChildProject(
      config.key,
      i,
      parentId,
      config.groupId,
      context
    );

    projects.push(project);
  }
  return projects;
}

export async function createChildProject(
  key: string,
  num: number,
  parentId: string,
  groupId: string,
  context: IArcGISContext
): Promise<HubProject> {
  const project: Partial<IHubProject> = {
    name: `Test ${key} Project ${num}`,
    description: `This is a test Project`,
    typeKeywords: ["doNotDelete", `initiative|${parentId}`],
    orgUrlKey: context.portal.urlKey,
  };
  const instance = await HubProject.create(project, context, true);

  // construct metrics
  const metrics: Record<string, any> = {};

  metrics[`countyFunding_${parentId}`] = {
    source: {
      type: "static-value",
      value: 100000, // number or string
    },
    display: {
      type: "stat-card",
      title: "Total Funding",
      units: "$",
      unitPosition: "before",
      order: 2,
    },
    editor: {
      type: "number",
      label: "Total Project Funding",
      description: "Total funding from all sources",
    },
  };

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
  metrics[`surveysCompleted_${parentId}`] = {
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
  await instance.shareWithGroup(groupId);

  return instance;
}

export interface ICreateOutput {
  group: IGroup;
  initiative: HubInitiative;
  projects: HubProject[];
}

export async function cleanupItems(
  created: ICreateOutput,
  context: IArcGISContext
): Promise<any> {
  // delete the initiative
  await created.initiative.delete();

  // delete the projects
  await Promise.all(
    created.projects.map(async (project) => {
      return project.delete();
    })
  );
  // now we can delete the group
  await removeGroup({
    id: created.group.id,
    authentication: context.session,
  });
}
