import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";
import { HubSite } from "../src/sites/HubSite";
import { IDeepCatalogInfo, IHubCatalog } from "../src/search";
import { ArcGISContextManager, IArcGISContext } from "../src";

// Fixtures - shared with deep-contains.e2e.ts
//
// Site: c84347eb5d0a4a7b84c334fe84a5bbfe
// - Catalog Group: b29562e1236f4743bc08d2444497b008
//   - Content
//     - Initiative: 270b4696648e4e4a8767a1dc9753ae34
//     - Unique Web App: 7da7ea6055d34afd9125a2ccd63be5e1
//     - Common Web App: 63c765456d23439e8faf0e4172fc9b23
// Initiative: 270b4696648e4e4a8767a1dc9753ae34
// - Catalog Group: 1d568e44a1b043529f67122340a33890#overview
//   - Content:
//     - Project: 9c0ecf87bcc04a1d93dec04b54332458
//     - Unique Web App: c4597275ee874820bf578cdee3106e2f
//     - Common Web App: 63c765456d23439e8faf0e4172fc9b23
// Project: 9c0ecf87bcc04a1d93dec04b54332458
// - Catalog Group: 5d92405aaa2b414d8632a469f9983be8
//   - Content
//     - Unique Web App: a88285b001574cf3bfc91c4da11391cf
//     - Common Web App: 63c765456d23439e8faf0e4172fc9b23

describe("HubSite.contains:", () => {
  const siteItemId: string = "c84347eb5d0a4a7b84c334fe84a5bbfe";
  const siteAppItemId: string = "7da7ea6055d34afd9125a2ccd63be5e1";
  const projectItemId: string = "9c0ecf87bcc04a1d93dec04b54332458";
  const projectAppItemId: string = "a88285b001574cf3bfc91c4da11391cf";
  const initiativeItemId: string = "270b4696648e4e4a8767a1dc9753ae34";
  const initiativeAppItemId: string = "c4597275ee874820bf578cdee3106e2f";
  const commonAppItemId: string = "63c765456d23439e8faf0e4172fc9b23";

  let factory: Artifactory;
  const orgName = "hubBasic";
  let siteInstance: HubSite;
  let context: IArcGISContext;
  beforeAll(async () => {
    factory = new Artifactory(config);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
    const ctxMgr = await factory.getContextManager(orgName, "admin");
    context = ctxMgr.context;
  });

  beforeEach(async () => {
    // re-create site for each test so we can verify the caching works
    siteInstance = await HubSite.fetch(siteItemId, context);
  });

  describe(" passing only id:", () => {
    it("finds app in site catalog", async () => {
      const chk = await siteInstance.contains(siteAppItemId);
      expect(chk.isContained).toBeTruthy();
      // tslint:disable-next-line:no-console
      console.info(
        `HubSite.contains: App in Site Catalog: Time: ${chk.duration} ms`
      );

      const chk2 = await siteInstance.contains(commonAppItemId);
      expect(chk2.isContained).toBeTruthy();
      // tslint:disable-next-line:no-console
      console.info(
        `HubSite.contains: App in Site Catalog (cached): Time: ${chk2.duration} ms`
      );
      const chk3 = await siteInstance.contains(projectAppItemId);
      expect(chk3.isContained).toBeFalsy();
      // tslint:disable-next-line:no-console
      console.info(
        `HubSite.contains: App not in Site Catalog (cached): Time: ${chk3.duration} ms`
      );
    });

    it("finds app in initiative catalog", async () => {
      const initiativeCatalogInfo: IDeepCatalogInfo = {
        id: initiativeItemId,
        entityType: "item",
      };

      const chk = await siteInstance.contains(initiativeAppItemId, [
        initiativeCatalogInfo,
      ]);

      expect(chk.isContained).toBeTruthy();
      // tslint:disable-next-line:no-console
      console.info(
        `HubSite.contains: App in Initiative Catalog: Time: ${chk.duration} ms`
      );
    });

    it("finds app in project catalog", async () => {
      const initiativeCatalogInfo: IDeepCatalogInfo = {
        id: initiativeItemId,
        entityType: "item",
      };
      const projectCatalogInfo: IDeepCatalogInfo = {
        id: projectItemId,
        entityType: "item",
      };

      const chk = await siteInstance.contains(
        projectAppItemId,

        [projectCatalogInfo, initiativeCatalogInfo]
      );

      expect(chk.isContained).toBeTruthy();
      // tslint:disable-next-line:no-console
      console.info(
        `HubSite.contains: App in Project Catalog: Time: ${chk.duration} ms`
      );
    });
  });
  describe("pass in catalogs", () => {
    it("find app in initiative catalog", async () => {
      const initiativeCatalogInfo: IDeepCatalogInfo = {
        id: initiativeItemId,
        entityType: "item",
        catalog: createCatalog("1d568e44a1b043529f67122340a33890"),
      };

      const chk = await siteInstance.contains(initiativeAppItemId, [
        initiativeCatalogInfo,
      ]);

      expect(chk.isContained).toBeTruthy();
      // tslint:disable-next-line:no-console
      console.info(
        `HubSite.contains: App in Initiative Catalog (passed in): Time: ${chk.duration} ms`
      );
    });
    it("find app in project catalog", async () => {
      const initiativeCatalogInfo: IDeepCatalogInfo = {
        id: initiativeItemId,
        entityType: "item",
        catalog: createCatalog("1d568e44a1b043529f67122340a33890"),
      };
      const projectCatalogInfo: IDeepCatalogInfo = {
        id: projectItemId,
        entityType: "item",
        catalog: createCatalog("5d92405aaa2b414d8632a469f9983be8"),
      };

      const chk = await siteInstance.contains(
        initiativeAppItemId,

        [projectCatalogInfo, initiativeCatalogInfo]
      );

      expect(chk.isContained).toBeTruthy();
      // tslint:disable-next-line:no-console
      console.info(
        `HubSite.contains: App in Project Catalog (passed in): Time: ${chk.duration} ms`
      );
    });
  });
});

function createCatalog(groupId: string): IHubCatalog {
  return {
    schemaVersion: 1,
    title: "Default Catalog",
    scopes: {
      item: {
        targetEntity: "item",
        filters: [
          {
            predicates: [
              {
                group: [groupId],
              },
            ],
          },
        ],
      },
    },
    collections: [],
  };
}
