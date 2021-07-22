import { createSiteModelFromTemplate } from "../src";
import * as teamsModule from "@esri/hub-teams";
import * as commonModule from "@esri/hub-common";
import * as createSiteModule from "../src/_create-site-initiative";
import * as updateTagsModule from "../src/_update-team-tags";
import * as getPortalSiteHostnameModule from "../src/get-portal-site-hostname";
import {
  MOCK_HUB_REQOPTS,
  expectAllCalled,
  MOCK_PORTAL_REQOPTS,
  expectAll,
} from "./test-helpers.test";
import { cloneObject } from "@esri/hub-common";

const siteTemplate = {
  type: "Hub Site Application",
  item: {
    title: "{{solution.title}}",
    snippet: "{{solution.snippet}}",
    description: "{{solution.snippet}}",
    extent: "{{organization.defaultExtentBBox}}",
    type: "Hub Site Application",
    typeKeywords: [
      "Hub",
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
    tags: ["Hub Site"],
    culture: "{{user.culture}}",
    properties: {
      createdFrom: "basicDefaultSite Solution Template (embedded)",
      schemaVersion: 1.2,
      hasSeenGlobalNav: true,
    },
    owner: "{{user.username}}",
    url: "{{solution.url}}",
  },
  data: {
    catalog: {
      groups: [],
    },
    values: {
      title: "{{solution.name}}",
      defaultHostname: "{{solution.defaultHostname}}",
      subdomain: "{{solution.subdomain}}",
      externalUrl: null,
      public: false,
      faviconUrl: "",
      uiVersion: "2.2",
      map: {
        basemaps: {
          primary: "{{organization.defaultBasemap:optional:1}}",
        },
      },
      pages: [],
      layout: {},
      theme: "{{solution.theme}}",
      headerCss:
        ".first-tier {\n  height: 80px;\n  margin-bottom: 0px;\n  background-color: #005e95;\n}\n\n.first-tier .nav > li > a {\n  margin-top: 5px;\n  padding: 3px 6px;\n  color: #fff;\n}\n\n.first-tier .nav > li > a:focus,\n.first-tier .nav>li>a:hover {\n  background-color: #136fbf;\n  color: #fff;\n}\n\n.first-tier .site-logo img {\n  vertical-align: middle;\n}\n\n.first-tier h1 {\n  display: inline;\n  font-size: 25px;\n}\n\n.second-tier {\n  margin-bottom: 0px;\n  background-color: #05466c;\n}\n\n.site-header .navbar-header img {\n  vertical-align: middle;\n  height: 50px;\n  padding: 5px;\n}\n\n@media (max-width: 768px) {\n  .first-tier {\n    height: 100px;\n  }\n}\n\n@media (max-width: 498px) {\n  .navbar-brand {\n    padding: 0px;\n  }\n}\n\n.navbar-inverse .navbar-toggle {\n  border-color: #ffffff;\n}\n\n.navbar-inverse .navbar-toggle:hover {\n  background-color: transparent;\n}\n\n.navbar-inverse .navbar-toggle .icon-bar {\n  background-color: #ffffff;\n}\n\n",
      footerCss:
        "\n  .footer-background {\n    padding-top: 20px;\n    padding-bottom: 20px;\n    background-color: #e7e7e7;\n  }\n\n  .logo, .nav {\n    margin-bottom: 10px;\n  }\n\n  .nav-pills {\n      display: flex;\n      justify-content: center;\n  }\n",
    },
  },
  properties: {
    initiativeTemplate: {
      item: {
        title: "{{solution.title}}",
        snippet: "{{solution.snippet}}",
        description: "{{solution.snippet}}",
        type: "Hub Initiative Template",
        typeKeywords: ["Hub", "hubInitiative"],
        tags: [],
        extent: "{{organization.defaultExtentBBox}}",
        culture: "{{user.culture}}",
        properties: {},
        url: "",
      },
      data: {
        assets: [],
        indicators: [],
        recommendedTemplates: [],
      },
      assets: [],
    },
  },
  assets: [],
  itemId: "123",
  key: "foobar",
} as commonModule.IModelTemplate;

const settings = {
  solution: {
    title: "site-title",
    snippet: "site-snippet",
    name: "solution-name",
  },
  organization: {
    defaultExtentBBox: [
      [67, 32],
      [1, 2],
    ],
  },
  user: {
    username: "tate",
    culture: "no",
  },
};

describe("createSiteModelFromTemplate", () => {
  const teams = {
    props: {
      contentGroupId: "123",
      collaborationGroupId: "456",
    },
  };

  const uniqueDomain = "unique-domain";

  const initiativeResponse = {
    item: {
      id: "initiative-parent",
    },
  };

  let getProductSpy: jasmine.Spy;
  let createTeamsSpy: jasmine.Spy;
  let ensureDomainSpy: jasmine.Spy;
  let createInitiativeSpy: jasmine.Spy;
  let updateTeamTagsSpy: jasmine.Spy;
  beforeEach(() => {
    getProductSpy = spyOn(commonModule, "getHubProduct").and.returnValue(
      "premium"
    );

    createTeamsSpy = spyOn(teamsModule, "createHubTeams").and.returnValue(
      Promise.resolve(commonModule.cloneObject(teams))
    );

    ensureDomainSpy = spyOn(
      commonModule,
      "ensureUniqueDomainName"
    ).and.returnValue(Promise.resolve(uniqueDomain));

    createInitiativeSpy = spyOn(
      createSiteModule,
      "_createSiteInitiative"
    ).and.returnValue(Promise.resolve(initiativeResponse));

    updateTeamTagsSpy = spyOn(
      updateTagsModule,
      "_updateTeamTags"
    ).and.returnValue(Promise.resolve());
  });

  it("creates the site on premium", async () => {
    getProductSpy.and.returnValue("premium");

    const createdSite = await createSiteModelFromTemplate(
      commonModule.cloneObject(siteTemplate),
      settings,
      {},
      MOCK_HUB_REQOPTS
    );

    // Verify interpolation
    expect(createdSite.item.title).toBe(settings.solution.title);
    expect(createdSite.item.snippet).toBe(settings.solution.snippet);
    expect(createdSite.item.description).toBe(settings.solution.snippet);
    expect(createdSite.item.culture).toBe(settings.user.culture);
    expect(createdSite.item.owner).toBe(settings.user.username);
    expect(createdSite.item.extent).toEqual(
      settings.organization.defaultExtentBBox
    );
    expect(createdSite.data.values.title).toBe(settings.solution.name);

    expect(createdSite.item.url).toBe(
      "https://unique-domain-org.hubqa.arcgis.com"
    );
    expect(createdSite.data.values.defaultHostname).toBe(
      "unique-domain-org.hubqa.arcgis.com"
    );
    expect(createdSite.data.values.subdomain).toBe(`unique-domain`);

    expectAllCalled(
      [createTeamsSpy, ensureDomainSpy, createInitiativeSpy, updateTeamTagsSpy],
      expect
    );

    expect(createdSite.item.properties.contentGroupId).toBe(
      teams.props.contentGroupId
    );
    expect(createdSite.item.properties.collaborationGroupId).toBe(
      teams.props.collaborationGroupId
    );
    expect(createdSite.data.catalog.groups).toEqual([
      teams.props.contentGroupId,
    ]);
  });

  it("creates the site on basic", async () => {
    getProductSpy.and.returnValue("basic");

    const createdSite = await createSiteModelFromTemplate(
      commonModule.cloneObject(siteTemplate),
      settings,
      {},
      MOCK_HUB_REQOPTS
    );

    // Verify interpolation
    expect(createdSite.item.title).toBe(settings.solution.title);
    expect(createdSite.item.snippet).toBe(settings.solution.snippet);
    expect(createdSite.item.description).toBe(settings.solution.snippet);
    expect(createdSite.item.culture).toBe(settings.user.culture);
    expect(createdSite.item.owner).toBe(settings.user.username);
    expect(createdSite.item.extent).toEqual(
      settings.organization.defaultExtentBBox
    );
    expect(createdSite.data.values.title).toBe(settings.solution.name);

    expect(createdSite.item.url).toBe(
      "https://unique-domain-org.hubqa.arcgis.com"
    );
    expect(createdSite.data.values.defaultHostname).toBe(
      "unique-domain-org.hubqa.arcgis.com"
    );
    expect(createdSite.data.values.subdomain).toBe(`unique-domain`);

    expectAllCalled(
      [createTeamsSpy, ensureDomainSpy, createInitiativeSpy, updateTeamTagsSpy],
      expect
    );

    expect(createdSite.item.properties.contentGroupId).toBe(
      teams.props.contentGroupId
    );
    expect(createdSite.item.properties.collaborationGroupId).toBe(
      teams.props.collaborationGroupId
    );
    expect(createdSite.data.catalog.groups).toEqual([
      teams.props.contentGroupId,
    ]);
  });

  it("creates the site on portal", async () => {
    getProductSpy.and.returnValue("portal");

    const portalSiteHostname = "foobar-portal-baz.com";
    spyOn(getPortalSiteHostnameModule, "getPortalSiteHostname").and.returnValue(
      portalSiteHostname
    );

    const createdSite = await createSiteModelFromTemplate(
      commonModule.cloneObject(siteTemplate),
      settings,
      {},
      MOCK_PORTAL_REQOPTS
    );

    // Verify interpolation
    expect(createdSite.item.title).toBe(settings.solution.title);
    expect(createdSite.item.snippet).toBe(settings.solution.snippet);
    expect(createdSite.item.description).toBe(settings.solution.snippet);
    expect(createdSite.item.culture).toBe(settings.user.culture);
    expect(createdSite.item.owner).toBe(settings.user.username);
    expect(createdSite.item.extent).toEqual(
      settings.organization.defaultExtentBBox
    );
    expect(createdSite.data.values.title).toBe(settings.solution.name);

    expect(createdSite.item.url).toBe("http://foobar-portal-baz.com");
    expect(createdSite.data.values.defaultHostname).toBe(portalSiteHostname);
    expect(createdSite.data.values.subdomain).toBe(`unique-domain`);

    expectAllCalled([createTeamsSpy, ensureDomainSpy], expect);
    // create initiative stuff shouldnt be called on portal
    expectAll(
      [createInitiativeSpy, updateTeamTagsSpy],
      "toHaveBeenCalled",
      false,
      expect
    );

    expect(createdSite.item.properties.contentGroupId).toBe(
      teams.props.contentGroupId
    );
    expect(createdSite.item.properties.collaborationGroupId).toBe(
      teams.props.collaborationGroupId
    );
    expect(createdSite.data.catalog.groups).toEqual([
      teams.props.contentGroupId,
    ]);
  });

  it("doesnt add contentGroupId to data.catalog.groups if not present", async () => {
    createTeamsSpy.and.returnValue(
      Promise.resolve({
        props: {
          collaborationGroupId: "collab-group",
          // no contentGroupId
        },
      })
    );

    const created = await createSiteModelFromTemplate(
      commonModule.cloneObject(siteTemplate),
      settings,
      {},
      MOCK_HUB_REQOPTS
    );
    expect(created.data.catalog.groups).toEqual([]);
  });

  it("defaults team titles if no solution title", async () => {
    const localSettings = commonModule.cloneObject(settings);
    delete localSettings.solution.title;

    await createSiteModelFromTemplate(
      commonModule.cloneObject(siteTemplate),
      localSettings,
      {},
      MOCK_HUB_REQOPTS
    );
    expect(createTeamsSpy.calls.argsFor(0)[0].title).toBe("New Site");
  });

  it("preserves dcatConfig template", async () => {
    const localTmpl = commonModule.cloneObject(siteTemplate);
    localTmpl.data.values.dcatConfig = { foo: "{{bar}}" };
    const createdSite = await createSiteModelFromTemplate(
      localTmpl,
      settings,
      {},
      MOCK_HUB_REQOPTS
    );
    expect(createdSite.data.values.dcatConfig).toEqual({ foo: "{{bar}}" });
  });

  it("adds properties if not present", async () => {
    const localTmpl = commonModule.cloneObject(siteTemplate);
    delete localTmpl.item.properties;
    const createdSite = await createSiteModelFromTemplate(
      localTmpl,
      settings,
      {},
      MOCK_HUB_REQOPTS
    );
    expect(createdSite.item.properties).toEqual(jasmine.any(Object));
  });

  it("rejects if something blows up", async () => {
    createTeamsSpy.and.returnValue(Promise.reject());

    try {
      await createSiteModelFromTemplate(
        commonModule.cloneObject(siteTemplate),
        settings,
        {},
        MOCK_HUB_REQOPTS
      );
      fail("should reject");
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it("allows unicode in site title, but does not use in domain", async () => {
    getProductSpy.and.returnValue("basic");
    const unicodeSettings = cloneObject(settings);
    unicodeSettings.solution.title = "テスト";
    const createdSite = await createSiteModelFromTemplate(
      commonModule.cloneObject(siteTemplate),
      unicodeSettings,
      {},
      MOCK_HUB_REQOPTS
    );

    // Verify interpolation
    expect(createdSite.item.title).toBe(unicodeSettings.solution.title);
    expect(createdSite.data.values.title).toBe(unicodeSettings.solution.name);

    const passedDomain = ensureDomainSpy.calls.argsFor(0)[0];
    expect(passedDomain).toBe(
      "site",
      "when unicode chars present, pass site as domain name"
    );
  });
  it("handles numeric site title", async () => {
    getProductSpy.and.returnValue("basic");
    const numericTitleSettings = {
      solution: {
        title: 8888, // <-
        snippet: "site-snippet",
        name: "solution-name",
      },
      organization: {
        defaultExtentBBox: [
          [67, 32],
          [1, 2],
        ],
      },
      user: {
        username: "tate",
        culture: "no",
      },
    };
    const createdSite = await createSiteModelFromTemplate(
      commonModule.cloneObject(siteTemplate),
      numericTitleSettings,
      {},
      MOCK_HUB_REQOPTS
    );

    // Verify interpolation
    expect(createdSite.item.title).toBe(
      String(numericTitleSettings.solution.title)
    );
    // ensure the deepSet does not bork things up
    expect(numericTitleSettings.solution.snippet).toBe("site-snippet");
    expect(createdSite.data.values.title).toBe(
      String(numericTitleSettings.solution.title)
    );

    const passedDomain = ensureDomainSpy.calls.argsFor(0)[0];
    expect(passedDomain).toBe("8888", "domain should be string using title");
  });
});
