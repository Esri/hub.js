import { doesItemExistWithTitle } from '../../src';
import * as portalModule from "@esri/arcgis-rest-portal";
import { IAuthenticationManager } from '@esri/arcgis-rest-request';

describe('doesItemExistWithTitle', () => {
  let options = {
    typekeywords: "foo"
  };

  const authMgr = {} as IAuthenticationManager;

  it('should resolve true when item with same name exists', async () => {
    const opts = {
      q: `title:"exists"`,
      authentication: authMgr
    };
    const spy = spyOn(portalModule, "searchItems").and.returnValue(
      Promise.resolve({
        results: [{}]
      })
    );
    const res = await doesItemExistWithTitle("exists", options, authMgr);
    expect(res).toBeTruthy();

    const expectedSearchOpts = {
      q: `title:"exists" AND typekeywords:"foo"`,
      authentication: authMgr
    };
    expect(spy.calls.argsFor(0)[0]).toEqual(
      expectedSearchOpts,
      "searchItems called with correct options"
    );
  });


  it('should resolve false when item with same name DOES NOT exist', async () => {
    const opts = {
      q: `title:"not-exists"`,
      authentication: authMgr
    };
    const spy = spyOn(portalModule, "searchItems").and.returnValue(
      Promise.resolve({
        results: [] // empty
      })
    );
    const res = await doesItemExistWithTitle("not-exists", options, authMgr);
    expect(res).toBeFalsy();

    const expectedSearchOpts = {
      q: `title:"not-exists" AND typekeywords:"foo"`,
      authentication: authMgr
    };
    expect(spy.calls.argsFor(0)[0]).toEqual(
      expectedSearchOpts,
      "searchItems called with correct options"
    );
  });

  it('should reject if error', async () => {
    spyOn(portalModule, "searchItems").and.returnValue
    (Promise.reject());

    try {
      await doesItemExistWithTitle("not-exists", options, authMgr);
      fail("should reject");
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});