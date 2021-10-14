/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IModel, IHubRequestOptions } from "@esri/hub-common";
import * as hubSurveys from "@esri/hub-surveys";
import { _getSharingEligibleModels } from "../src/_get-sharing-eligible-models";
import { getSurveyModels } from "@esri/hub-surveys";

describe("_getSharingEligibleModels", function () {
  let models: IModel[];
  let siteModel: IModel;
  let hubRequestOptions: IHubRequestOptions;

  beforeEach(() => {
    siteModel = { item: { id: "site-id" } } as IModel;

    models = [
      siteModel,
      { item: { id: "123", type: "Web Map" } },
      { item: { id: "456", type: "Form" } },
      { item: { id: "789", type: "Feature Service" } },
      { item: { id: "101", type: "Feature Service" } },
      { item: { id: "121", type: "Feature Service" } },
    ] as IModel[];

    hubRequestOptions = { authentication: {} } as IHubRequestOptions;
  });

  it("resolves an array of sharing eligible models", async function () {
    const getSurveyModelsSpy = spyOn(
      hubSurveys,
      "getSurveyModels"
    ).and.returnValue(
      Promise.resolve({
        form: models[2],
        featureService: models[3],
        fieldworker: models[4],
        stakeholder: models[5],
      })
    );
    const results = await _getSharingEligibleModels(
      siteModel,
      models,
      hubRequestOptions
    );
    expect(getSurveyModelsSpy.calls.count()).toBe(1);
    expect(getSurveyModelsSpy).toHaveBeenCalledWith(
      models[2].item,
      hubRequestOptions
    );
    expect(results.length).toBe(1);
    expect(results[0]).toEqual(models[1]);
  });
});
