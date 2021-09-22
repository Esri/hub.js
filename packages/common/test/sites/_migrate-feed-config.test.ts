import { IModel } from "../../src";
import { _migrateFeedConfig } from "../../src/sites/_migrate-feed-config";

describe("_migrateFeedConfig", () => {
  it("Removes the existing config object for dcat-us 1.1 from the site", () => {
    const siteModel = {
      data: {
        values: {
          dcatConfig: {
            title: "custom value",
          },
        },
      },
    } as unknown as IModel;

    const result = _migrateFeedConfig(siteModel);
    expect(result.data.values.dcatConfig).toBeFalsy(
      "site.data.values.dcatConfig should not be present"
    );
  });

  it("Adds an empty feeds config hash when the site does not have an existing config for dcat-us 1.1", () => {
    const siteModel = { data: { values: {} } } as unknown as IModel;
    const result = _migrateFeedConfig(siteModel);
    expect(result.data.feeds).toBeTruthy("site.data.feeds should be present");
  });

  it("Adds an entry for dcat-us 1.1 in the feeds config hash when an existing config is present", () => {
    const siteModel = {
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

  it("correctly migrates from index default values to v3 api default values", () => {
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

  it("correctly migrates from custom index values to v3 api values", () => {
    const indexValues: any = {
      publisher: {
        source: "{{default.source.source}}",
        name: "{{org.name}}",
      },
      theme: "{{item.categories}}",
      license: "{{item.licenseInfo}}",
      contactPoint: {
        fn: "{{default.source.source}}",
        hasEmail:
          "{{metadata.metadata.mdContact.rpCntInfo.cntAddress.eMailAdd}}",
      },
      modified: "{{item.modified}}",
      "customField{1}": {
        name: "{{metadata.metadata.dqInfo.dqScope.scpLvl.ScopeCd.@_value}}",
      },
      relation: {
        exists: "{{metadata:optional:1}}", // TODO: Is this an actual value that we need to correct?
      },
      category: "{{enrichments.categories}}",
      itemid: "{{default.id}}",
    };

    const v3ApiValues: any = {
      publisher: {
        source: "{{source}}",
        name: "{{orgName}}",
      },
      theme: "{{categories}}",
      license: "{{licenseInfo}}",
      contactPoint: {
        fn: "{{source}}",
        hasEmail:
          "{{metadata.metadata.mdContact.rpCntInfo.cntAddress.eMailAdd}}",
      },
      modified: "{{modified}}",
      "customField{1}": {
        name: "{{metadata.metadata.dqInfo.dqScope.scpLvl.ScopeCd.@_value}}",
      },
      relation: {
        exists: "{{metadata}}",
      },
      category: "{{categories}}",
      itemid: "{{id}}",
    };

    const siteModel = {
      data: {
        values: {
          dcatConfig: indexValues,
        },
      },
    } as unknown as IModel;

    const result = _migrateFeedConfig(siteModel);
    expect(result.data.feeds.dcatUS11).toEqual(
      v3ApiValues,
      "site.data.feeds.dcatUS11 should not contain index custom values"
    );
  });
});
