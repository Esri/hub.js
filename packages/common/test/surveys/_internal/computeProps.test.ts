import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import { computeProps } from "../../../src/surveys/_internal/computeProps";
import { IHubSurvey } from "../../../src/core/types/IHubSurvey";
import { IModel } from "../../../dist/types/types";
import { MAP_SURVEY_TYPEKEYWORD } from "../../../src/surveys/constants";

describe("surveys: computeProps:", () => {
  let model: IModel;
  let survey: Partial<IHubSurvey>;
  let authdCtxMgr: ArcGISContextManager;
  beforeEach(async () => {
    model = {
      id: "3ef",
      name: "Test survey",
      created: 123456789,
      modified: 123456789,
      thumbnail: "survey.jpg",
      item: {
        id: "an id",
        owner: "me",
        tags: [],
        created: 0,
        modified: 0,
        numViews: 0,
        size: 0,
        title: "Test survey",
        type: "Form",
        typeKeywords: [MAP_SURVEY_TYPEKEYWORD],
      },
      formJSON: {
        questions: [
          {
            id: "question",
            type: "esriQuestionTypePolygon",
            defaultMap: "a map",
          },
        ],
      },
    };

    survey = {
      id: "3ef",
      name: "Test survey",
    };
  });

  it("computes the correct props", async () => {
    authdCtxMgr = await ArcGISContextManager.create({
      authentication: MOCK_AUTH,
      currentUser: {
        username: "casey",
        privileges: ["portal:user:updateSurvey"],
      } as unknown as IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
        properties: {
          hub: {
            enabled: true,
          },
        },
      } as unknown as IPortal,
      portalUrl: "https://org.maps.arcgis.com",
    });

    const chk = computeProps(model, survey, authdCtxMgr.context.requestOptions);
    expect(chk.createdDate).toBeDefined();
    expect(chk.createdDateSource).toBe("item.created");
    expect(chk.updatedDate).toBeDefined();
    expect(chk.updatedDateSource).toBe("item.modified");
    expect(chk.isDiscussable).toBeTruthy();
    expect(chk.hasMapQuestion).toBeTruthy();
    expect(chk.displayMap).toBeTruthy();
  });

  it("computes the correct props without authentication", async () => {
    authdCtxMgr = await ArcGISContextManager.create({
      authentication: undefined,
      currentUser: {
        username: "casey",
        privileges: ["portal:user:updateSurvey"],
      } as unknown as IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
        properties: {
          hub: {
            enabled: true,
          },
        },
      } as unknown as IPortal,
      portalUrl: "https://org.maps.arcgis.com",
    });

    const chk = computeProps(model, survey, authdCtxMgr.context.requestOptions);
    expect(chk.createdDate).toBeDefined();
    expect(chk.createdDateSource).toBe("item.created");
    expect(chk.updatedDate).toBeDefined();
    expect(chk.updatedDateSource).toBe("item.modified");
    expect(chk.isDiscussable).toBeTruthy();
    expect(chk.hasMapQuestion).toBeTruthy();
    expect(chk.displayMap).toBeTruthy();
  });
});
