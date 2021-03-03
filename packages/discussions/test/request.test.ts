import { request } from "../src/request";
import * as fetchMock from "fetch-mock";

describe('request', () => {
  const response = new Response('ok', {status: 200});
  const urlBase = 'http://localhost/api/v1';
  const url = 'foo';

  let expectedOpts: RequestInit;

  beforeEach(() => {
    fetchMock.mock('*', response);

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    expectedOpts = {
      headers,
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include'
    } as RequestInit;
  });

  afterEach(fetchMock.restore);

  it('appends headers to request options', async () => {
    debugger;
    const result = await request(url, {});

    expect(result).toEqual(response);

    const [ calledUrl, calledOpts ] = fetchMock.calls()[0];
    expect(calledUrl).toEqual([urlBase, url].join('/'));
    expect(calledOpts).toEqual(expectedOpts);
  });

  it(`appends token header to request options if supplied`, async () => {
    const token = 'bar';
    const options = { token };

    const result = await request(url, options);

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${token}`);
    expectedOpts.headers = headers;

    expect(result).toEqual(response);

    const [ calledUrl, calledOpts ] = fetchMock.calls()[0];
    expect(calledUrl).toEqual([urlBase, url].join('/'));
    expect(calledOpts).toEqual(expectedOpts);
  });

  it(`appends query params to url if supplied`, async () => {
    const query = {
      bar: 'baz'
    }
    const options = { params: { query } };

    const result = await request(url, options);

    expect(result).toEqual(response);
    const queryParams = new URLSearchParams(query).toString();
    const baseUrl = [urlBase, url].join('/')

    const [ calledUrl, calledOpts ] = fetchMock.calls()[0];
    expect(calledUrl).toEqual(baseUrl + `?${queryParams}`);
    expect(calledOpts).toEqual(expectedOpts);
  });

  it(`stringifies and appends body to request options if supplied`, async () => {
    const body = {
      bar: 'baz'
    }
    const options = { params: { body } };

    const result = await request(url, options);

    expectedOpts.body = JSON.stringify(body);

    expect(result).toEqual(response);

    const [ calledUrl, calledOpts ] = fetchMock.calls()[0];
    expect(calledUrl).toEqual([urlBase, url].join('/'));
    expect(calledOpts).toEqual(expectedOpts);
  });
});