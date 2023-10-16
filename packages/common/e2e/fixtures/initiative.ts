import { IModel } from "../../src";

const model: IModel = {
  item: {
    id: "00c",
    title: "My Initiative",
    type: "Hub Initiative",
    owner: "dave",
    tags: ["Initiative"],
    created: 123456789,
    modified: 123456789,
    description: "This is my Initiative",
    snippet: "This is my Initiative",
    culture: "en-us",
    numViews: 1123,
    size: 2,
    properties: {
      metrics: [
        {
          id: "initiativeBudget",
          name: "Initiative Budget",
          source: {
            metricType: "static-value",
            value: 100000,
          },
        },
        {
          id: "contractor",
          name: "People working on project",
          description: "Initiative Contractor",
          source: {
            metricType: "item-query",
            keywords: ["initiative|00c"],
            itemTypes: ["Hub Project"],
            collectionKey: "projects",
          },
        },
        {
          id: "fundsSpent",
          name: "Funds Spent",
          description: "Funds spent thus far",
          units: "USD",
          source: {
            metricType: "item-query",
            keywords: ["initiative|00c"],
            itemTypes: ["Hub Project"],
            collectionKey: "projects",
          },
        },
        {},
      ],
    },
  },
  data: {
    view: {
      metricCards: [
        {
          title: "Funds Spent",
          metricId: "fundsSpent",
          aggregation: "sum",
        },
        {
          title: "Min Project Spend",
          metricId: "fundsSpent",
          aggregation: "min",
        },
        {
          title: "Max Project Spend",
          metricId: "fundsSpent",
          aggregation: "max",
        },
        {
          title: "Avg Project Spend",
          metricId: "fundsSpent",
          aggregation: "avg",
        },
      ],
    },
  },
};

// const Initiative:IHubInitiative = {
//   id: '3ef',
//   name: 'My Initiative',
//   description: 'This is my Initiative',

// }
