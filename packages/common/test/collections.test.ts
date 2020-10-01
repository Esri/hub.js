import { collectionsMap } from "../src/index";

describe("collectionsMap", () => {
  it("it should contain app categories", () => {
    const application = "application";
    const dashboard = "dashboard";
    const storyMap = "storymap";
    const webExperience = "web experience";
    expect(collectionsMap).toBeDefined();
    expect(collectionsMap[application]).toEqual(application);
    expect(collectionsMap[dashboard]).toEqual(dashboard);
    expect(collectionsMap[storyMap]).toEqual(storyMap);
    expect(collectionsMap[webExperience]).toEqual(webExperience);
  });

  it("it should contain dataset categories", () => {
    const csvCollection = "csv collection";
    const csv = "csv";
    const streamService = "stream service";
    const table = "table";
    expect(collectionsMap).toBeDefined();
    expect(collectionsMap[csvCollection]).toEqual(csvCollection);
    expect(collectionsMap[csv]).toEqual(csv);
    expect(collectionsMap[streamService]).toEqual(streamService);
    expect(collectionsMap[table]).toEqual(table);
  });

  it("it should contain document categories", () => {
    const cadDrawing = "cad drawing";
    const documentLink = "document link";
    const proMap = "pro map";
    const reportTemplate = "report template";
    expect(collectionsMap).toBeDefined();
    expect(collectionsMap[cadDrawing]).toEqual(cadDrawing);
    expect(collectionsMap[documentLink]).toEqual(documentLink);
    expect(collectionsMap[proMap]).toEqual(proMap);
    expect(collectionsMap[reportTemplate]).toEqual(reportTemplate);
  });

  it("it should contain event, feedback, initiative and template categories", () => {
    const hubEvent = "hub event";
    const form = "form";
    const hubInitiative = "hub initiative";
    const hubInitiativeTemplate = "hub initiative template";
    const hubSolutionTemplate = "hub solution template";
    expect(collectionsMap).toBeDefined();
    expect(collectionsMap[hubEvent]).toEqual(hubEvent);
    expect(collectionsMap[form]).toEqual(form);
    expect(collectionsMap[hubInitiative]).toEqual(hubInitiative);
    expect(collectionsMap[hubInitiativeTemplate]).toEqual(
      hubInitiativeTemplate
    );
    expect(collectionsMap[hubSolutionTemplate]).toEqual(hubSolutionTemplate);
  });

  it("it should contain map categories", () => {
    const cityEngineOne = "city engine web scene";
    const cityEngineTwo = "cityengine web scene";
    const wfs = "wfs";
    const wms = "wms";
    expect(collectionsMap).toBeDefined();
    expect(collectionsMap[cityEngineOne]).toEqual(cityEngineOne);
    expect(collectionsMap[cityEngineTwo]).toEqual(cityEngineTwo);
    expect(collectionsMap[wfs]).toEqual(wfs);
    expect(collectionsMap[wms]).toEqual(wms);
  });

  it("it should contain other categories", () => {
    const vrExperience = "360 vr experience";
    const appBuilderWidget = "appbuilder widget package";
    const vectorTile = "vector tile package";
    const workflow = "workflow manager package";
    expect(collectionsMap).toBeDefined();
    expect(collectionsMap[vrExperience]).toEqual(vrExperience);
    expect(collectionsMap[appBuilderWidget]).toEqual(appBuilderWidget);
    expect(collectionsMap[vectorTile]).toEqual(vectorTile);
    expect(collectionsMap[workflow]).toEqual(workflow);
  });

  it("it should contain site categories", () => {
    const hubSiteApplication = "hub site application";
    const siteApplication = "site application";

    expect(collectionsMap).toBeDefined();
    expect(collectionsMap[hubSiteApplication]).toEqual(hubSiteApplication);
    expect(collectionsMap[siteApplication]).toEqual(siteApplication);
  });

  it("it should not contain bad categories or capitalized categories", () => {
    const hubSiteApplication = "Hub site application";
    const badCategory = "BAD CATEGORY";

    expect(collectionsMap).toBeDefined();
    expect(collectionsMap[hubSiteApplication]).toBeUndefined();
    expect(collectionsMap[badCategory]).toBeUndefined();
  });
});
