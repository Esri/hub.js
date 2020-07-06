/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

// Import * as so we can spy on the calls
import * as ModelSpy from "../src/model";
import { IModel, cloneObject } from "@esri/hub-common";
import { addInitiative, getInitiativeUrl } from "../src/add";
import { IInitiativeModel } from "@esri/hub-common";
import { MOCK_REQUEST_OPTIONS } from "./mocks/fake-session";
import { IRequestOptions } from "@esri/arcgis-rest-request";

const newInitiative = ({
  item: {
    title: "Fake Initiative",
    owner: "vader",
    type: "Hub Initiative",
    tags: ["test webmap"],
    url: "https://some-site.com"
  },
  data: {
    some: {
      content: "nested deep"
    }
  }
} as any) as IInitiativeModel;

describe("Add Initiative ::", () => {
  it("should add the url and update", done => {
    const saveSpy = spyOn(ModelSpy, "saveModel").and.callFake(
      (model: IModel) => {
        const clone = cloneObject(model);
        clone.item.id = "from-spy";
        return Promise.resolve(clone);
      }
    );

    const updateSpy = spyOn(ModelSpy, "updateModel").and.callFake(
      (model: IModel) => {
        return Promise.resolve(cloneObject(model));
      }
    );

    addInitiative(newInitiative, MOCK_REQUEST_OPTIONS)
      .then(result => {
        expect(result).not.toBe(newInitiative, "should return a clone");
        expect(result.item.id).toBe(
          "from-spy",
          "should have the id from the spy result"
        );
        expect(result.item.url).toContain(`some-site.com`);
        expect(saveSpy.calls.count()).toEqual(
          1,
          "should make one call to model::saveModel"
        );
        expect(updateSpy.calls.count()).toEqual(
          0,
          "should make not call to model::updateModel"
        );
        done();
      })
      .catch(() => fail());
  });

  it("should return Initiative Url without requestOptions", () => {
    expect(getInitiativeUrl("b463")).toEqual(
      "https://hub.arcgis.com/admin/initiatives/b463",
      "should point to AGO"
    );
  });

  it("should return Initiative Url using requestOptions.authentication.portal", () => {
    const ro = {
      authentication: {
        portal: "http://some-org.mapsqaext.arcgis.com"
      }
    } as IRequestOptions;
    expect(getInitiativeUrl("b463", ro)).toEqual(
      "https://hubqa.arcgis.com/admin/initiatives/b463",
      "should route into admin on qa"
    );
  });
});
