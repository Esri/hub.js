import { getQueryParams } from "../../src/utils/get-query-params";

let winRef: any;

describe("getQueryParams", function() {
  beforeEach(() => {
    winRef = { location: {} };
  });

  it('Returns empty object when no params are present', () => {
    const params = getQueryParams(winRef);
    expect(params).toEqual({});
  });

  it('Correctly parses a single query param', () => {
    winRef.location.search = '?debug=1';
    const params = getQueryParams(winRef);
    expect(params).toEqual({debug: '1'});
  });

  it('Correctly parses multiple query params', () => {
    winRef.location.search = '?debug=1&lang=eng&os=win';
    const params = getQueryParams(winRef);
    expect(params).toEqual({debug: '1', lang: 'eng', os: 'win'});
  });

  it('Correctly parses a flag', () => {
    winRef.location.search = '?debug';
    const params = getQueryParams(winRef);
    expect(params).toEqual({debug: true});
  });

  it('Correctly parses multiple values for a single param', () => {
    winRef.location.search = '?debug=1&debug=2&debug=3';
    const params = getQueryParams(winRef);
    expect(params).toEqual({debug: ['1', '2', '3']});
  })
});