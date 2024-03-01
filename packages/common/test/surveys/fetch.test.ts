// import * as portalModule from "@esri/arcgis-rest-portal";
// import { MOCK_AUTH } from "../mocks/mock-auth";
// import * as slugUtils from "../../src/items/slugs";
// import { IHubRequestOptions } from "../../src/types";
// import { fetchSurvey } from "../../src/surveys/fetch";
// import { IHubSurvey } from "../../src/core/types/IHubSurvey";

// const GUID = "9b77674e43cf4bbd9ecad5189b3f1fdc";
// const SURVEY_ITEM: portalModule.IItem = {
//   id: GUID,
//   title: "Fake Survey",
//   description: "fake description",
//   snippet: "fake snippet",
//   properties: {
//     schemaVersion: 1,
//   },
//   owner: "vader",
//   type: "Form",
//   created: 1643646881000,
//   modified: 1643646881000,
//   tags: [],
//   typeKeywords: [],
//   thumbnail: "vader.png",
//   numViews: 10,
//   size: 0,
// } as portalModule.IItem;

// xdescribe("survey fetch:", () => {
//   describe("fetchSurvey:", () => {
//     it("gets by id, if passed a guid", async () => {
//       const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
//         Promise.resolve(SURVEY_ITEM)
//       );

//       const chk = await fetchSurvey(GUID, {
//         authentication: MOCK_AUTH,
//       });
//       expect(chk.id).toBe(GUID);
//       expect(chk.owner).toBe("vader");
//       expect(getItemSpy.calls.count()).toBe(1);
//       expect(getItemSpy.calls.argsFor(0)[0]).toBe(GUID);
//     });

//     it("supports not having data", async () => {
//       const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
//         Promise.resolve(SURVEY_ITEM)
//       );

//       const chk = await fetchSurvey(GUID, {
//         authentication: MOCK_AUTH,
//       });
//       expect(chk.id).toBe(GUID);
//       expect(chk.owner).toBe("vader");
//       expect(getItemSpy.calls.count()).toBe(1);
//       expect(getItemSpy.calls.argsFor(0)[0]).toBe(GUID);
//     });

//     it("gets without auth", async () => {
//       const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
//         Promise.resolve(SURVEY_ITEM)
//       );

//       const ro: IHubRequestOptions = {
//         portal: "https://gis.myserver.com/portal/sharing/rest",
//       };
//       const chk = await fetchSurvey(GUID, ro);
//       expect(chk.id).toBe(GUID);
//       expect(chk.owner).toBe("vader");
//       expect(chk.thumbnailUrl).toBe(
//         "https://gis.myserver.com/portal/sharing/rest/content/items/9b77674e43cf4bbd9ecad5189b3f1fdc/info/vader.png"
//       );
//       expect(getItemSpy.calls.count()).toBe(1);
//       expect(getItemSpy.calls.argsFor(0)[0]).toBe(GUID);
//     });

//     it("gets by slug if not passed guid", async () => {
//       const getItemBySlugSpy = spyOn(
//         slugUtils,
//         "getItemBySlug"
//       ).and.returnValue(Promise.resolve(SURVEY_ITEM));

//       const chk = await fetchSurvey("dcdev-34th-street", {
//         authentication: MOCK_AUTH,
//       });
//       expect(getItemBySlugSpy.calls.count()).toBe(1);
//       expect(getItemBySlugSpy.calls.argsFor(0)[0]).toBe("dcdev-34th-street");
//       expect(chk.id).toBe(GUID);
//       expect(chk.owner).toBe("vader");
//     });

//     it("gets default settings if fetch fails", async () => {
//       const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
//         Promise.resolve(SURVEY_ITEM)
//       );

//       const chk = await fetchSurvey(GUID, {
//         authentication: MOCK_AUTH,
//       });
//       expect(chk.id).toBe(GUID);
//       expect(chk.owner).toBe("vader");
//       expect(getItemSpy.calls.count()).toBe(1);
//       expect(getItemSpy.calls.argsFor(0)[0]).toBe(GUID);
//     });

//     it("returns null if no id found", async () => {
//       const getItemBySlugSpy = spyOn(
//         slugUtils,
//         "getItemBySlug"
//       ).and.returnValue(Promise.resolve(null));

//       const chk = await fetchSurvey("dcdev-34th-street", {
//         authentication: MOCK_AUTH,
//       });
//       expect(getItemBySlugSpy.calls.count()).toBe(1);
//       expect(getItemBySlugSpy.calls.argsFor(0)[0]).toBe("dcdev-34th-street");
//       // This next stuff is O_o but req'd by typescript
//       expect(chk).toEqual(null as unknown as IHubSurvey);
//     });
//   });
// });
