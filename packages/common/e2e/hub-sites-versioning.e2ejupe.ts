import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";
import { HubSite, IHubSite, IModel } from "../src";
import { PropertyMapper } from "../src/core/_internal/PropertyMapper";
import { getPropertyMap } from "../src/sites/_internal/getPropertyMap";
import { ArcGISContextManager, IArcGISContext } from "../src";

describe("HubSite versioning:", () => {
  const siteItemId: string = "2b90df90e70549c1a256ebb6230f7451";

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
    siteInstance = await HubSite.fetch(siteItemId, context);
  });

  // describe(" passing only id:", () => {
  it("finds site", async () => {
    expect(siteInstance).toBeTruthy();
  });

  it("gets versions", async () => {
    const versions = await siteInstance.searchVersions();
    expect(versions.length).toBe(5);

    const jupeMeta = versions.find((v) => v.name === "jupe");
    expect(jupeMeta).toBeTruthy();

    const jupe = await siteInstance.getVersion(jupeMeta.id);
    expect(jupe).toBeTruthy();

    expect(jupe.data.data.values.theme).toBeTruthy();
    expect(jupe.data.data.values.headContent).toBeTruthy();
    expect(jupe.data.data.values.layout).toBeTruthy();
    expect(jupe.data.data.values.layout.sections.length).toBe(11);

    const mapper = new PropertyMapper<Partial<IHubSite>>(getPropertyMap());
    const sitePojo = mapper.objectToModel(siteInstance, {} as IModel);
    expect(sitePojo).toBeTruthy();
    expect(sitePojo.item).toBeTruthy();
    expect(sitePojo.data).toBeTruthy();

    // TODO: it doesn't have any of this stuff and i'm not sure why
    expect(sitePojo.data.values.theme).toBeTruthy();
    expect(sitePojo.data.values.headContent).toBeTruthy();
    expect(sitePojo.data.values.layout).toBeTruthy();

    // const includeList = getIncludeListFromItemType(site);
    // site = applyVersion(sitePojo, jupe, includeList);

    // TODO: create, update, delete versions
  });
});
