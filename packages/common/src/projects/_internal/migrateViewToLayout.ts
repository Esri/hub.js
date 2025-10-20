import { IHubLayout } from "../../core/types/IHubLayout";
import { IHubProject } from "../../core/types/IHubProject";
import { cloneObject } from "../../util";

export const migrateViewToLayout = (project: IHubProject): IHubProject => {
  const migrated = buildInitialLayout(project);
  // add additional layout migrations here as needed
  // e.g. migrated = anotherLayoutMigration(migrated);
  return migrated;
};

const buildInitialLayout = (project: IHubProject): IHubProject => {
  if (project.schemaVersion >= 2.0) {
    return project;
  }

  const clone = cloneObject(project);

  // TODO: once hub.js is merged into the hub-ui
  // monorepo and the IHubLayout reference in
  // IWithLayout is updated to the Layout type from
  // the new layout system types.ts, remove the
  // "as IHubLayout" type casting here
  clone.layout = {
    schemaVersion: 2,
    history: [],
    sections: [
      // HERO
      {
        id: "hero-section",
        tag: "arcgis-layout-section",
        readOnly: true,
        properties: {},
        children: [
          {
            id: "hero-row",
            tag: "arcgis-layout-row",
            readOnly: true,
            properties: {},
            children: [
              {
                id: "hero-col",
                tag: "arcgis-layout-column",
                readOnly: true,
                properties: {},
                children: [
                  {
                    id: "hero",
                    tag: "arcgis-hub-entity-hero",
                    properties: {
                      entity: "{{entity}}",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      // MAIN TABS
      {
        id: "root",
        tag: "arcgis-layout-section",
        readOnly: true,
        properties: {},
        children: [
          {
            id: "main-row",
            tag: "arcgis-layout-row",
            readOnly: true,
            properties: {},
            children: [
              {
                id: "main-col",
                tag: "arcgis-layout-column",
                readOnly: true,
                properties: {},
                children: [
                  {
                    id: "root-nav",
                    tag: "arcgis-nav-card",
                    properties: {
                      sections: [
                        {
                          label: "{{tabs.overview:translate}}",
                          hidden: false,
                          id: "overview-root",
                          tag: "arcgis-layout-section",
                          properties: {},
                          children: [
                            {
                              id: "overview-row",
                              tag: "arcgis-layout-row",
                              properties: {},
                              children: [
                                {
                                  id: "overview-col-about",
                                  tag: "arcgis-layout-column",
                                  columnProps: { width: { xs: 12, md: 8 } },
                                  properties: {},
                                  children: [
                                    {
                                      id: "about-title",
                                      tag: "arcgis-text-card",
                                      properties: {
                                        html: `<h2>{{about:translate}}</h2>`,
                                      },
                                    },
                                    {
                                      id: "about-summary",
                                      tag: "arcgis-text-card",
                                      readOnly: true,
                                      properties: {
                                        html: "<p>{{entity.summary}}</p>",
                                      },
                                    },
                                    {
                                      id: "about-embed",
                                      tag: "arcgis-hub-embed-card",
                                      properties: {
                                        embed:
                                          "{{entity.view._layoutInterpolationProps.featuredEmbed:optional}}",
                                      },
                                    },
                                    {
                                      id: "about-description",
                                      tag: "arcgis-text-card",
                                      readOnly: true,
                                      properties: {
                                        html: "<p>{{entity.description}}</p>",
                                      },
                                    },
                                    {
                                      id: "about-image",
                                      tag: "arcgis-hub-image",
                                      properties: {
                                        src: "{{entity.view.featuredImageUrl:optional}}?token={{context.session.token:optional}}",
                                        alt: "{{entity.view.featuredImageAltText:optional}}",
                                      },
                                    },
                                    {
                                      id: "metrics-row",
                                      tag: "arcgis-layout-row",
                                      properties: {},
                                      children: [
                                        {
                                          id: "metrics-col",
                                          tag: "arcgis-layout-column",
                                          properties: {},
                                          children: [
                                            {
                                              id: "about-metrics-title",
                                              tag: "arcgis-text-card",
                                              properties: {
                                                html: "<h2>{{metrics:translate}}</h2>",
                                              },
                                            },
                                            {
                                              id: "featured-metrics-grid",
                                              tag: "arcgis-layout-row",
                                              properties: {},
                                              styles: {
                                                display: "grid",
                                                gridTemplateColumns:
                                                  "repeat(2, minmax(20rem, 1fr))",
                                                gap: "2rem",
                                              },
                                              children: [
                                                {
                                                  id: "featured-metric-1-col",
                                                  tag: "arcgis-layout-column",
                                                  properties: {},
                                                  children: [
                                                    {
                                                      id: "featured-metric-1",
                                                      tag: "arcgis-hub-metric-card",
                                                      styles: {
                                                        minHeight: "15rem",
                                                        height: "100%",
                                                      },
                                                      properties: {
                                                        cardConfig:
                                                          "{{entity.view._layoutInterpolationProps.featuredMetric1.display:optional:7}}",
                                                        metric:
                                                          "{{entity.view._layoutInterpolationProps.featuredMetric1.metric:optional}}",
                                                      },
                                                    },
                                                  ],
                                                },
                                                {
                                                  id: "featured-metric-2-col",
                                                  tag: "arcgis-layout-column",
                                                  properties: {},
                                                  children: [
                                                    {
                                                      id: "featured-metric-2",
                                                      tag: "arcgis-hub-metric-card",
                                                      styles: {
                                                        minHeight: "15rem",
                                                        height: "100%",
                                                      },
                                                      properties: {
                                                        cardConfig:
                                                          "{{entity.view._layoutInterpolationProps.featuredMetric2.display:optional:4}}",
                                                        metric:
                                                          "{{entity.view._layoutInterpolationProps.featuredMetric2.metric:optional}}",
                                                      },
                                                    },
                                                  ],
                                                },
                                                {
                                                  id: "featured-metric-3-col",
                                                  tag: "arcgis-layout-column",
                                                  properties: {},
                                                  children: [
                                                    {
                                                      id: "featured-metric-3",
                                                      tag: "arcgis-hub-metric-card",
                                                      styles: {
                                                        minHeight: "15rem",
                                                        height: "100%",
                                                      },
                                                      properties: {
                                                        cardConfig:
                                                          "{{entity.view._layoutInterpolationProps.featuredMetric3.display:optional:4}}",
                                                        metric:
                                                          "{{entity.view._layoutInterpolationProps.featuredMetric3.metric:optional}}",
                                                      },
                                                    },
                                                  ],
                                                },
                                                {
                                                  id: "featured-metric-4-col",
                                                  tag: "arcgis-layout-column",
                                                  properties: {},
                                                  children: [
                                                    {
                                                      id: "featured-metric-4",
                                                      tag: "arcgis-hub-metric-card",
                                                      styles: {
                                                        minHeight: "15rem",
                                                        height: "100%",
                                                      },
                                                      properties: {
                                                        cardConfig:
                                                          "{{entity.view._layoutInterpolationProps.featuredMetric4.display:optional:4}}",
                                                        metric:
                                                          "{{entity.view._layoutInterpolationProps.featuredMetric4.metric:optional}}",
                                                      },
                                                    },
                                                  ],
                                                },
                                              ],
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                    {
                                      id: "about-featured-content-title",
                                      tag: "arcgis-text-card",
                                      properties: {
                                        html: `<h2>{{featuredContent:translate}}</h2>`,
                                      },
                                    },
                                    {
                                      id: "about-gallery",
                                      tag: "arcgis-hub-gallery-card",
                                      properties: {
                                        cardConfig: {
                                          cardId: "cedhzwzpx",
                                          schemaVersion: 8,
                                          targetEntity: "item",
                                          source: "all",
                                          shouldLimitResults: true,
                                          limit: 4,
                                          appearance: {
                                            layout: "grid",
                                            layouts: [],
                                          },
                                          query: {
                                            targetEntity: "item",
                                            filters: [
                                              {
                                                predicates: [
                                                  {
                                                    id: "{{entity.view.featuredContentIds:optional}}",
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                        },
                                      },
                                    },
                                  ],
                                },
                                // Project status/details column
                                {
                                  id: "overview-col-status",
                                  tag: "arcgis-layout-column",
                                  columnProps: { width: { xs: 12, md: 4 } },
                                  properties: {},
                                  children: [
                                    {
                                      id: "status-title",
                                      tag: "arcgis-text-card",
                                      properties: {
                                        html: `<h2>{{status.label.project:translate}}</h2>`,
                                      },
                                    },
                                    {
                                      id: "status-chip",
                                      tag: "calcite-chip",
                                      properties: {
                                        scale: "l",
                                        label: "{{entity.status:translate}}",
                                      },
                                      slots: {
                                        default: "{{entity.status:translate}}",
                                      },
                                    },
                                    {
                                      id: "status-timeline",
                                      tag: "arcgis-hub-timeline",
                                      properties: {
                                        canCollapse:
                                          "{{entity.view.timeline.canCollapse:optional}}",
                                        stages:
                                          "{{entity.view.timeline.stages:optional}}",
                                      },
                                    },
                                    {
                                      id: "status-details-title",
                                      tag: "arcgis-text-card",
                                      properties: {
                                        html: `<h2>{{details:translate}}</h2>`,
                                      },
                                    },
                                    {
                                      id: "status-metadata",
                                      tag: "arcgis-hub-entity-metadata",
                                      properties: {
                                        entity: "{{entity}}",
                                      },
                                    },
                                    {
                                      id: "associated-initiatives-title",
                                      tag: "arcgis-text-card",
                                      properties: {
                                        html: `<h2>{{associatedInitiatives:translate}}</h2>`,
                                      },
                                    },
                                    {
                                      id: "associated-initiatives-gallery",
                                      tag: "arcgis-hub-gallery-card",
                                      properties: {
                                        cardConfig: {
                                          cardId: "cedhzwzpx",
                                          schemaVersion: 8,
                                          targetEntity: "item",
                                          source: "all",
                                          shouldLimitResults: true,
                                          limit: 4,
                                          appearance: {
                                            layout: "list",
                                            layouts: [],
                                            showThumbnail: "hide",
                                          },
                                          query:
                                            "{{entity.view._layoutInterpolationProps.associatedEntitiesQuery}}",
                                        },
                                      },
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                        // CONTENT TAB
                        {
                          label: "{{tabs.content:translate}}",
                          hidden: false,
                          id: "content-root",
                          tag: "arcgis-layout-section",
                          properties: {},
                          children: [
                            {
                              id: "content-row",
                              tag: "arcgis-layout-row",
                              properties: {},
                              children: [
                                {
                                  id: "content-col",
                                  tag: "arcgis-layout-column",
                                  properties: {},
                                  children: [
                                    {
                                      id: "content-catalog",
                                      tag: "arcgis-hub-catalog",
                                      properties: {
                                        catalogs: ["{{entity.catalog}}"],
                                        // TODO: use the WELL_KNOWN_ITEM_FACET_TYPES const once
                                        // everything is merged into the hub-ui monorepo
                                        facets: [
                                          "location",
                                          "type",
                                          "tags",
                                          "categories",
                                          "modified",
                                          "access",
                                        ],
                                        layout: "grid",
                                        layoutOptions: [
                                          "grid",
                                          "list",
                                          "table",
                                          "map",
                                          "compact",
                                        ],
                                        showAddContent: true,
                                        showLayoutSwitcher: true,
                                        showSearch: true,
                                        showThumbnail: true,
                                        path: "",
                                        linkTarget: "siteRelative",
                                        targetEntity: "item",
                                        showAllCollectionFacet: true,
                                      },
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                        // EVENTS TAB
                        {
                          label: "{{tabs.events:translate}}",
                          hidden: false,
                          id: "events-root",
                          tag: "arcgis-layout-section",
                          properties: {},
                          children: [
                            {
                              id: "events-row",
                              tag: "arcgis-layout-row",
                              properties: {},
                              children: [
                                {
                                  id: "events-col",
                                  tag: "arcgis-layout-column",
                                  properties: {},
                                  children: [
                                    {
                                      id: "events-catalog",
                                      tag: "arcgis-hub-catalog",
                                      properties: {
                                        catalogs: ["{{entity.catalog}}"],
                                        // TODO: use the WELL_KNOWN_EVENT_FACET_TYPES const once
                                        // everything is merged into the hub-ui monorepo
                                        facets: [
                                          "event-from",
                                          "event-access",
                                          "event-date",
                                        ],
                                        layout: "grid",
                                        layoutOptions: [
                                          "grid",
                                          "list",
                                          "table",
                                          "map",
                                          "compact",
                                        ],
                                        showAddContent: true,
                                        showLayoutSwitcher: true,
                                        showSearch: true,
                                        showThumbnail: true,
                                        path: "",
                                        linkTarget: "siteRelative",
                                        targetEntity: "event",
                                        showAllCollectionFacet: true,
                                      },
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                        // METRICS TAB
                        {
                          label: "{{tabs.metrics:translate}}",
                          hidden: false,
                          id: "metrics-root",
                          tag: "arcgis-layout-section",
                          properties: {},
                          children: [
                            {
                              id: "metrics-row",
                              tag: "arcgis-layout-row",
                              properties: {},
                              children: [
                                {
                                  id: "metrics-col",
                                  tag: "arcgis-layout-column",
                                  properties: {},
                                  children: [
                                    {
                                      id: "metrics-view",
                                      tag: "arcgis-hub-entity-metrics-view",
                                      properties: {
                                        entity: "{{entity}}",
                                      },
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                        // INITIATIVES TAB
                        {
                          label: "{{tabs.initiatives:translate}}",
                          hidden: false,
                          id: "initiatives-section",
                          tag: "arcgis-layout-section",
                          properties: {},
                          children: [
                            {
                              id: "initiatives-row",
                              tag: "arcgis-layout-row",
                              properties: {},
                              children: [
                                {
                                  id: "initiatives-col",
                                  tag: "arcgis-layout-column",
                                  properties: {},
                                  children: [
                                    {
                                      id: "initiatives-view",
                                      tag: "arcgis-hub-project-initiatives-view",
                                      properties: {
                                        entity: "{{entity}}",
                                      },
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  } as IHubLayout;
  clone.schemaVersion = 2.0;
  return clone;
};
