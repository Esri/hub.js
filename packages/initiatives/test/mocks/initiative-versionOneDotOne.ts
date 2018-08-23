/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { IInitiativeModel, IInitiativeItem } from "@esri/hub-common";

export const initiativeVersionOneDotOne: IInitiativeModel = {
  item: {
    id: "bf5cc1f0e18f45aa91ecaa6ba004ba7d",
    owner: "dcadminqa",
    created: 1511289191000,
    modified: 1533234144000,
    guid: null,
    name: null,
    title: "A Gold Standard for QA - Inherit Thumbnails Markham",
    type: "Hub Initiative",
    typeKeywords: ["Hub", "hubInitiative", "OpenData"],
    description: "asdasdsdasdasd",
    tags: ["Hub Initiative"],
    snippet:
      "This initiative is promised to function and contains a template of each type of thing for testing",
    thumbnail: "thumbnail/ago_downloaded.png",
    documentation: null,
    extent: [
      [-77.17599999995046, 38.75499999997506],
      [-76.89599999995063, 39.03499999997481]
    ],
    categories: [],
    spatialReference: "null",
    accessInformation: "Esri",
    licenseInfo: "null",
    culture: "en-us",
    properties: {
      source: "b746772712ef4c68a53d0e268e3c8f49",
      groupId: "d9b510d8e9a445af999f343928c99180",
      openDataGroupId: "fffc85c72079400fb551f4e4025e84c2",
      schemaVersion: 1.1,
      siteId: "47136fd182cf4f5ca54699f09e058f16"
    },
    url:
      "https://hubqa.arcgis.com/admin/initiatives/bf5cc1f0e18f45aa91ecaa6ba004ba7d",
    access: "shared"
  } as IInitiativeItem,
  data: {
    source: "b746772712ef4c68a53d0e268e3c8f49",
    values: {
      collaborationGroupId: "d9b510d8e9a445af999f343928c99180",
      openDataGroupId: "fffc85c72079400fb551f4e4025e84c2",
      followerGroups: [],
      initiativeKey: "aGoldStandardForQAInheritThumbnailsMarkham",
      collisionLayer: {},
      informTools: {
        items: [
          {
            id: "a9d20dd182224fe88a82b942ff09bbc4",
            title: "Gold Standard Optional App",
            type: "Web Mapping Application"
          },
          {
            id: "99961b3a89424680b329760caacf3c64",
            title: "Gold Standard App",
            type: "Web Mapping Application"
          },
          {
            id: "90b69ecf1ab945faab0824c30d4af748",
            title: "Default Story Map Template",
            type: "Web Mapping Application"
          },
          {
            id: "b83f836ca8644ab597e9588fc6a487d5",
            title: "Gold Standard Defaulting App",
            type: "Web Mapping Application"
          }
        ],
        title: "App testing here",
        description:
          "Share your data with the public so people can easily find, download and use your data in different formats.",
        id: "informTools",
        templates: [
          {
            title: "Gold Standard App",
            id: "2dc1b35134c1403697d5fc4fe3e6b906",
            type: "web mapping application"
          },
          {
            title: "Gold Standard Optional App",
            id: "4ca3c6422eeb40c58494c8678621318c",
            type: "web mapping application"
          },
          {
            title: "Gold Standard Private Solution",
            id: "8c4f2be8e417441c8245eb249250a577",
            type: "web mapping application"
          },
          {
            title: "Gold Standard Optional Defaulting App",
            id: "b19646d59698485da418e5cf44456a0d",
            type: "web mapping application"
          },
          {
            title: "Gold Standard Webmap",
            id: "efd37089716a4647aab12e83f2f79fc3",
            type: "webmap"
          }
        ],
        templateItemIds: [
          "2dc1b35134c1403697d5fc4fe3e6b906",
          "4ca3c6422eeb40c58494c8678621318c",
          "8c4f2be8e417441c8245eb249250a577",
          "b19646d59698485da418e5cf44456a0d",
          "efd37089716a4647aab12e83f2f79fc3"
        ],
        configuredItemIds: [
          "a9d20dd182224fe88a82b942ff09bbc4",
          "99961b3a89424680b329760caacf3c64",
          "90b69ecf1ab945faab0824c30d4af748",
          "b83f836ca8644ab597e9588fc6a487d5"
        ]
      },
      monitorTools: {
        items: [
          {
            id: "47136fd182cf4f5ca54699f09e058f16",
            title: "00 - Initiative: Open Data",
            type: "Hub Site Application"
          }
        ],
        title: "Website testing here",
        description:
          "Establish performance measures that incorporate the publics perspective.",
        id: "monitorTools",
        templates: [
          {
            title: "Gold Standard Website",
            id: "236012a5263b4d719d857ae878166a54",
            type: "hub site application"
          },
          {
            title: "Gold Standard Site with Children",
            id: "42fb3f80f6f44ee684d90acf66d0adfc",
            type: "hub site application"
          }
        ],
        templateItemIds: [
          "236012a5263b4d719d857ae878166a54",
          "42fb3f80f6f44ee684d90acf66d0adfc"
        ],
        configuredItemIds: ["47136fd182cf4f5ca54699f09e058f16"]
      },
      listenTools: {
        items: [
          {
            id: "d7f669a6a1a942e4a1620ea40bd61e1c",
            title: "Newer Survey Test",
            type: "Form"
          }
        ],
        title: "Survey testing here",
        description:
          "Create ways to gather citizen feedback to help inform your city officials.",
        id: "listenTools",
        templates: [
          {
            title: "Gold Standard Survey",
            id: "0585fd3f92534cc1b266de4caec1912a",
            type: "Form"
          }
        ],
        templateItemIds: ["0585fd3f92534cc1b266de4caec1912a"],
        configuredItemIds: ["d7f669a6a1a942e4a1620ea40bd61e1c"]
      },
      pageTesting: {
        items: [],
        title: "Page testing here",
        description:
          "Pages should require a site to exist on the initiative before creating",
        id: "pageTesting",
        templates: [
          {
            title: "Gold Standard Page",
            id: "2d964e35474c45eb89f84e0252a656f3",
            type: "hub page"
          }
        ],
        templateItemIds: ["2d964e35474c45eb89f84e0252a656f3"],
        configuredItemIds: []
      },
      bannerImage: {
        source: "bannerImage",
        display: {
          position: {
            x: "77.41228070175438%",
            y: "91.81818181818183%"
          }
        }
      },
      steps: [
        "monitorTools",
        "informTools",
        "listenTools",
        "pageTesting",
        "dashboardTesting"
      ],
      dashboardTesting: {
        title: "Dashboard Testing Here",
        description: "Test your Ops Dashboard templates here",
        id: "dashboardTesting",
        templates: [
          {
            title: "Gold Standard Ops Dashboard",
            id: "e84590e7e6974e83892126e437f13029",
            type: "dashboard"
          }
        ],
        templateItemIds: ["e84590e7e6974e83892126e437f13029"],
        configuredItemIds: [
          "4e82186c0759421dbffdbbbbf25a048b",
          "a6081cc3887142f2b5665d0807b54661"
        ],
        items: [
          {
            id: "4e82186c0759421dbffdbbbbf25a048b",
            title: "Gold Standard Ops Dashboard",
            type: "Web Mapping Application"
          },
          {
            id: "a6081cc3887142f2b5665d0807b54661",
            title: "Gold Standard Ops Dashboard",
            type: "Web Mapping Application"
          }
        ]
      },
      optionalData: {
        url:
          "https://servicesqa.arcgis.com/97KLIFOSt5CxbiRI/arcgis/rest/services/survey123_7d7a9fabcb0c44bcaf1d6473cd088a07/FeatureServer/1",
        layerId: 1,
        itemId: "a5b15fe368684a66b8c85a6cadaef9e5",
        name: "metadata",
        fields: [
          {
            id: "optionalField",
            field: {
              name: "value",
              alias: "value",
              type: "esriFieldTypeString"
            }
          }
        ]
      }
    },
    assets: [
      {
        id: "bannerImage",
        url:
          "https://dc.mapsqa.arcgis.com/sharing/rest/content/items/bf5cc1f0e18f45aa91ecaa6ba004ba7d/resources/detail-image.jpg",
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
            x: "77.41228070175438%",
            y: "91.81818181818183%"
          }
        }
      },
      {
        id: "iconDark",
        url:
          "https://dc.mapsqa.arcgis.com/sharing/rest/content/items/bf5cc1f0e18f45aa91ecaa6ba004ba7d/resources/icon-dark.png",
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
          "https://dc.mapsqa.arcgis.com/sharing/rest/content/items/bf5cc1f0e18f45aa91ecaa6ba004ba7d/resources/icon-light.png",
        properties: {
          type: "resource",
          fileName: "icon-light.png",
          mimeType: "image/png"
        },
        license: {
          type: "none"
        }
      }
    ]
  }
};

export const initiativeVersionOneTemplate: IInitiativeModel = {
  item: {} as IInitiativeItem,
  data: {}
};
