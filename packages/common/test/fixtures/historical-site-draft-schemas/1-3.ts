import { IDraft } from "../../../src";

export const oneThreeSiteDraftIncludeList = [
  "item.title",
  "item.snippet",
  "data.values.layout",
  "data.values.theme",
  "data.values.headerCss",
  "data.values.headerSass",
  "data.values.footerSass",
  "data.values.footerCss",
  "data.values.faviconUrl",
  "data.values.gacode",
  "data.values.map",
  "data.values.capabilities",
];

export const draftModelOneThree: IDraft = {
  item: {
    title: "tate-test-5",
    snippet:
      "Create your own initiative by combining existing applications with a custom site. Use this initiative to form teams around a problem and invite your community to participate.",
  },
  data: {
    values: {
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
                transparency: 60,
                position: {
                  x: "center",
                  y: "center",
                },
                color: "#000000",
                image:
                  "https://s3.amazonaws.com/geohub-assets/templates/public-engagement/city-architecture.jpg",
                darken: true,
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
                        schemaVersion: 2.1,
                        markdown:
                          '\n<br>\n<br>\n<br>\n<br>\n<br><h1 style="text-align: center;">tate-test-5</h1><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><p style="text-align: center;">What will this initiative achieve if successful?</p>\n\n\n<br>\n<br>\n<br>\n<br>\n<br>',
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
                color: "#3276ae",
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
                        schemaVersion: 1,
                        markdown:
                          '<h5 style="text-align: center;">Create your own initiative by combining existing applications with a custom site. Use this initiative to form teams around a problem and invite your community to participate.</h5><h5 style="text-align: center;"><br></h5><h5 style="text-align: center;">\n</h5><p style="text-align: center;"></p>',
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
                      name: "items/gallery-card",
                      settings: {
                        query: {
                          mode: "manual",
                          num: 4,
                          types: ["template"],
                          tags: [],
                          categories: [],
                          groups: ["9fcdc612b45845f8b49f80e0fac4ee85"],
                          catalogs: ["f226e05a11754614b0876810592e5bcd"],
                          ids: [],
                          sort: "numviews",
                          access: [],
                          orgId: "97KLIFOSt5CxbiRI",
                          siteId: "",
                        },
                        display: {
                          imageType: "Thumbnails",
                          viewText: "Explore",
                          dropShadow: "none",
                          cornerStyle: "square",
                          buttonType: "primary",
                          newTab: false,
                          includeButtons: false,
                        },
                        version: 7,
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
                color: "transparent",
              },
            },
            rows: [
              {
                cards: [
                  {
                    component: {
                      name: "markdown-card",
                      settings: {
                        schemaVersion: 2.1,
                        markdown:
                          '<div class="mt-8 mb-8" style="text-align: center;">\n    <h1>Our Progress So Farr</h1>\n    <p>Leverage this section to share progress or other stats with the public. Make it transparent and exciting to see the results of the hard work or why an initiative needs support. This is also a great space to inspire your audience to potentially get involved.</p>\n</div>',
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
                      name: "summary-statistic-card",
                      settings: {
                        url: "",
                        statFieldName: "",
                        statFieldType: "",
                        statType: "",
                        statValueAlign: "left",
                        statValueColor: null,
                        decimalPlaces: 2,
                        title: "Statistic Title",
                        titleAlign: "left",
                        leadingText: "",
                        trailingText: "...",
                        trailingTextAlign: "left",
                        formatNumberGroupings: true,
                        showAsCurrency: false,
                        currencyCode: "USD",
                      },
                    },
                    width: 4,
                  },
                  {
                    component: {
                      name: "summary-statistic-card",
                      settings: {
                        url: "",
                        statFieldName: "",
                        statFieldType: "",
                        statType: "",
                        statValueAlign: "left",
                        statValueColor: null,
                        decimalPlaces: 2,
                        title: "Statistic Title",
                        titleAlign: "left",
                        leadingText: "",
                        trailingText: "...",
                        trailingTextAlign: "left",
                        formatNumberGroupings: true,
                        showAsCurrency: false,
                        currencyCode: "USD",
                      },
                    },
                    width: 4,
                  },
                  {
                    component: {
                      name: "summary-statistic-card",
                      settings: {
                        url: "",
                        statFieldName: "",
                        statFieldType: "",
                        statType: "",
                        statValueAlign: "left",
                        statValueColor: null,
                        decimalPlaces: 2,
                        title: "Statistic Title",
                        titleAlign: "left",
                        leadingText: "",
                        trailingText: "...",
                        trailingTextAlign: "left",
                        formatNumberGroupings: true,
                        showAsCurrency: false,
                        currencyCode: "USD",
                      },
                    },
                    width: 4,
                  },
                ],
              },
              {
                cards: [
                  {
                    component: {
                      name: "markdown-card",
                      settings: {
                        schemaVersion: 1,
                        markdown: '<div class="mb-4"></div>',
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
                color: "#f5f5f5",
              },
              color: "#4e4e4e",
            },
            rows: [
              {
                cards: [
                  {
                    component: {
                      name: "markdown-card",
                      settings: {
                        schemaVersion: 1,
                        markdown:
                          '<div class="mt-8 mb-4" style="text-align: center;">\n<h1>Get Involved with the Community Today!</h1>\n<p>Utilize this section to provide steps on how to get involved, show different phases of your initiative or simply highlight areas of concern.</p>\n</div>',
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
                      name: "markdown-card",
                      settings: {
                        schemaVersion: 1,
                        markdown:
                          '<ul class="pledge-wrapper pledge-wrapper-center pledge-numbers-white">\n\n  <li>\n    <div class="pledge-content">\n      <h3 class="pledge-title">Help improve the air quality</h3>\n      <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\n    </div>\n  </li>\n\n  <li>\n    <div class="pledge-content">\n      <h3 class="pledge-title">Report Data</h3>\n      <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\n    </div>\n  </li>\n\n  <li>\n    <div class="pledge-content">\n      <h3 class="pledge-title">Become Involved</h3>\n      <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\n    </div>\n  </li>\n\n  <li>\n    <div class="pledge-content">\n      <h3 class="pledge-title">Contribute</h3>\n      <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\n    </div>\n  </li>\n  \n</ul>\n\n\n<style>\n/* Pledge Wrapper - Default */\n.pledge-wrapper,\n.pledge-wrapper-center,\n.pledge-wrapper-simple {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  display: flex;\n  flex-flow: row wrap; }\n\n.pledge-wrapper li,\n.pledge-wrapper-center li,\n.pledge-wrapper-simple li {\n  counter-increment: pledge-counter;\n  position: relative;\n  flex-basis: 25%;\n  width: 25%;\n  margin-top: 40px;\n  padding-top: 40px; }\n\n@media screen and (max-width: 800px) {\n  .pledge-wrapper li,\n  .pledge-wrapper-center li,\n  .pledge-wrapper-simple li {\n    flex-basis: 50%;\n    width: 50%; }\n  .pledge-wrapper li::before,\n  .pledge-wrapper-center li::before,\n  .pledge-wrapper-simple li::before {\n    transform: translate(0, -50%) !important; } }\n\n@media screen and (max-width: 600px) {\n  .pledge-wrapper li,\n  .pledge-wrapper-center li,\n  .pledge-wrapper-simple li {\n    flex-basis: 100%;\n    width: 100%; } }\n\n.pledge-wrapper li::before,\n.pledge-wrapper-center li::before,\n.pledge-wrapper-simple li::before {\n  box-sizing: border-box;\n  content: counter(pledge-counter);\n  display: inline-block;\n  font-family: \'Avenir\', sans-serif;\n  font-size: 3rem;\n  font-weight: 600;\n  line-height: 1;\n  text-align: center;\n  background-color: #4C93E0;\n  border-radius: 50%;\n  color: #fff;\n  padding: 1rem;\n  height: 48px;\n  width: 48px;\n  position: absolute;\n  top: 0;\n  left: 0;\n  transform: translate(-50%, -50%);\n  z-index: 4; }\n\n.pledge-wrapper li::after,\n.pledge-wrapper-center li::after {\n  content: \'\';\n  display: block;\n  background-color: #4C93E0;\n  border-radius: 0;\n  height: 10px;\n  width: 100%;\n  position: absolute;\n  top: 0;\n  transform: translateY(-50%);\n  z-index: 2; }\n\n.pledge-wrapper li:first-of-type::after,\n.pledge-wrapper-center li:first-of-type::after {\n  border-radius: 10px 0 0 10px; }\n\n.pledge-wrapper li:last-of-type::after,\n.pledge-wrapper-center li:last-of-type::after {\n  border-radius: 0 10px 10px 0; }\n\n.pledge-wrapper .pledge-content,\n.pledge-wrapper-center .pledge-content {\n  box-sizing: border-box;\n  margin-top: -1.5rem;\n  padding: 0 2rem; }\n\n.pledge-wrapper .pledge-content .pledge-title,\n.pledge-wrapper-center .pledge-content .pledge-title,\n.pledge-wrapper-simple .pledge-content .pledge-title {\n  font-family: \'Avenir\', sans-serif;\n  font-size: 2rem;\n  font-weight: 500; }\n\n/* Pledge Wrapper - Centered */\n.pledge-wrapper-center li::before {\n  font-size: 2rem;\n  left: 50%;\n  height: 56px;\n  width: 56px; }\n\n@media screen and (max-width: 800px) {\n  .pledge-wrapper-center li::before {\n    transform: translate(-50%, -50%) !important; } }\n\n.pledge-wrapper-center li::after {\n  border-radius: 0; }\n\n.pledge-wrapper-center .pledge-content {\n  text-align: center; }\n\n/* Pledge Wrapper - List */\n.pledge-wrapper-list {\n  list-style: none;\n  margin: 0;\n  padding: 0; }\n\n.pledge-wrapper-list li {\n  counter-increment: pledge-counter;\n  position: relative;\n  margin-left: 60px;\n  padding: 1rem 0; }\n\n.pledge-wrapper-list li::before {\n  box-sizing: border-box;\n  content: counter(pledge-counter);\n  display: inline-block;\n  font-family: \'Avenir\', sans-serif;\n  font-size: 6rem;\n  font-weight: 600;\n  line-height: 1;\n  text-align: center;\n  color: #4C93E0;\n  position: absolute;\n  top: 50%;\n  left: -35px;\n  transform: translate(-50%, -50%);\n  z-index: 4; }\n\n/* Pledge Wrapper - Simple */\n.pledge-wrapper-simple li::before {\n  background-color: transparent;\n  border-radius: 0;\n  color: #4C93E0;\n  font-size: 6rem; }\n\n/* Pledge Wrapper - White Numbers (Modifier) */\n.pledge-numbers-white li::before {\n  background-color: #fff;\n  border: 1px solid #4C93E0;\n  color: #4C93E0; }\n\n.flex-row {\n  display: flex;\n  align-items: center; }\n\n@media screen and (max-width: 767px) {\n  .flex-row {\n    flex-direction: column; } }\n</style>',
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
                      name: "markdown-card",
                      settings: {
                        schemaVersion: 1,
                        markdown:
                          '<div class="mt-3 mb-10" style="text-align: center;">\n  <a href="#" class="btn btn-lg btn-primary">Contribute</a>\n</div>',
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
                image: "",
              },
              color: "#444444",
            },
            rows: [
              {
                cards: [
                  {
                    component: {
                      name: "markdown-card",
                      settings: {
                        schemaVersion: 1,
                        markdown:
                          '<div class="mt-8 mb-6" style="text-align: center;">\n  <h1>Our Focus</h1>\n<p>Leverage these sections to tell your initiative story. Provide key information regarding your initiatives with an opportunity to go to a specific page or app to learn more.  </p>\n</div>',
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
                      name: "image-card",
                      settings: {
                        src: "https://s3.amazonaws.com/geohub-assets/templates/public-engagement/planting-trees.jpg",
                        fileSrc: "",
                        cropSrc: "",
                        alt: "",
                        caption: "",
                        captionAlign: "center",
                        hyperlink: "",
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
                    width: 6,
                  },
                  {
                    component: {
                      name: "markdown-card",
                      settings: {
                        schemaVersion: 1,
                        markdown:
                          '<div class="display-flex flex-middle" style="min-height: 360px">\n  <div>\n    <h2>Section Heading</h2>\n    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>\n    \n    <p><a href="#" class="btn btn-primary">Call To Action</a></p>\n  </div>\n</div>',
                      },
                    },
                    width: 6,
                    showEditor: false,
                  },
                ],
              },
              {
                cards: [
                  {
                    component: {
                      name: "markdown-card",
                      settings: {
                        schemaVersion: 1,
                        markdown:
                          '<div class="display-flex flex-middle" style="min-height: 360px">\n  <div>\n    <h2>Section Heading</h2>\n    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>\n    \n    <p><a href="#" class="btn btn-primary">Call To Action</a></p>\n  </div>\n</div>',
                      },
                    },
                    width: 6,
                    showEditor: false,
                  },
                  {
                    component: {
                      name: "image-card",
                      settings: {
                        src: "https://s3.amazonaws.com/geohub-assets/templates/public-engagement/growing-tomatoes.jpg",
                        fileSrc: "",
                        cropSrc: "",
                        alt: "",
                        caption: "",
                        captionAlign: "center",
                        hyperlink: "",
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
                    width: 6,
                  },
                ],
              },
              {
                cards: [
                  {
                    component: {
                      name: "image-card",
                      settings: {
                        src: "https://s3.amazonaws.com/geohub-assets/templates/public-engagement/wind-turbines.jpg",
                        fileSrc: "",
                        cropSrc: "",
                        alt: "",
                        caption: "",
                        captionAlign: "center",
                        hyperlink: "",
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
                    width: 6,
                  },
                  {
                    component: {
                      name: "markdown-card",
                      settings: {
                        schemaVersion: 1,
                        markdown:
                          '<div class="display-flex flex-middle" style="min-height: 360px">\n  <div>\n    <h2>Section Heading</h2>\n    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>\n    \n    <p><a href="#" class="btn btn-primary">Call To Action</a></p>\n  </div>\n</div>',
                      },
                    },
                    width: 6,
                    showEditor: false,
                  },
                ],
              },
              {
                cards: [
                  {
                    component: {
                      name: "markdown-card",
                      settings: {
                        schemaVersion: 1,
                        markdown:
                          '<div class="display-flex flex-middle" style="min-height: 360px">\n  <div>\n    <h2>Section Heading</h2>\n    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>\n    \n    <p><a href="#" class="btn btn-primary">Call To Action</a></p>\n  </div>\n</div>',
                      },
                    },
                    width: 6,
                    showEditor: false,
                  },
                  {
                    component: {
                      name: "image-card",
                      settings: {
                        src: "https://s3.amazonaws.com/geohub-assets/templates/public-engagement/bike-rentals.jpg",
                        fileSrc: "",
                        cropSrc: "",
                        alt: "",
                        caption: "",
                        captionAlign: "center",
                        hyperlink: "",
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
                    width: 6,
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
                color: "#ededed",
              },
              color: "#444444",
            },
            rows: [
              {
                cards: [
                  {
                    component: {
                      name: "markdown-card",
                      settings: {
                        schemaVersion: 1,
                        markdown:
                          '<div class="mt-4 mb-2" style="text-align: center;">\n  <h1>Don\'t just tell the story, show the story</h1>\n<p> Utilize an Esri Map on this page to show the changes or the primary areas of focus. </p>\n</div>',
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
                      name: "webmap-card",
                      settings: {
                        height: "400",
                        showTitle: true,
                        title: "",
                        webmap: "",
                        webscene: null,
                        titleAlign: "left",
                        enableMapLegend: false,
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
              color: "#444444",
            },
            rows: [
              {
                cards: [
                  {
                    component: {
                      name: "markdown-card",
                      settings: {
                        schemaVersion: 1,
                        markdown:
                          '<div  class="mt-10 mb-8" style="text-align: center;">\n<h1>See Our City in Action</h1>\n<p>Use this section to save your community visitors research time and connect them with reports, apps, and links to other sites, that will give them deeper insights on the initiative regarding your city.</p>\n</div>',
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
                      name: "items/gallery-card",
                      settings: {
                        query: {
                          num: "4",
                          tags: [],
                        },
                        display: {
                          imageType: "Thumbnails",
                          viewText: "Explore",
                          dropShadow: "none",
                          cornerStyle: "square",
                          buttonType: "primary",
                          newTab: false,
                          includeButtons: false,
                        },
                        version: 7,
                        selectedGroups: [
                          {
                            title: "tate-test-5",
                            id: "ad7ca12d49a54d658d433ffd9a3ba65a",
                          },
                        ],
                        displayOption: ["application"],
                        imageType: "Thumbnails",
                        viewText: "Explore",
                        contentResponse: true,
                        orgId: "97KLIFOSt5CxbiRI",
                        includedOption: "application",
                        siteId: "",
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
                color: "#367aaa",
              },
            },
            rows: [
              {
                cards: [
                  {
                    component: {
                      name: "event-list-card",
                      settings: {
                        cardVersion: 2,
                        initiativeIds: ["{{initiative.id}}"],
                        calendarEnabled: true,
                        eventListTitleAlign: "left",
                        listEnabled: true,
                        showTitle: true,
                        title: "List of upcoming events",
                        subtitle: "Location",
                        display: {
                          dropShadow: "none",
                          cornerStyle: "square",
                          colorPalette: "custom",
                        },
                        defaultView: "calendar",
                        height: 500,
                        textColor: "#000000",
                        backgroundColor: "#ffffff",
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
                state: "valid",
                display: {},
                transparency: 0,
                position: {
                  x: "center",
                  y: "center",
                },
                color: "#333333",
                image:
                  "https://s3.amazonaws.com/geohub-assets/templates/public-engagement/greenspace-community-center.jpg",
                darken: true,
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
                        schemaVersion: 1,
                        markdown:
                          '<div class="section-follow mt-10">\n  <h1 class="section-follow-title">Sign Up and Follow this initiative</h1>\n  <hr />\n  <div class="section-follow-content">\n    <p>Drive people to Sign Up for a community account and follow this initiative to receive updates from you. You can use the list to send email communication and invitations to host events.</p>\n  </div>\n</div>\n\n\n<style>\n  .section-follow {\n    margin-left: auto;\n    margin-right: auto;\n    padding-top: 2rem;\n    text-align: center;\n    width: 60%;\n  }\n\n  .section-follow .section-follow-title {\n    margin: 0 0 1.5rem;\n  }\n\n  .section-follow hr {\n    background-color: #3677ac;\n    border: 0;\n    height: 2px;\n    width: 100px;\n  }\n\n  .section-follow .section-follow-content {\n    font-size: 16px;\n    margin-bottom: 2rem;\n  }\n</style>',
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
                      name: "follow-initiative-card",
                      settings: {
                        initiativeId: "8dd1ffbc536f44bc9acf34dd8b061c11",
                        callToActionText: "",
                        callToActionAlign: "center",
                        buttonText: "Follow Our Initiative",
                        buttonAlign: "center",
                        buttonStyle: "solid",
                        unfollowButtonText: "Stop Following",
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
                        schemaVersion: 1,
                        markdown: '<div class="mb-10">&nbsp;</div>',
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
                color: "#555555",
                image: "",
                darken: true,
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
                        schemaVersion: 1,
                        markdown: "<div>&nbsp;</div>",
                      },
                    },
                    width: 3,
                    showEditor: false,
                  },
                  {
                    component: {
                      name: "markdown-card",
                      settings: {
                        schemaVersion: 1,
                        markdown:
                          '<div class="mt-6 mb-6" style="text-align: center;">\n  <h1>Contact</h1>\n  <p>Make your site a two-way communication platform with your community. Use this to let them know that you welcome their feedback and that you want to hear from them.</p>\n  <p><a href="#" class="btn btn-lg btn-primary">Call To Action</a></p>\n</div>',
                      },
                    },
                    width: 6,
                    showEditor: false,
                  },
                  {
                    component: {
                      name: "markdown-card",
                      settings: {
                        schemaVersion: 1,
                        markdown: "<div>&nbsp;</div>",
                      },
                    },
                    width: 3,
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
              title: "tate-test-5",
              markdown:
                '<nav class="navbar navbar-default navbar-static-top first-tier">\n  <div class="container">\n    <ul class="nav nav-pills pull-right" role="navigation">\n      <li><a href="#">Terms of Use</a></li>\n      <li><a href="#">Twitter</a></li>\n      <li><a href="#">Blog</a></li>\n    </ul>\n    <div class="navbar-brand">\n      <div class="site-logo">\n        <img src="https://placehold.it/50x50" alt="logo">\n        <h1>My Organization</h1>\n      </div>\n    </div>\n  </div>\n</nav>\n<nav class="navbar navbar-inverse navbar-static-top second-tier" role="navigation">\n  <div class="navbar-header">\n    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">\n      <span class="sr-only">Toggle navigation</span>\n      <span class="icon-bar"></span>\n      <span class="icon-bar"></span>\n      <span class="icon-bar"></span>\n    </button>\n  </div>\n  <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">\n    <div class="container">\n      <div class="navbar">\n        <ul class="nav navbar-nav">\n          <li class="active"><a href="#">Home</a></li>\n          <li><a href="#about">About</a></li>\n          <li><a href="#contact">Contact</a></li>\n          <li><a href="#contact">Contact</a></li>\n          <li><a href="#contact">Contact</a></li>\n          <li><a href="#contact">Contact</a></li>\n          <li><a href="#contact">Contact</a></li>\n        </ul>\n      </div>\n    </div>\n  </div>\n</nav>\n',
              headerType: "default",
              schemaVersion: 3,
              showLogo: true,
              showTitle: true,
              logo: {
                display: {},
              },
              shortTitle: "",
              menuLinks: [],
              socialLinks: {
                facebook: {},
                twitter: {},
                instagram: {},
                youtube: {},
              },
            },
          },
          showEditor: false,
        },
        footer: {
          component: {
            name: "site-footer",
            settings: {
              footerType: "custom",
              markdown:
                '<div class="footer-background">\n  <div class="container-fluid">\n    <div class="col-xs-12">\n      <img src="https://placehold.it/50x50?text=" alt="" class="center-block logo">\n    </div>\n    <div class="col-xs-6 center-block">\n      <ul class="nav nav-pills">\n\n        <li><a href="">URL</a></li>\n\n        <li><a href="">URL</a></li>\n\n        <li><a href="">URL</a></li>\n\n        <li><a href="">URL</a></li>\n\n      </ul>\n    </div>\n    <div class="col-xs-6 center-block">\n      <ul class="nav nav-pills" style="float:right;">\n        <li><a href="#">Terms of Service</a></li>\n        <li><a href="#">Privacy Policy</a></li>\n      </ul>\n    </div>\n    <div class="col-xs-12">\n      <div class="text-white" style="padding-top: 3rem; text-align: center;">\n        <p>&copy; Custom Initiative Template. All photos used on this site are from <a href="https://unsplash.com/">Unsplash</a>.</p>\n      </div>\n    </div>\n  </div>\n</div>',
              schemaVersion: 1,
            },
          },
          showEditor: false,
        },
      },
      theme: {
        header: {
          background: "#267300",
          text: "#fcfcfc",
        },
        body: {
          background: "#ffffff",
          text: "#323232",
          link: "#267300",
        },
        button: {
          background: "#267300",
          text: "#ffffff",
        },
        logo: {
          small:
            "https://user-images.githubusercontent.com/1218/34112930-11865eba-e3dc-11e7-82d6-4010f818e926.png",
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
        globalNav: {
          background: "#267300",
          text: "#fcfcfc",
        },
      },
      headerSass:
        ".first-tier {\n  height: 80px;\n  margin-bottom: 0px;\n  background-color: #005e95;\n}\n\n.first-tier .nav > li > a {\n  margin-top: 5px;\n  padding: 3px 6px;\n  color: #fff;\n}\n\n.first-tier .nav > li > a:focus,\n.first-tier .nav>li>a:hover {\n  background-color: #136fbf;\n  color: #fff;\n}\n\n.first-tier .site-logo img {\n  vertical-align: middle;\n}\n\n.first-tier h1 {\n  display: inline;\n  font-size: 25px;\n}\n\n.second-tier {\n  margin-bottom: 0px;\n  background-color: #05466c;\n}\n\n.site-header .navbar-header img {\n  vertical-align: middle;\n  height: 50px;\n  padding: 5px;\n}\n\n@media (max-width: 768px) {\n  .first-tier {\n    height: 100px;\n  }\n}\n\n@media (max-width: 498px) {\n  .navbar-brand {\n    padding: 0px;\n  }\n}\n\n.navbar-inverse .navbar-toggle {\n  border-color: #ffffff;\n}\n\n.navbar-inverse .navbar-toggle:hover {\n  background-color: transparent;\n}\n\n.navbar-inverse .navbar-toggle .icon-bar {\n  background-color: #ffffff;\n}\n\n",
      footerSass:
        "\n  .footer-background {\n    padding-top: 20px;\n    padding-bottom: 20px;\n    background-color: #e7e7e7;\n  }\n\n  .logo, .nav {\n    margin-bottom: 10px;\n  }\n\n  .nav-pills {\n      display: flex;\n      flex-wrap: wrap;\n      justify-content: center;\n  }\n",
      faviconUrl: "",
      gacode: "UA-123456-0",
      map: {
        basemaps: {
          primary: {
            id: "42c841849131429489cb340f171682e0",
            title: "Imagery",
            baseMapLayers: [
              {
                id: "World_Imagery_2017",
                layerType: "ArcGISTiledMapServiceLayer",
                url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
                visibility: true,
                opacity: 1,
                title: "World Imagery",
              },
            ],
            operationalLayers: [],
          },
        },
      },
      capabilities: [
        "api_explorer",
        "pages",
        "my_data",
        "social_logins",
        "json_chart_card",
        "document_iframes",
        "items_view",
        "app_page",
        "globalNav",
        "socialSharing",
        "disableDiscussions",
      ],
    },
  },
};
