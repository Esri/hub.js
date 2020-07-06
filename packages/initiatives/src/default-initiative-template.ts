import { IInitiativeModelTemplate, IBBox } from "@esri/hub-common";

export const DEFAULT_INITIATIVE_TEMPLATE: IInitiativeModelTemplate = {
  item: {
    title: "{{solution.title}}",
    snippet: "{{solution.snippet}}",
    description: "{{solution.snippet}}",
    type: "Hub Initiative",
    typeKeywords: ["Hub", "hubInitiative"],
    tags: [],
    extent: ("{{organization.defaultExtentBBox}}" as unknown) as IBBox,
    culture: "{{user.culture}}",
    properties: {},
    url: ""
  },
  data: {
    assets: [],
    indicators: [],
    recommendedTemplates: []
  }
};
