/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IInitiativeModel } from "@esri/hub-common";

// Example Initiative used in unit tests
export const InitiativeInstance: any = {
  item: {
    id: "6c6a543a74674939a9352a3454e9efd3",
    owner: "dcadminqa",
    created: 1533911336000,
    modified: 1536678567000,
    guid: null,
    name: null,
    title: "000 Dave Test - A Gold Standard for QA",
    type: "Hub Initiative",
    typeKeywords: [
      "doNotDelete",
      "Hub",
      "hubInitiative",
      "hubInitiativeCategoryWellRun",
      "OpenData"
    ],
    description:
      "This initiative is promised to function and contains a template of each type of thing for testing",
    tags: ["Hub Initiative"],
    snippet:
      "This initiative is promised to function and contains a template of each type of thing for testing",
    thumbnail: null,
    documentation: null,
    extent: [
      [-77.1759999999348, 38.754999999967175],
      [-76.89599999993504, 39.034999999966864]
    ],
    categories: [],
    spatialReference: "null",
    accessInformation: "Esri",
    licenseInfo: "null",
    culture: "en-us",
    properties: {
      groupId: "3dde61efbdcd464eacabe5a7a917c8d4",
      openDataGroupId: "f6742867e3ee41beb964d9f5d9cec5ae",
      schemaVersion: 2,
      initialParent: "b746772712ef4c68a53d0e268e3c8f49",
      siteId: "d6f7dcd57d9c4fecb70bbf547ff4613b"
    },
    url:
      "https://hubqa.arcgis.com/admin/initiatives/6c6a543a74674939a9352a3454e9efd3",
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
    numViews: 153,
    scoreCompleteness: 60,
    groupDesignations: null
  },
  data: {
    assets: [
      {
        id: "bannerImage",
        url:
          "https://dc.mapsqa.arcgis.com/sharing/rest/content/items/b746772712ef4c68a53d0e268e3c8f49/resources/detail-image.jpg",
        properties: {
          type: "resource",
          fileName: "detail-image.jpg",
          mimeType: "image/jepg"
        },
        license: {
          type: "none"
        },
        display: {
          position: {
            x: "76.05263157894737%",
            y: "41.78712220762155%"
          }
        }
      },
      {
        id: "iconDark",
        url:
          "https://dc.mapsqa.arcgis.com/sharing/rest/content/items/b746772712ef4c68a53d0e268e3c8f49/resources/icon-dark.png",
        properties: {
          type: "resource",
          fileName: "icon-dark.png",
          mimeType: "image/png"
        },
        license: {
          type: "none"
        }
      },
      {
        id: "iconLight",
        url:
          "https://dc.mapsqa.arcgis.com/sharing/rest/content/items/b746772712ef4c68a53d0e268e3c8f49/resources/icon-light.png",
        properties: {
          type: "resource",
          fileName: "icon-light.png",
          mimeType: "image/png"
        },
        license: {
          type: "none"
        }
      }
    ],
    steps: [
      {
        title: "Website testing here",
        description:
          "Establish performance measures that incorporate the publics perspective.",
        id: "monitorTools",
        templateIds: [
          "236012a5263b4d719d857ae878166a54",
          "42fb3f80f6f44ee684d90acf66d0adfc"
        ],
        itemIds: ["d6f7dcd57d9c4fecb70bbf547ff4613b"]
      },
      {
        title: "App testing here",
        description:
          "Share your data with the public so people can easily find, download and use your data in different formats.",
        id: "informTools",
        templateIds: [
          "2dc1b35134c1403697d5fc4fe3e6b906",
          "8c4f2be8e417441c8245eb249250a577",
          "b19646d59698485da418e5cf44456a0d",
          "efd37089716a4647aab12e83f2f79fc3"
        ],
        itemIds: [
          "d775186ce67d4fb7b913ec7482c8e84c",
          "05ffa37fe5c344789ae21f9f85117f01"
        ]
      },
      {
        title: "Survey testing here",
        description:
          "Create ways to gather citizen feedback to help inform your city officials.",
        id: "listenTools",
        templateIds: ["0585fd3f92534cc1b266de4caec1912a"],
        itemIds: []
      },
      {
        title: "Page testing here",
        description:
          "Pages should require a site to exist on the initiative before creating",
        id: "pageTesting",
        templateIds: ["2d964e35474c45eb89f84e0252a656f3"],
        itemIds: ["36ec222bb2674bd9a5f171cd6f72252c"]
      },
      {
        title: "Dashboard Testing Here",
        description: "Test your Ops Dashboard templates here",
        id: "dashboardTesting",
        templateIds: ["e84590e7e6974e83892126e437f13029"],
        itemIds: []
      }
    ],
    indicators: [
      {
        id: "collisionLayer",
        type: "Data",
        name: "Collision Data",
        optional: false,
        definition: {
          description: "Collision Data",
          supportedTypes: ["FeatureLayer", "FeatureCollection"],
          geometryTypes: [
            "esriGeometryPoint",
            "esriGeometryLine",
            "esriGeometryPolygon"
          ],
          fields: [
            {
              id: "numInjuries",
              name: "Number of Injuries",
              optional: false,
              description: "Count of people…",
              supportedTypes: ["esriFieldTypeInteger"]
            },
            {
              id: "numFatalities",
              name: "Number of Fatalities",
              optional: false,
              description: "Count of deaths…",
              supportedTypes: ["esriFieldTypeInteger"]
            }
          ]
        },
        source: {
          type: "FeatureLayer",
          url:
            "https://servicesqa.arcgis.com/97KLIFOSt5CxbiRI/arcgis/rest/services/Collisions_Indicator_(Small)_for_Development/FeatureServer/0",
          layerId: 0,
          itemId: "e05e89d83552497bba267a20ca4cea74",
          name: "Collisions_Indicator_(Small)_for_Development",
          mappings: [
            {
              id: "numInjuries",
              name: "MAJORINJURIES",
              alias: "MAJORINJURIES",
              type: "esriFieldTypeInteger"
            },
            {
              id: "numFatalities",
              name: "MINORINJURIES",
              alias: "MINORINJURIES",
              type: "esriFieldTypeInteger"
            }
          ]
        }
      }
    ],
    values: {
      collaborationGroupId: "3dde61efbdcd464eacabe5a7a917c8d4",
      openDataGroupId: "f6742867e3ee41beb964d9f5d9cec5ae",
      followerGroups: [],
      bannerImage: {
        source: "bannerImage",
        display: {
          position: {
            x: "76.05263157894737%",
            y: "41.78712220762155%"
          }
        }
      },
      initiativeKey: "000DaveTestAGoldStandardForQA",
      monitorTools: {
        items: [
          {
            id: "8680a283b6ee475d8b95f021a9f88879",
            title: "Community Survey",
            type: "Form"
          }
        ]
      }
    }
  }
};
