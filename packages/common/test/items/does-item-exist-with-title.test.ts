import { doesItemExistWithTitle } from '../../src';
import * as portalModule from "@esri/arcgis-rest-portal";
import { IAuthenticationManager } from '@esri/arcgis-rest-request';

describe('doesItemExistWithTitle', () => {
  const opts = { 
    typekeywords: 'typeX'
  };

  const authMgr = {} as IAuthenticationManager;

  it('should resolve true when item with same name exists', async () => {
    const spy = spyOn(portalModule, "searchItems").and.returnValue(
      Promise.resolve({
        results: [{}]
      })
    );
    const res = await doesItemExistWithTitle("exists", opts, authMgr);
    expect(res).toBeTruthy();
  });

  it('should resolve false when item with same name DOES NOT exist', async () => {
    const spy = spyOn(portalModule, "searchItems").and.returnValue(
      Promise.resolve({
        results: [] // empty
      })
    );
    const res = await doesItemExistWithTitle("not-exists", opts, authMgr);
    expect(res).toBeFalsy();
  });

  it('should reject if error', async () => {
    spyOn(portalModule, "searchItems").and.returnValue
    (Promise.reject());

    try {
      await doesItemExistWithTitle("not-exists", opts, authMgr);
      fail("should reject");
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});