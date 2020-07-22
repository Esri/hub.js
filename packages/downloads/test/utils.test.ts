import { urlBuilder } from "../src/utils";

describe("utils", () => {
  describe("urlBuilder", () => {
    it('should build url without query params', done => {
      const result = urlBuilder({ host: 'https://test.com', route: '/foo/bar' });
      expect(result).toEqual('https://test.com/foo/bar');
      done();
    });

    it('should build url with query params', done => {
      const result = urlBuilder({ host: 'https://test.com', route: '/foo/bar', query: { hello: 'world' } });
      expect(result).toEqual('https://test.com/foo/bar?hello=world');
      done();
    });

    it('should build url when host', done => {
      const result = urlBuilder({ host: 'https://test.com/', route: '/foo/bar'});
      expect(result).toEqual('https://test.com/foo/bar');
      done();
    });
  });
})
