import { IHubProject, IModel } from "../../src";

const projectmodel: IModel = {
  item: {
    id: "3ef",
    title: "My Project",
    type: "Hub Project",
    owner: "dave",
    tags: ["project"],
    created: 123456789,
    modified: 123456789,
    description: "This is my project",
    snippet: "This is my project",
    culture: "en-us",
    numViews: 1123,
    size: 2,
    typeKeywords: ["initiative|00c", "initiative|ff0"],
    properties: {
      metrics: [
        {
          id: "projectFunding",
          name: "Project Funding",
          source: {
            metricType: "static-value",
            value: 20000,
          },
        },
        {
          id: "contractor",
          name: "Contractor",
          description: "Project Contractor",
          source: {
            metricType: "static-value",
            value: "Acme",
          },
        },
        {
          id: "fundsSpent_00c",
          source: {
            metricType: "service-value",
            serviceUrl:
              "https://services.arcgis.com/abc/arcgis/rest/services/Initiative/FeatureServer",
            layerId: 0,
            field: "budget",
            statistic: "sum",
            where: "status = 'complete'",
          },
        },
        {
          // reuse an existing metric
          id: "contactor_ff0",
          source: {
            $use: "properties.metrics[findBy(id, 'contractor')].source",
          },
        },
      ],
    },
  },
  data: {
    view: {
      metricCards: [
        {
          title: "Funds Spent",
          // storing the id requires that the metrics hash
          // be passed into the card component or pre-resolved
          metricId: "fundsSpent_00c",
          metric: {
            // storing as an object would allow the metric
            // to be resolved at load time
            $use: "properties.metrics[findBy(id, 'fundsSpent_00c')]",
          },
          aggregation: "sum",
        },
        {
          title: "Project Budget",
          metricId: "projectFunding",
          aggregation: "sum",
        },
        {
          title: "Project Contractor",
          metricId: "contractor",
          aggregation: "max",
        },
      ],
    },
  },
};

// const project:IHubProject = {
//   id: '3ef',
//   name: 'My Project',
//   description: 'This is my project',

// }
