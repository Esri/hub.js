import { IWellKnownItemPredicates } from "./types";

export const WellKnownItemPredicates: IWellKnownItemPredicates = {
  $application: [
    {
      type: {
        any: [
          "Web Mapping Application",
          "Application",
          "Insights",
          "Web Experience",
        ],
        not: ["Insights Theme", "Insights Model"],
      },
      typekeywords: {
        not: ["hubSite", "Story Map"],
      },
    },
    {
      type: "Web Mapping Experience",
      typekeywords: "EXB Experience",
    },
  ],
  $dashboard: [
    {
      type: {
        any: ["Dashboard"],
        not: ["Operation View"],
      },
      typekeywords: {
        not: ["Extension", "ArcGIS Operation View"],
      },
    },
  ],
  $dataset: [
    {
      type: {
        any: [
          "Scene Service",
          "Feature Collection",
          "Route Layer",
          "Layer",
          "Explorer Layer",
          "Tile Package",
          "Vector Tile Package",
          "Scene Package",
          "Layer Package",
          "Feature Service",
          "Stream Service",
          "Map Service",
          "Vector Tile Service",
          "Image Service",
          "WMS",
          "WFS",
          "WMTS",
          "KML",
          "KML Collection",
          "Globe Service",
          "CSV",
          "Shapefile",
          "GeoJson",
          "Service Definition",
          "File Geodatabase",
          "CAD Drawing",
          "Relational Database Connection",
        ],
        not: ["Web Mapping Application", "Geodata Service"],
      },
    },
    {
      typekeywords: ["OGC", "Geodata Service"],
    },
  ],
  $document: [
    {
      type: [
        "PDF",
        "Microsoft Excel",
        "Microsoft Word",
        "Microsoft Powerpoint",
        "iWork Keynote",
        "iWork Pages",
        "iWork Numbers",
        "Visio Document",
        "Document Link",
      ],
    },
  ],
  $initiative: [
    {
      type: "Hub Initiative",
      typekeywords: "hubInitiativeV2",
    },
  ],
  $experience: [
    {
      type: "Web Experience",
    },
  ],
  $feedback: [
    {
      type: "Form",
    },
  ],
  $page: [
    {
      typekeywords: "hubPage",
    },
  ],
  $site: [
    {
      type: ["Hub Site Application", "Site Application"],
    },
  ],
  $storymap: [
    {
      type: "Storymap",
    },
    {
      type: "Web Mapping Application",
      typekeywords: "Story Map",
    },
  ],
  $template: [
    {
      type: [
        "Web Mapping Application",
        "Hub Initiative",
        "Hub Initiative Template",
        "Solution",
      ],
      typekeywords: {
        any: ["hubInitiativeTemplate", "hubSolutionTemplate", "Template"],
        not: "Deployed",
      },
    },
  ],
  $webmap: [
    {
      type: {
        any: ["Web Map", "Web Scene"],
        not: "Web Mapping Application",
      },
    },
  ],
};
