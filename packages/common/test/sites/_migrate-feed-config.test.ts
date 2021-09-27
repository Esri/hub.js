import { IModel } from "../../src";
import { _migrateFeedConfig } from "../../src/sites/_migrate-feed-config";

describe("_migrateFeedConfig", () => {
  it("Bumps the item.properties.schemaVersion if schemaVersion is < 1.5", () => {
    const siteModel = {
      item: { properties: { schemaVersion: 1.4 } },
      data: { values: {} },
    } as unknown as IModel;
    const result = _migrateFeedConfig(siteModel);
    expect(result.item.properties.schemaVersion).toEqual(
      1.5,
      "site.item.properties.schemaVersion should be 1.5"
    );
  });

  it("Does not run the migration is schemaVersion is >= 1.5", () => {
    const siteModel = {
      item: {
        properties: {
          schemaVersion: 1.5,
        },
      },
      data: {
        feeds: {
          dcatUS11: {
            title: "{{name}}",
            description: "{{description}}",
            keyword: "{{tags}}",
            issued: "{{created:toISO}}",
            modified: "{{modified:toISO}}",
            publisher: {
              name: "{{source}}",
            },
            contactPoint: {
              fn: "{{owner}}",
              hasEmail: "{{orgContactEmail}}",
            },
          },
        },
        values: {},
      },
    } as unknown as IModel;

    const result = _migrateFeedConfig(siteModel);
    expect(result).toEqual(siteModel, "The site object should be unchanged.");
  });

  it("Adds an empty feeds config hash when the site does not have an existing config for dcat-us 1.1", () => {
    const siteModel = {
      item: { properties: { schemaVersion: 1.4 } },
      data: { values: {} },
    } as unknown as IModel;
    const result = _migrateFeedConfig(siteModel);
    expect(result.data.feeds).toBeTruthy("site.data.feeds should be present");
  });

  it("Adds an entry for dcat-us 1.1 in the feeds config hash when an existing config is present", () => {
    const siteModel = {
      item: {
        properties: {
          schemaVersion: 1.4,
        },
      },
      data: {
        values: {
          dcatConfig: {
            title: "custom value",
          },
        },
      },
    } as unknown as IModel;

    const result = _migrateFeedConfig(siteModel);
    expect(result.data.feeds.dcatUS11).toBeTruthy(
      "existing config should be moved to site.data.feeds.dcatUS11"
    );
  });

  it("Correctly migrates from index default values to v3 api default values", () => {
    const indexDefaults = {
      title: "{{default.name}}",
      description: "{{default.description}}",
      keyword: "{{item.tags}}",
      issued: "{{item.created:toISO}}",
      modified: "{{item.modified:toISO}}",
      publisher: {
        name: "{{default.source.source}}",
      },
      contactPoint: {
        fn: "{{item.owner}}",
        hasEmail: "{{org.portalProperties.links.contactUs.url}}",
      },
    };

    const v3ApiDefaults = {
      title: "{{name}}",
      description: "{{description}}",
      keyword: "{{tags}}",
      issued: "{{created:toISO}}",
      modified: "{{modified:toISO}}",
      publisher: {
        name: "{{source}}",
      },
      contactPoint: {
        fn: "{{owner}}",
        hasEmail: "{{orgContactEmail}}",
      },
    };

    const siteModel = {
      item: {
        properties: {
          schemaVersion: 1.4,
        },
      },
      data: {
        values: {
          dcatConfig: indexDefaults,
        },
      },
    } as unknown as IModel;

    const result = _migrateFeedConfig(siteModel);
    expect(result.data.feeds.dcatUS11).toEqual(
      v3ApiDefaults,
      "site.data.feeds.dcatUS11 should not contain index default values"
    );
  });

  it("Correctly migrates from custom index values to v3 api values", () => {
    const indexValues: any = {
      publisher: {
        source: "{{item.licenseInfo || No License}}",
        name: "{{org.name}}",
      },
      theme: "{{item.categories}}",
      license: "{{item.licenseInfo}}",
      contactPoint: {
        fn: "{{item.licenseInfo}},{{metadata.metadata.dataIdInfo.idPoC.rpOrgName}},{{metadata.metadata.dataIdInfo.idPoC.rpCntInfo.cntAddress.eMailAdd}}",
        hasEmail:
          "{{org.portalProperties.links.contactUs.url || mailto:data@tempe.gov}}",
      },
      modified: "{{item.modified}}",
      "customField{1}": {
        name: "{{metadata.metadata.dqInfo.dqScope.scpLvl.ScopeCd.@_value}}",
      },
      category: "{{enrichments.categories}}",
      itemid: "{{default.id}}",
      description: "{{default.description || No Description}}",
      agol: "{{item.id}}",
    };

    const v3ApiValues: any = {
      publisher: {
        source: "{{licenseInfo || No License}}",
        name: "{{orgName}}",
      },
      theme: "{{categories}}",
      license: "{{licenseInfo}}",
      contactPoint: {
        fn: "{{licenseInfo}},{{metadata.metadata.dataIdInfo.idPoC.rpOrgName}},{{metadata.metadata.dataIdInfo.idPoC.rpCntInfo.cntAddress.eMailAdd}}",
        hasEmail: "{{orgContactEmail || mailto:data@tempe.gov}}",
      },
      modified: "{{modified}}",
      "customField{1}": {
        name: "{{metadata.metadata.dqInfo.dqScope.scpLvl.ScopeCd.@_value}}",
      },
      category: "{{categories}}",
      itemid: "{{id}}",
      description: "{{description || No Description}}",
      agol: "{{id}}",
    };

    const siteModel = {
      item: {
        properties: {
          schemaVersion: 1.4,
        },
      },
      data: {
        values: {
          dcatConfig: indexValues,
        },
      },
    } as unknown as IModel;

    const result = _migrateFeedConfig(siteModel);
    expect(result.data.feeds.dcatUS11).toEqual(
      v3ApiValues,
      "site.data.feeds.dcatUS11 should have all supported custom index values migrated to v3 values"
    );
  });
});
