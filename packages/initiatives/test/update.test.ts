/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

// Import * as so we can mock the calls
import * as ModelSpy from "../src/model";
import { IModel, cloneObject } from "@esri/hub-common";
import { updateInitiative } from "../src/update";
import { MOCK_REQUEST_OPTIONS } from "./mocks/fake-session";
import { IInitiativeModel } from "@esri/hub-common";

describe("Update Initiative ::", () => {
  it("should just update the item", done => {
    const m = {
      item: {
        id: "bc7",
        title: "Fake Initiative",
        owner: "vader",
        type: "Hub Initiative",
        url: "http://some.url.com",
        tags: ["test webmap"]
      },
      data: {
        some: {
          content: "nested deep"
        }
      }
    } as IInitiativeModel;

    const updateSpy = spyOn(ModelSpy, "updateModel").and.callFake(
      (model: IModel) => {
        return Promise.resolve(cloneObject(model));
      }
    );

    updateInitiative(m, MOCK_REQUEST_OPTIONS)
      .then(result => {
        expect(result).not.toBe(m, "should return a clone");
        expect(updateSpy.calls.count()).toEqual(
          1,
          "should make one call to model::updateModel"
        );
        done();
      })
      .catch(() => fail());
  });
});
