import { mockUserSession as authentication } from "@esri/hub-common/test/test-helpers/fake-user-session";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import {
  shouldDisplayResults,
  migrateFormPropertiesSettings,
} from "../../src/utils/results-availability";
import {
  IFormItem,
  IStakeholderItem,
  IFormItemProperties,
} from "../../src/types";
import * as resultsUtils from "../../src/utils/results-availability/has-user-responded";
import * as FormItemPublished from "../../../common/test/mocks/items/form-item-published.json";
import * as FormItemDraft from "../../../common/test/mocks/items/form-item-draft.json";
import * as FeatureServiceItem from "../../../common/test/mocks/items/feature-service-item.json";
import * as FieldworkerItem from "../../../common/test/mocks/items/fieldworker-item.json";
import * as StakeholderItem from "../../../common/test/mocks/items/stakeholder-item.json";
import { cloneObject, IModel } from "@esri/hub-common";
import * as featureLayerUtils from "@esri/arcgis-rest-feature-layer";

const getFormItem = (
  isDraft: boolean,
  resultsAvailability?: string
): IFormItem => {
  let properties;
  if (resultsAvailability) {
    properties = { settings: { resultsAvailability } } as IFormItemProperties;
  }
  const formItem = isDraft ? FormItemDraft : FormItemPublished;
  return Object.assign(cloneObject(formItem), { properties }) as IFormItem;
};

describe("shouldDisplayResults", function () {
  let requestOptions: IRequestOptions;

  beforeEach(() => {
    requestOptions = { authentication };
  });

  it(`should resolve false when stakeholder view doesn't exist (not published)`, async function () {
    const form = getFormItem(true);
    const result = await shouldDisplayResults(
      form,
      null,
      "jdoe",
      requestOptions
    );
    expect(result).toBeFalsy("should return false when unpublished");
  });

  it(`should resolve true when published and resultsAvailability is "always"`, async function () {
    const form = getFormItem(false, "always");
    const result = await shouldDisplayResults(
      form,
      StakeholderItem as IStakeholderItem,
      "jdoe",
      requestOptions
    );
    expect(result).toBeTruthy(
      `should return true when published and resultsAvailability is "always"`
    );
  });

  it(`should call hasUserResponded when published and resultsAvailability is "after"`, async function () {
    const hasUserRespondedSpy = spyOn(
      resultsUtils,
      "hasUserResponded"
    ).and.returnValue(Promise.resolve(true));
    const form = getFormItem(false, "after");
    const result = await shouldDisplayResults(
      form,
      StakeholderItem as IStakeholderItem,
      "jdoe",
      requestOptions
    );
    expect(hasUserRespondedSpy.calls.count()).toBe(1);
    expect(hasUserRespondedSpy.calls.argsFor(0)).toEqual([
      StakeholderItem.url,
      "jdoe",
      requestOptions,
    ]);
  });
});

describe("migrateFormPropertiesSettings", function () {
  let formModel: IModel;
  let featureServiceModel: IModel;
  let fieldworkerModel: IModel;
  let stakeholderModel: IModel;

  beforeEach(() => {
    formModel = { item: FormItemPublished };
    featureServiceModel = { item: FeatureServiceItem };
    fieldworkerModel = { item: FieldworkerItem };
    stakeholderModel = { item: StakeholderItem };
  });

  it(`should append properties to form.item when missing`, async function () {
    const models = {
      form: formModel,
      featureService: featureServiceModel,
      fieldworker: fieldworkerModel,
      stakeholder: stakeholderModel,
    };
    const result = migrateFormPropertiesSettings(models);

    expect(result).toEqual(
      Object.assign({}, models, {
        form: { item: getFormItem(false, "always") },
      }),
      "properties should be added to form.item"
    );
  });

  it(`should pass thru when properties exist on form.item`, async function () {
    const models = {
      form: { item: getFormItem(false, "always") },
      featureService: featureServiceModel,
      fieldworker: fieldworkerModel,
      stakeholder: stakeholderModel,
    };
    const result = migrateFormPropertiesSettings(models);

    expect(result).toEqual(models, "passes thru");
  });
});

describe("hasUserResponded", function () {
  let queryFeaturesSpy: jasmine.Spy;
  let requestOptions: IRequestOptions;

  beforeEach(() => {
    queryFeaturesSpy = spyOn(featureLayerUtils, "queryFeatures");
    requestOptions = { authentication };
  });

  afterEach(() => {
    queryFeaturesSpy.calls.reset();
  });

  it("resolves true if count > 0", async function () {
    queryFeaturesSpy.and.returnValue(Promise.resolve({ count: 1 }));
    const url = "https://my-feature-service.com";
    const username = "jdoe";
    const res = await resultsUtils.hasUserResponded(
      url,
      username,
      requestOptions
    );
    expect(res).toBe(true);
    expect(queryFeaturesSpy.calls.count()).toBe(1);
    expect(queryFeaturesSpy.calls.argsFor(0)).toEqual([
      {
        url: `${url}/0`,
        params: {
          where: `Creator = '${username}'`,
          returnCountOnly: true,
        },
        ...requestOptions,
      },
    ]);
  });

  it("resolves false if count = 0", async function () {
    queryFeaturesSpy.and.returnValue(Promise.resolve({ count: 0 }));
    const url = "https://my-feature-service.com";
    const username = "jdoe";
    const res = await resultsUtils.hasUserResponded(
      url,
      username,
      requestOptions
    );
    expect(res).toBe(false);
    expect(queryFeaturesSpy.calls.count()).toBe(1);
    expect(queryFeaturesSpy.calls.argsFor(0)).toEqual([
      Object.assign(
        {},
        {
          url: `${url}/0`,
          params: {
            where: `Creator = '${username}'`,
            returnCountOnly: true,
          },
        },
        requestOptions
      ),
    ]);
  });
});
