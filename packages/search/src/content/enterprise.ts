import { UserSession } from "@esri/arcgis-rest-auth";
import { SearchService, ICursorSearchResults } from "..";
import { IItem, ISearchOptions, searchItems } from '@esri/arcgis-rest-portal';
import { ISearchResult } from '@esri/arcgis-rest-portal';

// Search service types will likely change as request/response types are adopted for content search
export class EnterpriseSearchService extends SearchService<ISearchOptions, ISearchResult<IItem>> {
  constructor(portalBaseUrl: string, userSession: UserSession) {
    super(portalBaseUrl, userSession);
  }

  static create(portalBaseUrl: string, userSession: UserSession) {
    return new EnterpriseSearchService(portalBaseUrl, userSession);
  }

  async search(params: ISearchOptions): Promise<ICursorSearchResults<any>> {
    const { countFields, countSize = 200 } = params;
    const splitAggs = this._splitAggs(countFields);
    const aggsParamsList: ISearchOptions[] = splitAggs.length ? splitAggs.map((aggsFields: string) => Object.assign({}, params, { countFields: aggsFields, countSize, num: 0 })) : [];

    const searchPromises = [];
    aggsParamsList.forEach((aggsParams: ISearchOptions) => searchPromises.push(this._search(aggsParams)));
    searchPromises.push(this._search(params));

    return Promise.all(searchPromises)
      .then((responses: ISearchResult<IItem>[]) => {
        return {
          results: responses[0].results,
          total: responses[0].total,
          hasNext: false,
          next: () => Promise.resolve(null)
        }
      });
  }

  private _splitAggs(countFields: string = ''): string[] {
    const fields = countFields.split(',');
    if (fields.length > 3) {
      const first = fields.slice(0, 3);
      const second = fields.slice(3, fields.length);
      return [first.join(','), second.join(',')]
    }
    return [fields.join(',')];
  }

  private _search(params: ISearchOptions) {
    return searchItems(params);
  }
}