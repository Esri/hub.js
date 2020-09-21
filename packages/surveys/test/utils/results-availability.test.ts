import { mockUserSession as authentication } from "@esri/hub-common/test/test-helpers/fake-user-session";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import {
  shouldDisplayResults,
  hasUserResponded,
  migrateAddResultsAvailabilitySetting,
  IFormItem,
  IFormItemProperties,
  IStakeholderItem
} from "../../src/utils/results-availability";

const getFormItem = (resultsAvailability?: string): IFormItem => {
  let properties;
  if (resultsAvailability) {
    properties = { settings: { resultsAvailability } } as IFormItemProperties;
  }
  const form: IFormItem = {
    id: "foo",
    title: "My Form",
    type: "Form",
    owner: "jdoe",
    tags: [],
    created: 1234,
    modified: 1234,
    properties,
    typeKeyworkds: [
      "StakeholderView",
      "Survey123",
      "Survey123 Hub"
    ],
    url: "my-form-url.com",
    numViews: 0,
    size: 0
  };
  return form;
}

xdescribe("shouldDisplayResults", function () {
  let requestOptions: IRequestOptions;

  beforeEach(() => {
    requestOptions = { authentication };
  });

  it (`should resolve false when stakeholder view doesn't exist (not published)`, async function () {
    expect(true).toBeTruthy('it works');
    debugger;
    // const form = getFormItem();
    // const result = await shouldDisplayResults(form, null, "jdoe", requestOptions);
    // expect(result).toBeFalsy('should return false when unpublished');
  });
  // it (`should return ${expected} when it has a schedule.start:${start} and schedule.end:${end}`, function () {
  //   const formJson = getFormJson("scheduled", start, end);
  //   const result = getSurveyStatus(formJson, new Date(now));
  //   expect(result).toEqual(expected);
  // });

});

// /**
//  * check if Hub should link to results view of survey
//  * @param {IFormItem} formItem survey form item json
//  * @param {IStakeholderItem | null} stakeholderItem survey stakeholder view item json
//  * @param {string} username the username to check for survey responses
//  * @param {IRequestOptions} requestOptions The request options
//  * @returns {Promise<boolean>}
//  */
// export const shouldDisplayResults = (
//   formItem: IFormItem,
//   stakeholderItem: IStakeholderItem | null,
//   username: string,
//   requestOptions: IRequestOptions): Promise<boolean> => {
//   let res = Promise.resolve(false);
//   if (stakeholderItem) {
//     if (getProp(formItem, "properties.settings.resultsAvailability") === "after") {
//       res = hasUserResponded(stakeholderItem.url, username, requestOptions);
//     } else {
//       res = Promise.resolve(true);
//     }
//   }
//   return res;
// };

// test('getResultsAvailability', async function (assert) {
//   const formItem = resultsAvailability => ({ properties: { settings: { resultsAvailability } } });
//   assert.notOk(await getResultsAvailability({}), 'returns false when stakeholder is not provided');
//   assert.ok(await getResultsAvailability({}, {}), 'returns true when stakeholder is provided and no resultsAvailability prop');
//
//   fetchMock.once('*', { count: 1 });
//   const opts = { username: 'jdoe' };
//   let res = await getResultsAvailability(formItem('after'), { url: 'fooStakeholder' }, opts);
//   let queryUrl = fetchMock.lastUrl();
//   assert.ok(fetchMock.called(), 'should call fetch');
//   assert.ok(
//     queryUrl.startsWith('/fooStakeholder/0/query') &&
//     queryUrl.includes(`where=Creator%20%3D%20%27jdoe%27`) &&
//     queryUrl.includes(`returnCountOnly=true`)
//   );
//   assert.ok(res, `returns false when resultsAvailability is "after" and user has 0 records`);
//   fetchMock.restore();
//
//   fetchMock.once('*', { count: 0 });
//   res = await getResultsAvailability(formItem('after'), { url: 'fooStakeholder' }, opts);
//   queryUrl = fetchMock.lastUrl();
//   assert.ok(fetchMock.called(), 'should call fetch');
//   assert.ok(
//     queryUrl.startsWith('/fooStakeholder/0/query') &&
//     queryUrl.includes(`where=Creator%20%3D%20%27jdoe%27`) &&
//     queryUrl.includes(`returnCountOnly=true`)
//   );
//   assert.notOk(res, `returns false when resultsAvailability is "after" and user has 0 records`);
// });


