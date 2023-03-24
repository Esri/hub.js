/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

export const SiteItem: any = {
  item: {
    id: "db1148fef49a484b9aa11c4351acc176",
    owner: "dcadminqa",
    created: 1521473614000,
    modified: 1533572542000,
    guid: null,
    name: null,
    title: "BDD - Gold Standard Site",
    type: "Hub Site Application",
    typeKeywords: [
      "Hub",
      "hubSite",
      "hubSolution",
      "JavaScript",
      "Map",
      "Mapping Site",
      "Online Map",
      "OpenData",
      "Ready To Use",
      "selfConfigured",
      "Web Map",
      "Registered App",
    ],
    description:
      "DO NOT DELETE OR MODIFY THIS ITEM. This item is managed by the ArcGIS Hub application. To make changes to this site, please visit https://hubqa.arcgis.com/admin/",
    tags: ["Hub Site"],
    snippet: "Washington, DC R&D Center (QA) Open Data Site",
    thumbnail: "thumbnail/ago_downloaded.png",
    documentation: null,
    extent: [],
    categories: [],
    spatialReference: null,
    accessInformation: "null",
    licenseInfo: "null",
    culture: "en-us",
    properties: {
      demoUrl: "http://0-coco-beta-dc.opendataqa.arcgis.com",
      source: "236012a5263b4d719d857ae878166a54",
      parentInitiativeId: "635e9113f1b440c08be10586bd01327b",
      parentId: "236012a5263b4d719d857ae878166a54",
      children: [],
      schemaVersion: 1,
      collaborationGroupId: "cefce618f9484a13b827d65be2983e93",
    },
    url: "http://bdd-dc.hubqa.arcgis.com",
    proxyFilter: null,
    access: "private",
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
    numViews: 2012,
    scoreCompleteness: 73,
    groupDesignations: null,
  },
  data: {
    source: "df2eaefc53cd43e78eb2e1b3537104e1",
    folderId: null,
    values: {
      faviconUrl:
        "//dyq9ux9ryu4qj.cloudfront.net/opendata-admin/assets/images/favicon-45a5f6cdc7f23c52b20204d54a7d9ca2.ico",
      map: {
        basemaps: {
          type: "default",
          primary: {
            extent: {
              xmin: -20037507.067161843,
              ymin: -19971868.88040859,
              xmax: 20037507.067161843,
              ymax: 19971868.880408563,
              spatialReference: {
                wkid: 102100,
              },
            },
            isWebMercator: true,
            title: "Light Gray Canvas",
            baseMapLayers: [
              {
                type: "ArcGISTiledMapServiceLayer",
                url: "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer",
              },
              {
                type: "ArcGISTiledMapServiceLayer",
                url: "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer",
                isReference: true,
              },
            ],
          },
          secondary: {
            extent: {
              xmin: -20037507.067161843,
              ymin: -19971868.88040859,
              xmax: 20037507.067161843,
              ymax: 19971868.880408563,
              spatialReference: {
                wkid: 102100,
              },
            },
            isWebMercator: true,
            title: "World Imagery",
            baseMapLayers: [
              {
                type: "ArcGISTiledMapServiceLayer",
                url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
              },
            ],
          },
        },
      },
      defaultExtent: {
        type: "extent",
        xmin: -8591193.02145486,
        ymin: 4686637.938320901,
        xmax: -8560023.564032767,
        ymax: 4726686.262983277,
        spatialReference: {
          wkid: 102100,
        },
      },
      pages: [],
      capabilities: [
        "geohash",
        "api_explorer",
        "pages",
        "my_data",
        "social_logins",
        "json_chart_card",
        "document_iframes",
        "items_view",
        "disableDiscussions",
      ],
      defaultHostname: "bdd-dc.hubqa.arcgis.com",
      subdomain: "bdd",
      collaborationGroupId: "484d8c5d805e4029a21898319a24039f",
      groups: ["22f49221a9404cc7b3122f488120d513"],
      updatedBy: "dcadminqa",
      clientId: "t1EtD6y3qY8PI8ER",
      siteId: "49817",
      uiVersion: "2.2",
      layout: {
        header: {
          component: {
            name: "site-header",
            settings: {
              iframeHeight: "150px",
              iframeUrl: "",
              links: [],
              logoUrl: "",
              markdown:
                '<nav class="navbar navbar-default navbar-static-top first-tier">\n  <div class="container">\n    <div class="navbar-header">\n      <div class="navbar-brand">\n        <div class="site-logo">\n          <img src="http://placehold.it/50x50" alt="logo">\n          <h1>My Organization</h1>\n        </div>\n     </div>\n    </div>\n    <ul class="nav nav-pills pull-right" role="navigation">\n        <li><a href="#">Terms of Use</a></li>\n        <li><a href="#">Twitter</a></li>\n        <li><a href="#">Blog</a></li>\n    </ul>\n  </div>\n</nav>\n<nav class="navbar navbar-inverse navbar-static-top second-tier" role="navigation">\n      <div class="container">\n         <div class="navbar">\n          <ul class="nav navbar-nav">\n            <li class="active"><a href="#">Home</a></li>\n            <li><a href="#about">About</a></li>\n            <li><a href="#contact">Contact</a></li>\n          </ul>\n        </div>\n      </div>\n    </nav>\n',
              headerType: "default",
              fullWidth: false,
              title: "",
            },
          },
        },
        sections: [
          {
            containment: "fixed",
            isFooter: false,
            style: {
              background: {
                color: "transparent",
              },
              color: "#000000",
            },
            rows: [
              {
                cards: [
                  {
                    component: {
                      name: "iframe-card",
                      settings: {
                        src: "",
                        height: 500,
                        scrollable: false,
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
                      name: "webmap-card",
                      settings: {
                        height: 500,
                        showTitle: true,
                        title: "New Map",
                        webmap: "",
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
                      name: "jumbotron-card",
                      settings: {
                        header: "Heading",
                        subheader: "Search, Visualize, Download, Create",
                        minHeight: 100,
                        showLocation: true,
                        showSearch: true,
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
                      name: "search-card",
                      settings: {
                        showLocation: false,
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
                      name: "event-list-card",
                      settings: {
                        calendarEnabled: true,
                        defaultView: "calendar",
                        eventListTitleAlign: "left",
                        height: 500,
                        listEnabled: true,
                        showTitle: true,
                        title: "List of Upcoming Events",
                      },
                    },
                    width: 12,
                  },
                ],
              },
            ],
          },
        ],
        footer: {
          component: {
            name: "site-footer",
            settings: {
              markdown:
                '<div class="footer-background">\n  <div class="container">\n    <div class="col-xs-12">\n      \t<img src="http://placehold.it/110x80" class="center-block logo">\n    </div>\n    <div class="col-xs-12 center-block">\n      \t<ul class="nav nav-pills">\n          \t<li role="presentation"><a href="#">Home</a></li>\n          \t<li role="presentation"><a href="#">Catalog</a></li>\n          \t<li role="presentation"><a href="#">Terms of Service</a></li>\n              <li role="presentation"><a href="#">Privacy Policy</a></li>\n              <li role="presentation"><a href="#">Contact Us</a></li>\n        \t</ul>\n    </div>\n    <div class="col-xs-12">\n      <div class="text-center">© 2017 Your Organization</div>\n    </div>\n  </div>\n</div>',
              footerType: "none",
            },
          },
        },
      },
      theme: {
        logo: {
          small:
            "https://octo.dc.gov/sites/default/files/dc/sites/octo/multimedia_content/images/OpenData-HeaderLogo-WhiteText-2.png",
        },
        header: {
          background: "#1c66a6",
          text: "#ffffff",
        },
        body: {
          background: "#f8f8f8",
          text: "#4c4c4c",
          link: "#136fbf",
        },
        button: {
          background: "#ffffff",
          text: "#1c66a6",
        },
        fonts: {
          base: {
            url: "",
            family: "Avenir Next",
          },
          heading: {
            url: "",
            family: "Avenir Next",
          },
        },
      },
      headerSass:
        ".custom-header {\n\n  .first-tier {\n    height: 80px;\n    margin-bottom: 0px;\n  }\n\n  .first-tier .nav>li>a {\n    margin-top: 5px;\n    padding: 3px 6px;\n  }\n\n  .first-tier .nav>li>a:focus,\n  .first-tier .nav>li>a:hover {\n    background-color: #136fbf;\n    color: #fff;\n  }\n\n  .first-tier .site-logo img {\n    vertical-align: middle;\n  }\n\n  .first-tier h1 {\n    display: inline;\n    font-size: 25px;\n  }\n\n  .second-tier {\n    margin-bottom: 0px;\n  }\n}",
      footerSass:
        ".custom-footer {\n\n  .footer-background {\n    padding-top: 20px;\n    padding-bottom: 20px;\n    background-color: #e7e7e7;\n  }\n\n  .logo, .nav {\n    margin-bottom: 10px;\n  }\n\n  .nav-pills {\n      display: flex;\n      justify-content: center;\n  }\n}",
      updatedAt: "2018-08-06T16:22:21.312Z",
      internalUrl: "bdd-dc.hubqa.arcgis.com",
      externalUrl: null,
    },
  },
};
