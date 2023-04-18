import { createGroup, removeGroup } from "@esri/arcgis-rest-portal";
import { IGroup, IGroupAdd } from "@esri/arcgis-rest-types";
import {
  IArcGISContext,
  HubInitiative,
  IHubInitiative,
  IHubCollection,
  HubProject,
  IHubProject,
  IMetric,
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
  const metrics: IMetric[] = [];
  // add metrics to the initiative

  // Simple Static Metric
  metrics.push({
    id: "budget",
    name: "Initiative Budget",
    description: "Total budget for the initiative",
    units: "$",
    source: {
      type: "static-value",
      value: 203000,
    },
  });
  // Item Query Metric that will be resolved with static values
  metrics.push({
    id: "countyFunding",
    name: "County Funding",
    description: "Total funding from Larimer County",
    units: "USD",
    source: {
      type: "item-query",
      propertyPath: `properties.metrics[findBy(id,countyFunding_${initiativeId})]`,
      keywords: [`initiative|${initiativeId}`],
      itemTypes: ["Hub Project"],
      collectionKey: "projects",
    },
  });
  // Item Query Metric that will be resolved with dynamic values
  metrics.push({
    id: "surveysCompleted",
    name: "Surveys Completed",
    description: "Total number of surveys completed",
    source: {
      type: "item-query",
      propertyPath: `properties.metrics[findBy(id,surveysCompleted_${initiativeId})]`,
      keywords: [`initiative|${initiativeId}`],
      itemTypes: ["Hub Project"],
      collectionKey: "projects",
    },
  });

  metrics.push({
    id: "contractor",
    name: "Project Constractor",
    description: "Contractor for the project",
    source: {
      type: "item-query",
      propertyPath: `properties.metrics[findBy(id,contractor_${initiativeId})]`,
      keywords: [`initiative|${initiativeId}`],
      itemTypes: ["Hub Project"],
      collectionKey: "projects",
    },
  });

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
  const metrics: IMetric[] = [];

  /**
   *  Randomly select a contractor
   */
  const contractors = ["KPMG", "PWC", "HDR", "Timmons"];
  const contractor =
    contractors[Math.floor(Math.random() * contractors.length)];

  metrics.push({
    id: `contractor_${parentId}`,
    source: {
      type: "static-value",
      value: contractor,
    },
  });

  /**  Random countyFunding number betwen 10000 and 230000 */
  const countyFunding = Math.floor(Math.random() * 230000) + 10000;
  metrics.push({
    id: `countyFunding_${parentId}`,
    source: {
      type: "static-value",
      value: countyFunding,
    },
  });

  const cityFunding = Math.floor(Math.random() * 130000) + 20000;
  metrics.push({
    id: "cityFunding",
    source: {
      type: "static-value",
      value: cityFunding,
    },
  });

  // fake surveys completed by running a random query against a feature service
  const colors = ["red", "orange", "yellow", "blue", "green"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  metrics.push({
    id: `surveysCompleted_${parentId}`,
    source: {
      type: "service-query",
      serviceUrl:
        "https://servicesqa.arcgis.com/T5cZDlfUaBpDnk6P/arcgis/rest/services/hub_e2e_fixture_tc121302_simple_point_100/FeatureServer",
      layerId: 0,
      where: `expected_color = '${color}'`,
      field: "quant_val",
      statistic: "count",
    },
  });

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
