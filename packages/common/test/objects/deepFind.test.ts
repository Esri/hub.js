import { deepFindById, deepFind } from "../../src/objects/deepFind";

describe("deepFind:", () => {
  describe("predicate:", () => {
    it("finds entry in array", () => {
      const t = ["a", "b", "c"];
      const p = (obj: any) => obj === "b";
      const chk = deepFind(t, p);
      expect(chk).toEqual("b");
    });

    it("finds object entry in array", () => {
      const t = [{ notid: "a" }, { id: "b" }, { id: "c" }];
      const p = (obj: any) => obj?.id === "b";
      const chk = deepFind(t, p);
      expect(chk.id).toEqual("b");
    });
    it("returns object if it matches", () => {
      const t = { id: "b" };
      const p = (obj: any) => obj?.id === "b";
      const chk = deepFind(t, p);
      expect(chk.id).toEqual("b");
    });

    it("skips dates", () => {
      const t = new Date();
      const p = (obj: any) => obj.id === "b";
      const chk = deepFind(t, p);
      expect(chk).toBeUndefined();
    });
    it("skips fns, even if they have an id", () => {
      const t = () => 2;
      t.id = "b";
      const p = (obj: any) => obj.id === "b";
      const chk = deepFind(t, p);
      expect(chk).toBeUndefined();
    });
    it("skips regex", () => {
      const t = new RegExp("b");
      const p = (obj: any) => obj.id === "b";
      const chk = deepFind(t, p);
      expect(chk).toBeUndefined();
    });
    it("returns null if nothing is found", () => {
      const t = [{ notid: "a" }, { id: "b" }, { id: "c" }];
      const p = (obj: any) => obj?.id === "na";
      const chk = deepFind(t, p);
      expect(chk).toBeUndefined();
    });
    it("works with deep nesting", () => {
      const t = {
        one: [
          {
            deeper: [
              {
                id: "notme",
                color: "orange",
              },
              {
                id: "findMe",
                color: "red",
              },
            ],
          },
        ],
        onea: {
          other: "thing",
        },
      };
      const p = (obj: any) => obj?.id === "findMe";
      const chk = deepFind(t, p);
      expect(chk).toEqual({ id: "findMe", color: "red" });
    });
  });
  describe("deepFindById", () => {
    it("returns simple object with id key", () => {
      const t = {
        id: "findMe",
        color: "red",
      };

      const chk = deepFindById(t, "findMe");
      expect(chk).toEqual(t);
    });

    it("returns deep object with the id", () => {
      const t = {
        one: {
          two: {
            id: "findMe",
            color: "red",
          },
        },
        onea: {
          other: "thing",
        },
      };

      const chk = deepFindById(t, "findMe");
      expect(chk).toEqual(t.one.two);
    });
    it("returns null if not found", () => {
      const t = {
        one: {
          two: {
            id: "findMe",
            color: "red",
          },
          three: {
            notId: "findMe",
            color: "blue",
          },
        },
        onea: {
          other: "thing",
        },
      };

      const chk = deepFindById(t, "not present");
      expect(chk).toBeUndefined();
    });
    it("works with arrays", () => {
      const t = {
        one: [
          {
            id: "findMe",
            color: "red",
          },
        ],
        onea: {
          other: "thing",
        },
      };

      const chk = deepFindById(t, "findMe");
      expect(chk).toEqual(t.one[0]);
    });

    it("works with nested arrays", () => {
      const t = {
        one: [
          {
            deeper: [
              {
                id: "notme",
                color: "orange",
              },
              {
                id: "findMe",
                color: "red",
              },
            ],
          },
        ],
        onea: {
          other: "thing",
        },
      };

      const chk = deepFindById(t, "findMe");
      expect(chk.color).toEqual("red");
    });

    it("works with a large graph", () => {
      const expected = {
        name: "category-card",
        id: "myCoolCard",
        settings: {
          category: "Community Services",
          type: "keyword",
          keyword: "communityservices",
          iconName: "demographics",
          iconType: "library",
          iconColor: "#787770",
          customAltText: "",
        },
      };

      const chk = deepFindById(data.values.layout, "myCoolCard");
      expect(chk).toEqual(expected);
    });
  });
});

const data: any = {
  values: {
    title: "     County of Middlesex",
    subdomain: "data",
    externalUrl: null,
    public: false,
    faviconUrl:
      "https://s3.amazonaws.com/geohub-assets/templates/sites/defaultSite/resources/favicon.ico",
    uiVersion: "2.3",
    extent: {},
    map: {
      basemaps: {
        type: "custom",
        primary: {
          baseMapLayers: [
            {
              id: "NatGeo_World_Map_2536",
              layerType: "ArcGISTiledMapServiceLayer",
              url: "https://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer",
              visibility: true,
              opacity: 1,
              title: "National Geographic World Map",
              type: "ArcGISTiledMapServiceLayer",
            },
          ],
          title: "National Geographic",
          spatialReference: {
            wkid: 102100,
            latestWkid: 3857,
          },
          extent: {
            xmin: -20037508.231469758,
            ymin: -19971868.88040859,
            xmax: 20037508.231469758,
            ymax: 19971868.880408563,
            spatialReference: {
              wkid: 102100,
              latestWkid: 3857,
            },
          },
          isWebMercator: true,
        },
      },
    },
    defaultExtent: {
      type: "extent",
      xmin: -82.00721435545773,
      ymin: 42.4959099508744,
      xmax: -80.6284301757703,
      ymax: 43.3127016380182,
      spatialReference: {
        wkid: 4326,
      },
    },
    pages: [
      {
        id: "c7944ad84bd14f4fb34953a911c59197",
        title: "Community Services",
        slug: "community-services",
      },
    ],
    layout: {
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
              transparency: 0,
              position: {
                x: "center",
                y: "center",
              },
              color: "transparent",
              image:
                "https://www.middlesex.ca/sites/default/files/styles/slider/public/images/slides/7D8J9642.png?itok=a7LvcyoA",
              darken: false,
            },
            color: "#ffffff",
          },
          rows: [
            {
              cards: [
                {
                  component: {
                    name: "jumbotron-card",
                    settings: {
                      header: "Middlesex County Open Data",
                      subheader: "",
                      minHeight: "150",
                      showLocation: false,
                      imageUrl: "",
                      fileSrc: "",
                      cropSrc: "",
                      isUrl: true,
                      isFile: false,
                      state: "",
                      position: {
                        x: "center",
                        y: "center",
                      },
                      display: {},
                      showSearch: false,
                    },
                  },
                  width: 12,
                },
              ],
            },
          ],
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
              position: {
                x: "center",
                y: "center",
              },
              color: "#0079c1",
              image: "",
            },
            color: "#ffffff",
          },
          rows: [
            {
              cards: [
                {
                  component: {
                    name: "markdown-card",
                    settings: {
                      markdown:
                        '<p class="lead text-center">Welcome to Middlesex County Open Data! <br>\n<br>\n\nThis is the platform for exploring and downloading GIS data, discovering and building apps, and engaging others to solve important issues. You can analyze and combine datasets using maps, as well as develop new web and mobile applications. <br/></p>',
                      schemaVersion: 1,
                    },
                  },
                  width: 12,
                  showEditor: false,
                },
              ],
            },
          ],
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
              position: {
                x: "center",
                y: "center",
              },
              color: "transparent",
            },
            color: "#4C4C4C",
          },
          rows: [
            {
              cards: [
                {
                  component: {
                    name: "image-card",
                    settings: {
                      src: "https://www.middlesex.ca/sites/default/files/logo.png",
                      fileSrc: "",
                      cropSrc: "",
                      alt: "",
                      caption: "",
                      captionAlign: "center",
                      hyperlink: "https://www.middlesex.ca/",
                      hyperlinkTabOption: "new",
                      isUrl: true,
                      isFile: false,
                      state: "valid",
                      display: {
                        position: {
                          x: "center",
                          y: "center",
                        },
                        reflow: false,
                      },
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
                      header: "Find Data",
                      subheader: "",
                      minHeight: "100",
                      showLocation: false,
                      imageUrl: null,
                      fileSrc: "",
                      cropSrc: "",
                      isUrl: true,
                      isFile: false,
                      state: "",
                      position: {
                        x: "center",
                        y: "center",
                      },
                      display: {},
                      showSearch: true,
                      searchPlaceholder: "Search for Open Data",
                    },
                  },
                  width: 12,
                },
              ],
            },
          ],
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
              position: {
                x: "center",
                y: "center",
              },
              color: "#ffffff",
            },
            color: "#808080",
          },
          rows: [
            {
              cards: [
                {
                  component: {
                    name: "markdown-card",
                    settings: {
                      markdown:
                        '<h2 class="text-center" style="color: #4c4c4c; line-height: 50px; font-size: 40px; font-weight:bold;text-shadow: 1.2px 1.2px #8c8c8c ">Explore By Categories</h2>\n',
                      schemaVersion: 1,
                    },
                  },
                  width: 12,
                  showEditor: false,
                },
              ],
            },
            {
              cards: [
                {
                  component: {
                    name: "category-card",
                    settings: {
                      category: "Boundaries",
                      type: "keyword",
                      keyword: "boundary",
                      iconName: "boundaries",
                      iconType: "library",
                      iconColor: "#f2d017",
                      customAltText: "",
                      groupId: "3fe8afdd61614b3d95ba479ccc9c63ec",
                    },
                  },
                  width: 3,
                },
                {
                  component: {
                    name: "category-card",
                    settings: {
                      category: "Address Points",
                      type: "keyword",
                      keyword: "Address Points",
                      iconName: "locationaddress",
                      iconType: "library",
                      iconColor: "#0e228a",
                      customAltText: "",
                    },
                  },
                  width: 3,
                },
                {
                  component: {
                    name: "category-card",
                    settings: {
                      category: "Road Network",
                      type: "keyword",
                      keyword: "roads",
                      iconName: "transportation",
                      iconType: "library",
                      iconColor: "#19590f",
                      customAltText: "",
                      groupId: "b316c43d35a3400f985e333e9a2c5cb2",
                    },
                  },
                  width: 3,
                },
                {
                  component: {
                    name: "category-card",
                    id: "myCoolCard",
                    settings: {
                      category: "Community Services",
                      type: "keyword",
                      keyword: "communityservices",
                      iconName: "demographics",
                      iconType: "library",
                      iconColor: "#787770",
                      customAltText: "",
                    },
                  },
                  width: 3,
                },
              ],
            },
          ],
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
              position: {
                x: "center",
                y: "center",
              },
              color: "transparent",
            },
            color: "#4c4c4c",
          },
          rows: [
            {
              cards: [
                {
                  component: {
                    name: "markdown-card",
                    settings: {
                      markdown:
                        "<p>The Data is provided &quot;as is&quot;, without warranty, representation or condition of any kind.  The County of Middlesex disclaims all warranties and conditions, express or implied, in respect of the Data and the Modifications, including all implied warranties or conditions of merchantable quality and fitness for a particular purpose.  In particular, the County of Middlesex does not warrant that the information comprising the Data and the Modifications is up-to-date or accurate.</p>\n<p>The Data is provided for information purposes only.  The user acknowledges that the Data may not be up-to-date or accurate and the County of Middlesex shall not be responsible for any damage to property, injury to person or any other loss suffered by you for relying on the Data.  In no event shall the County of Middlesex be responsible for any special, indirect, incidental or consequential damages which you may incur, even if advised of the possibility thereof.</p>\n",
                      schemaVersion: 1,
                    },
                  },
                  width: 12,
                  showEditor: false,
                },
              ],
            },
          ],
        },
        {
          containment: "fixed",
          isFooter: false,
          style: {
            background: {
              isFile: false,
              isUrl: true,
              state: "valid",
              display: {},
              transparency: 0,
              position: {
                x: "center",
                y: "center",
              },
              color: "transparent",
              image:
                "https://s3.amazonaws.com/geohub-assets/templates/sites/defaultSite/resources/blue-map-banner.jpg",
            },
            color: "#ffffff",
          },
          rows: [
            {
              cards: [
                {
                  component: {
                    name: "markdown-card",
                    settings: {
                      markdown:
                        '<p><h2 class="text-center">Unlock the Data</h2></p>\n<p class="text-center">Anyone can use this data at no cost. Download raw data and share your insights with your teams or build new applications that serve specific users.</p>\n\n<div class="row">\n<div class="col-xs-12 col-sm-6 col-md-3">\n<div class="p p-default">\n<div class="p-heading"><center><img src="https://s3.amazonaws.com/geohub-assets/templates/sites/defaultSite/resources/explore.png" /></center></div>\n<div class="p-body">\n<h3 class="text-center">Explore</h3>\n<p class="text-center">Dig into the data.</p>\n</div></div>\n</div>\n<div class="col-xs-12 col-sm-6 col-md-3">\n<div class="p p-default">\n<div class="p-heading"><center><img src="https://s3.amazonaws.com/geohub-assets/templates/sites/defaultSite/resources/visualize.png" /></center></div>\n<div class="p-body">\n<h3 class="text-center">Visualize &amp; Analyze</h3>\n<p class="text-center">Highlight spatial patterns and discover trends.</p>\n</div></div>\n</div>\n<div class="col-xs-12 col-sm-6 col-md-3">\n<div class="p p-default">\n<div class="p-heading"><center><img src="https://s3.amazonaws.com/geohub-assets/templates/sites/defaultSite/resources/build.png" /></center></div>\n<div class="p-body">\n<h3 class="text-center">Build</h3>\n<p class="text-center">Develop new apps using templates and API&#39;s.</p>\n</div></div>\n</div>\n<div class="col-xs-12 col-sm-6 col-md-3">\n<div class="p p-default">\n<div class="p-heading"><center><img src="https://s3.amazonaws.com/geohub-assets/templates/sites/defaultSite/resources/share.png" /></center></div>\n<div class="p-body">\n<h3 class="text-center">Share</h3>\n<p class="text-center">Embed analysis on your website.</p>\n</div></div>\n</div>\n</div>',
                      schemaVersion: 1,
                    },
                  },
                  width: 12,
                  showEditor: false,
                },
              ],
            },
          ],
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
              position: {
                x: "center",
                y: "center",
              },
              color: "#dedede",
              image: "",
            },
            color: "#757575",
          },
          rows: [
            {
              cards: [
                {
                  component: {
                    name: "markdown-card",
                    settings: {
                      markdown:
                        '<h2 class="text-center">More data to come!</h2>\n\n<h2 class="text-center">Comments? Suggestions? Specific data requests? </h2>\n<h2 class="text-center">Contact the Middlesex County GIS team for more information</h2>\n<h2 class="text-center"><span class="glyphicon glyphicon-envelope" style="margin-right:10px;"></span><a href="mailto:opendata@middlesex.ca"> opendata@middlesex.ca</a></h2>',
                      schemaVersion: 1,
                    },
                  },
                  width: 12,
                  showEditor: false,
                },
              ],
            },
          ],
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
              position: {
                x: "center",
                y: "center",
              },
              color: "#f3f3ee",
              image: "",
            },
            color: "#333333",
          },
          rows: [
            {
              cards: [
                {
                  component: {
                    name: "markdown-card",
                    settings: {
                      markdown:
                        "<p><br/>\n<em>Copyright 2018.      County of Middlesex.</em></p>\n",
                      schemaVersion: 1,
                    },
                  },
                  width: 12,
                  showEditor: false,
                },
              ],
            },
          ],
        },
      ],
      header: {
        component: {
          name: "site-header",
          settings: {
            fullWidth: false,
            iframeHeight: "150px",
            iframeUrl: "",
            links: [],
            logoUrl: "",
            title: "     County of Middlesex",
            markdown:
              '<nav class="navbar navbar-default navbar-static-top first-tier">\n  <div class="container">\n    <div class="navbar-header">\n      <div class="navbar-brand">\n        <div class="site-logo">\n          <img src="https://s3.amazonaws.com/geohub-assets/templates/sites/defaultSite/resources/50x50.png" alt="logo">\n          <h1>My Organization</h1>\n        </div>\n     </div>\n    </div>\n    <ul class="nav nav-pills pull-right" role="navigation">\n        <li><a href="#">Terms of Use</a></li>\n        <li><a href="#">Twitter</a></li>\n        <li><a href="#">Blog</a></li>\n    </ul>\n  </div>\n</nav>\n<nav class="navbar navbar-inverse navbar-static-top second-tier" role="navigation">\n      <div class="container">\n         <div class="navbar">\n          <ul class="nav navbar-nav">\n            <li class="active"><a href="#">Home</a></li>\n            <li><a href="#about">About</a></li>\n            <li><a href="#contact">Contact</a></li>\n          </ul>\n        </div>\n      </div>\n    </nav>\n',
            headerType: "default",
          },
        },
      },
      footer: {
        component: {
          name: "site-footer",
          settings: {
            footerType: "none",
            markdown:
              '<div class="footer-background">\n  <div class="container">\n    <div class="col-xs-12">\n      \t<img src="https://s3.amazonaws.com/geohub-assets/templates/sites/defaultSite/resources/110x80.png" class="center-block logo">\n    </div>\n    <div class="col-xs-12 center-block">\n      \t<ul class="nav nav-pills">\n          \t<li role="presentation"><a href="#">Home</a></li>\n          \t<li role="presentation"><a href="#">Catalog</a></li>\n          \t<li role="presentation"><a href="#">Terms of Service</a></li>\n              <li role="presentation"><a href="#">Privacy Policy</a></li>\n              <li role="presentation"><a href="#">Contact Us</a></li>\n        \t</ul>\n    </div>\n    <div class="col-xs-12">\n      <div class="text-center">© 2018      County of Middlesex</div>\n    </div>\n  </div>\n</div>',
          },
        },
      },
    },
    theme: {
      header: {
        background: "#0079c1",
        text: "#ffffff",
      },
      body: {
        background: "#ffffff",
        text: "#5c5c5c",
        link: "#73b2ff",
      },
      button: {
        background: "#0079c1",
        text: "#ffffff",
      },
      logo: {
        small: "",
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
      flags: {
        umbrella: false,
        iframeheader: false,
        customheader: false,
      },
      globalNav: {
        background: "#0079c1",
        text: "#ffffff",
      },
    },
    headerCss:
      "\n  .first-tier {\n    height: 80px;\n    margin-bottom: 0px;\n  }\n\n  .first-tier .nav>li>a {\n    margin-top: 5px;\n    padding: 3px 6px;\n  }\n\n  .first-tier .nav>li>a:focus,\n  .first-tier .nav>li>a:hover {\n    background-color: #136fbf;\n    color: #fff;\n  }\n\n  .first-tier .site-logo img {\n    vertical-align: middle;\n  }\n\n  .first-tier h1 {\n    display: inline;\n    font-size: 25px;\n  }\n\n  .second-tier {\n    margin-bottom: 0px;\n  }\n",
    footerCss:
      "\n  .footer-background {\n    padding-top: 20px;\n    padding-bottom: 20px;\n    background-color: #e7e7e7;\n  }\n\n  .logo, .nav {\n    margin-bottom: 10px;\n  }\n\n  .nav-pills {\n      display: flex;\n      justify-content: center;\n  }\n",
    collaborationGroupId: "7bf3f6fc3a364c7fa04b7e9155f920a9",
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
    defaultHostname: "data-middlesex.opendata.arcgis.com",
    updatedAt: "2021-02-08T14:04:20.069Z",
    updatedBy: "Colesberry",
    clientId: "CkmBrDlp1uHSByqp",
    siteId: "20877",
    internalUrl: "data-middlesex.opendata.arcgis.com",
  },
  catalog: {
    groups: [
      "b316c43d35a3400f985e333e9a2c5cb2",
      "3fe8afdd61614b3d95ba479ccc9c63ec",
      "9b46d8fca0a446e9a439cddaab1b223f",
    ],
  },
};
