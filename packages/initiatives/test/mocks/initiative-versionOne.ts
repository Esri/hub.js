/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { IInitiativeModel, IInitiativeItem } from "@esri/hub-common";

export const initiativeVersionOne: IInitiativeModel = {
  item: {
    id: "4b73483961964193a9a4195fc35dd53f",
    owner: "dbouwman_dc",
    title: "goldie assets - dbouwman",
    type: "Hub Initiative",
    typeKeywords: ["Hub", "hubInitiative", "OpenData"],
    description:
      "This initiative is promised to function and contains a template of each type of thing for testing",
    tags: ["Hub Initiative"],
    snippet:
      "This initiative is promised to function and contains a template of each type of thing for testing",
    extent: [
      [-77.17599999994654, 38.75499999997309],
      [-76.89599999994672, 39.034999999972825]
    ],
    spatialReference: "null",
    accessInformation: "Esri",
    licenseInfo: "null",
    culture: "en-us",
    properties: {
      source: "b746772712ef4c68a53d0e268e3c8f49",
      groupId: "3172234c50bc4ab9a6a221c4a6ccc743",
      openDataGroupId: "d364221d37a441ef8c2ce2344ad79e0f",
      schemaVersion: 1
    },
    url:
      "https://hubqa.arcgis.com/admin/initiatives/4b73483961964193a9a4195fc35dd53f",
    access: "shared"
  } as IInitiativeItem,
  data: {
    source: "b746772712ef4c68a53d0e268e3c8f49",
    values: {
      collaborationGroupId: "3172234c50bc4ab9a6a221c4a6ccc743",
      openDataGroupId: "d364221d37a441ef8c2ce2344ad79e0f",
      followerGroups: [],
      steps: ["monitorTools", "informTools", "listenTools", "pageTesting"],
      monitorTools: {
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
        configuredItemIds: [
          "88bbf31694aa473ca5bd87bc42230dcc",
          "94ea596a16f447e0a935f9d679823d64"
        ],
        items: [
          {
            id: "88bbf31694aa473ca5bd87bc42230dcc",
            title: "Gold Standard Site",
            type: "Hub Site Application"
          },
          {
            id: "94ea596a16f447e0a935f9d679823d64",
            title: "00 - Initiative: Open Data",
            type: "Hub Site Application"
          }
        ]
      },
      informTools: {
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
          }
        ],
        templateItemIds: [
          "2dc1b35134c1403697d5fc4fe3e6b906",
          "4ca3c6422eeb40c58494c8678621318c",
          "8c4f2be8e417441c8245eb249250a577"
        ],
        configuredItemIds: ["56b546a2e57741e181eb8f65020d4e92"],
        items: [
          {
            id: "56b546a2e57741e181eb8f65020d4e92",
            title: "Gold Standard Optional App",
            type: "Web Mapping Application"
          }
        ]
      },
      listenTools: {
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
        configuredItemIds: [],
        items: []
      },
      pageTesting: {
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
        configuredItemIds: [],
        items: [
          {
            id: "c629886541a84196b93123a37ae86839",
            title: "non vz event",
            type: "Hub Page"
          }
        ]
      },
      initiativeKey: "goldieAssetsDbouwman"
    }
  }
};
