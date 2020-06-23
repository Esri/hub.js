import { getUniqueItemTitle } from '../../src';
import * as doesItemExistWithTitleModule from "../../src/items/does-item-exist-with-title";
import { IAuthenticationManager } from '@esri/arcgis-rest-request';

describe('getUniqueItemTitle', () => {
  const opts = { 
    typekeywords: 'typeX'
  };
  it("generates a unique name", async function() {
    const initialTitle = "foobar";
    spyOn(doesItemExistWithTitleModule, "doesItemExistWithTitle").and.callFake(function(
      candidate: string
    ) {
      return Promise.resolve(
        [`${initialTitle}`, `${initialTitle} 1`].indexOf(candidate) !== -1
      );
    });

    const uniqueTitle = await getUniqueItemTitle(
      initialTitle,
      opts,
      {} as IAuthenticationManager
    );

    expect(uniqueTitle).toBe("foobar 2");
  });

  it("rejects if error", async function() {
    const initialTitle = "foobar";
    spyOn(doesItemExistWithTitleModule, "doesItemExistWithTitle").and.returnValue(
      Promise.reject("something")
    );

    try {
      await getUniqueItemTitle(initialTitle, opts, {} as IAuthenticationManager);
      fail("should reject");
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});