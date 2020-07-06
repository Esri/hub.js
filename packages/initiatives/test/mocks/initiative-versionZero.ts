/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import {
  IInitiativeModel,
  IInitiativeModelTemplate,
  IInitiativeItem
} from "@esri/hub-common";

export const initiativeVersionZero: IInitiativeModel = {
  item: {
    id: "c5963a6bb6244eb8b8fb4f56cb0bef4c",
    owner: "cclaessens_dcqa",
    created: 1507920879000,
    modified: 1532444916000,
    guid: null,
    name: null,
    title: "!Vision Zero ",
    type: "Hub Initiative",
    typeKeywords: [
      "Hub",
      "hubIndicatorName|nhtsa_wat",
      "hubInitiative",
      "OpenData"
    ],
    description:
      "Share your VisionZero strategy. Schedule events on pedestrian & bicycle safety. Gather reports of dangerous intersections. Explore collision trends and areas to improve. -- Vision Zero is a worldwide safety project that aims to achieve a highway system with no traffic fatalities and severe injuries caused by road traffic. Communities around the world have launched Vision Zero initiatives with the goal of reducing and ultimately eliminating traffic-related fatalities and injuries while increasing safe, healthy, equitable mobility for all.\n\n",
    tags: ["Hub Initiative"],
    snippet: "Eliminate all traffic fatalities and severe injuries.",
    thumbnail: "thumbnail/ago_downloaded.png",
    documentation: null,
    extent: [],
    categories: [],
    spatialReference: "null",
    accessInformation: "Esri",
    licenseInfo: "CC-BY",
    culture: "en-us",
    properties: {
      source: "e3f65f7cb7ef4dbca590498b035fd6b3",
      groupId: "4aa2a5215c884814b51a532d18fb7953",
      openDataGroupId: "4cfba68ecefe41c1b61524d74f0bbccf"
    },
    url: "https://-vision-zero--dc.hubqa.arcgis.com",
    proxyFilter: null,
    access: "shared",
    size: -1,
    appCategories: [],
    industries: [],
    languages: [],
    largeThumbnail: null,
    banner: null,
    screenshots: [],
    listed: false,
    numComments: 0,
    numRatings: 0,
    avgRating: 0,
    numViews: 69,
    scoreCompleteness: 76,
    groupDesignations: null
  } as IInitiativeItem,
  data: {
    source: "e3f65f7cb7ef4dbca590498b035fd6b3",
    values: {
      collaborationGroupId: "4aa2a5215c884814b51a532d18fb7953",
      openDataGroupId: "4cfba68ecefe41c1b61524d74f0bbccf",
      followerGroups: [],
      initiativeKey: "testThisCocoVisionZero",
      informTools: {
        items: [
          {
            id: "d51f963282204fcebdcfecdf881e6556",
            title: "[test this coco] Vision Zero Site",
            type: "Hub Site Application"
          },
          {
            id: "441c87fd97994df48fc8bc6b0d65d776",
            title: "Blank Site Template",
            type: "Hub Site Application"
          },
          {
            id: "302beec950964c41abc833da48c5c11e",
            title: "Blank Site Template",
            type: "Hub Site Application"
          }
        ]
      }
    }
  }
};

export const initiativeVersionZeroTemplate: IInitiativeModelTemplate = {
  item: {
    id: "5f49a84495844c3e9c4ab6836e6c16a9",
    owner: "dcadminqa",
    created: 1498673136000,
    modified: 1499092291000,
    guid: null,
    name: null,
    title: "WHAT IS THIS ONE",
    type: "Hub Initiative",
    typeKeywords: ["Hub", "hubInitiativeTemplate", "OpenData"],
    description: "Change this",
    tags: [],
    snippet: "Change this",
    thumbnail: null,
    documentation: null,
    extent: [],
    categories: [],
    licenseInfo: "null",
    culture: "en-us",
    properties: {},
    access: "private"
  },
  data: {
    configurationSettings: [
      {
        category: "Steps",
        fields: [
          {
            type: "item",
            multipleSelection: true,
            fieldName: "informTools",
            label: "Inform the Public",
            tooltip:
              "Share your data with the public so people can easily find, download and use your data in different formats.",
            supportedTypes: [
              "Web Mapping Application",
              "Mobile Application",
              "Form"
            ]
          },
          {
            type: "item",
            multipleSelection: true,
            fieldName: "listenTools",
            label: "Listen to the Public",
            tooltip:
              "Create ways to gather citizen feedback to help inform your city officials.",
            supportedTypes: [
              "Web Mapping Application",
              "Mobile Application",
              "Form"
            ]
          },
          {
            type: "item",
            multipleSelection: true,
            fieldName: "monitorTools",
            label: "Monitor Progress",
            tooltip:
              "Establish performance measures that incorporate the publics perspective.",
            supportedTypes: [
              "Web Mapping Application",
              "Mobile Application",
              "Form"
            ]
          }
        ]
      }
    ],
    values: {
      informTools: {
        items: []
      },
      listenTools: {
        items: [
          {
            id: "e748dbcedbb14f998c006d93028fd58f",
            title: "Missing Data Request",
            type: "Form"
          }
        ]
      },
      monitorTools: {
        items: []
      }
    }
  }
};

export const customInitiative: IInitiativeModelTemplate = {
  item: {
    id: "6f49a84495844c3e9c4ab6836e6c16a9",
    owner: "dcadminqa",
    created: 1498673136000,
    modified: 1499092291000,
    guid: null,
    name: null,
    title: "Custom Initiative",
    type: "Hub Initiative",
    typeKeywords: ["Hub", "OpenData"],
    description: "Change this",
    tags: [],
    snippet: "Change this",
    thumbnail: null,
    documentation: null,
    extent: [],
    categories: [],
    licenseInfo: "null",
    culture: "en-us",
    properties: {},
    access: "private"
  },
  data: {
    configurationSettings: [
      {
        category: "Steps",
        fields: [
          {
            type: "item",
            multipleSelection: true,
            fieldName: "informTools",
            label: "Inform the Public",
            tooltip:
              "Share your data with the public so people can easily find, download and use your data in different formats.",
            supportedTypes: [
              "Web Mapping Application",
              "Mobile Application",
              "Form"
            ]
          },
          {
            type: "item",
            multipleSelection: true,
            fieldName: "listenTools",
            label: "Listen to the Public",
            tooltip:
              "Create ways to gather citizen feedback to help inform your city officials.",
            supportedTypes: [
              "Web Mapping Application",
              "Mobile Application",
              "Form"
            ]
          },
          {
            type: "item",
            multipleSelection: true,
            fieldName: "monitorTools",
            label: "Monitor Progress",
            tooltip:
              "Establish performance measures that incorporate the publics perspective.",
            supportedTypes: [
              "Web Mapping Application",
              "Mobile Application",
              "Form"
            ]
          }
        ]
      }
    ],
    values: {
      informTools: {
        items: []
      },
      listenTools: {
        items: [
          {
            id: "e748dbcedbb14f998c006d93028fd58f",
            title: "Missing Data Request",
            type: "Form"
          }
        ]
      },
      monitorTools: {
        items: []
      }
    }
  }
};
