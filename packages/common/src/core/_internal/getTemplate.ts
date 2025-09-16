import { IHubTemplate } from "../types";
import { IHubEntityLinks } from "../types/IHubEntityBase";
import { IHubLocation } from "../types/IHubLocation";
import { IArcGISContext } from "../../types";

/**
 * Returns a template layout by name.
 * Currently supports "simple" and "blank".
 * Future templates can be added or loaded via dynamic import.
 * @param name - The template name (e.g., "simple", "blank")
 */
export function getTemplate(
  name: string,
  context: IArcGISContext
): Promise<IHubTemplate> {
  const cdnUrl = context.portal.cdnUrl as string;
  const heroImageUrl = `${cdnUrl}/opendata-ui/assets/ember-arcgis-opendata-components/assets/images/placeholders/southatlantic_coastline.jpg`;

  const baseTemplateProps = {
    id: "template-id",
    name: "template-name",
    summary: "",
    createdDate: new Date(),
    createdDateSource: "",
    updatedDate: new Date(),
    updatedDateSource: "",
    type: "Hub Template",
    source: "",
    links: undefined as IHubEntityLinks | undefined,
    previewUrl: "",
    isDeployed: false,
    deployedType: "",
    itemControl: "admin",
    owner: "",
    url: "",
    schemaVersion: 1,
    tags: [] as string[],
    canEdit: true,
    canDelete: true,
    orgUrlKey: "",
    slug: "",
    typeKeywords: [] as string[],
    view: undefined as unknown,
    location: undefined as IHubLocation | undefined,
    orgId: undefined as string | undefined,
    protected: false,
    canRecycle: false,
    boundary: undefined as unknown,
    categories: [] as string[],
    culture: "",
    description: "",
    extent: undefined as number[][] | undefined,
    size: undefined as number | undefined,
    thumbnailUrl: undefined as string | undefined,
    thumbnail: undefined as string | undefined,
  };

  const simple: IHubTemplate = {
    ...baseTemplateProps,
    sections: [
      {
        containment: "fixed",
        isFooter: false,
        style: {
          background: {
            isFile: false,
            isUrl: true,
            state: "valid",
            display: {},
            transparency: 50,
            position: { x: "center", y: "center" },
            color: "#000000",
            image: heroImageUrl,
          },
          color: "#ffffff",
          rowLayout: "box",
        },
        rows: [
          {
            cards: [
              {
                component: {
                  name: "spacer-card",
                  settings: { height: "80", cardId: "c0iaseq5x" },
                },
                settings: { height: 100 },
                width: 12,
              },
            ],
          },
          {
            cards: [
              {
                component: {
                  name: "markdown-card",
                  settings: {
                    cardId: "crn7a02t5",
                    schemaVersion: 2.1,
                    markdown: '<div class="banner-heading">Hero section</div>',
                  },
                },
                width: 12,
              },
            ],
          },
          {
            cards: [
              {
                component: {
                  name: "markdown-card",
                  settings: {
                    cardId: "c1cihdl00",
                    schemaVersion: 2.1,
                    markdown:
                      "<p>This hero section is a row with image, banner text, and spacers. Edit layout to customize the hero.&nbsp;</p>",
                  },
                },
                width: 12,
              },
            ],
          },
          {
            cards: [
              {
                component: {
                  name: "spacer-card",
                  settings: { height: "80", cardId: "cqw42xb1u" },
                },
                settings: { height: 100 },
                width: 12,
              },
            ],
          },
        ],
        visibility: { access: "default", groups: [] },
      },
      {
        containment: "fixed",
        isFooter: false,
        style: {
          background: {
            isFile: false,
            isUrl: true,
            state: "",
            display: {},
            transparency: 0,
            position: { x: "center", y: "center" },
            color: "transparent",
          },
          rowLayout: "box",
        },
        rows: [
          {
            cards: [
              {
                component: {
                  name: "spacer-card",
                  settings: { height: "30", cardId: "c1vrfsun0" },
                },
                settings: { height: 100 },
                width: 12,
              },
            ],
          },
          {
            cards: [
              {
                component: {
                  name: "markdown-card",
                  settings: {
                    cardId: "cmq3l0yfj",
                    schemaVersion: 2.1,
                    markdown:
                      '<h1 style="text-align: center;">Section</h1><p style="text-align: center;">Edit layout to customize this section and configure page elements.&nbsp;<a href="https://doc.arcgis.com/en/hub/sites/site-editing-basics.htm" target="_blank" style="font-family: var(--fontsBaseFamily), Avenir Next; background-color: rgb(255, 255, 255);">Learn more &gt;</a></p>',
                  },
                },
                width: 12,
              },
            ],
          },
          {
            cards: [
              {
                component: {
                  name: "spacer-card",
                  settings: { height: 100, cardId: "c619c27ix" },
                },
                settings: { height: 100 },
                width: 12,
              },
            ],
          },
        ],
        visibility: { access: "default", groups: [] },
      },
    ],
    header: {
      component: {
        name: "site-header",
        settings: {
          fullWidth: false,
          title: "Your Site Name",
          headerType: "default",
          menuLinks: [
            {
              id: "f24c588e37824b5db0c5e31e5b364403",
              type: "Hub Page",
              name: "yet another page",
              external: false,
            },
          ],
          schemaVersion: 3,
          showTitle: true,
          socialLinks: {
            facebook: {},
            instagram: {},
            twitter: {},
            youtube: {},
          },
          shortTitle: "Site",
        },
      },
    },
    footer: {
      component: {
        name: "site-footer",
        settings: {
          footerType: "custom",
          markdown: `<div class="footer-background">
  <div class="container-fluid">
    <div class="col-xs-12">
      <img src="https://via.placeholder.com/50" alt="" class="center-block logo">
    </div>
    <div class="col-xs-6 center-block">
      <ul class="nav nav-pills">
        <li><a href="">URL</a></li>
        <li><a href="">URL</a></li>
        <li><a href="">URL</a></li>
        <li><a href="">URL</a></li>
      </ul>
    </div>
    <div class="col-xs-6 center-block">
      <ul class="nav nav-pills" style="float:right;">
        <li><a href="">URL</a></li>
        <li><a href="">URL</a></li>
      </ul>
    </div>
  </div>
</div>`,
          schemaVersion: 2.1,
        },
      },
    },
  };

  const blank: IHubTemplate = {
    ...baseTemplateProps,
    sections: [],
    header: undefined,
    footer: undefined,
  };

  switch (name) {
    case "simple":
      return Promise.resolve(simple);
    case "blank":
      return Promise.resolve(blank);
    default:
      return Promise.resolve(blank);
  }
}
