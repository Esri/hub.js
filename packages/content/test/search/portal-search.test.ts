// import * as fetchMock from 'fetch-mock';
// import { IItem, ISearchOptions } from '@esri/arcgis-rest-portal';

// import { searchPortalContent } from '../../src/search/portal-search';
// import * as mockItem from '../mocks/items/map-service.json';
// import { mockUserSession } from '../../../common/test/test-helpers/fake-user-session';
// import { ISearchResult } from '@esri/arcgis-rest-portal';
// import { done } from 'fetch-mock';

// describe('Portal Search', () => {
//   describe('searchPortalContent', () => {
//     // Global Setup
//     let itemsToReturn: IItem[];

//     beforeEach(() => {
//       const item: IItem = mockItem as IItem;
//       itemsToReturn = [item]
//     });

//     it('can handle request and response of Portal API search without aggregations', () => {
//       // Setup
//       const params: ISearchOptions = {
//         q: 'id: 12345',
//         portal: 'https://dummy.arcgis.com',
//         authentication: mockUserSession,
//         params: {
//           f: 'json',
//         },
//         start: 1,
//         num: 10,
//         sortField: 'title',
//         sortOrder: 'asc'
//       }

//       const expectedResponse: ISearchResult<IItem> = {
//         query: 'id: 12345',
//         start: 1,
//         num: 10,
//         nextStart: 11,
//         total: 1,
//         results: itemsToReturn
//       }

//       // Mock
//       fetchMock.post('https://dummy.arcgis.com/sharing/rest/content/search', expectedResponse);

//       // Test
//       const actualResponsePromise: Promise<ISearchResult<IItem>> = searchPortalContent(params);

//       // Assert
//       actualResponsePromise
//         .then(actualResponse => {
//           expect(actualResponse).toBeDefined();
//           done();
//         }).catch(err => {
//           throw err;
//         })
//     });
//   });
// });
