import { saveSession, clearSession, getSession } from "../../src";
import { MOCK_AUTH } from "../mocks/mock-auth";

const MOCK_LOCAL_STORAGE = {
  // tslint:disable-next-line:no-empty
  setItem: () => {},
  // tslint:disable-next-line:no-empty
  getItem: () => {},
  // tslint:disable-next-line:no-empty
  removeItem: () => {},
};

describe("localStorage:", () => {
  describe("getSession:", () => {
    it("returns null if window.localStorage is undefined", () => {
      const chk = getSession("FAKE_ID", {});
      expect(chk).toBeNull();
    });
    it("returns null if localStorage returns null", () => {
      const MOCK_WIN = {
        localStorage: MOCK_LOCAL_STORAGE,
      };

      const chk = getSession("FAKE_ID", MOCK_WIN);
      expect(chk).toBeNull();
    });

    it("returns session if localStorage has entry", () => {
      const MOCK_WIN = {
        localStorage: MOCK_LOCAL_STORAGE,
      };
      const localStorageGetItemSpy = spyOn(
        MOCK_LOCAL_STORAGE,
        "getItem"
      ).and.returnValue(MOCK_AUTH.serialize());
      const chk = getSession("FAKE_ID", MOCK_WIN);
      expect(chk.username).toBe("casey");
      expect(localStorageGetItemSpy.calls.count()).toBe(1);
      expect(localStorageGetItemSpy.calls.argsFor(0)[0]).toBe(
        "__CONTEXT_FAKE_ID"
      );
    });
  });

  describe("saveSession:", () => {
    it("does nothing if window.localStorage is undefined", () => {
      const chk = saveSession("FAKE_ID", MOCK_AUTH, {});
      expect(chk).toBeUndefined();
    });
    it("stores session if localStorage is present", () => {
      const MOCK_WIN = {
        localStorage: MOCK_LOCAL_STORAGE,
      };
      const localStorageGetItemSpy = spyOn(
        MOCK_LOCAL_STORAGE,
        "setItem"
      ).and.callThrough();
      const chk = saveSession("FAKE_ID", MOCK_AUTH, MOCK_WIN);
      expect(chk).toBeUndefined();
      expect(localStorageGetItemSpy.calls.count()).toBe(1);
      expect(localStorageGetItemSpy.calls.argsFor(0)[0]).toBe(
        "__CONTEXT_FAKE_ID"
      );
      expect(localStorageGetItemSpy.calls.argsFor(0)[1]).toEqual(
        MOCK_AUTH.serialize()
      );
    });
  });

  describe("clearSession:", () => {
    it("does nothing if window.localStorage is undefined", () => {
      const chk = clearSession("FAKE_ID", {});
      expect(chk).toBeUndefined();
    });
    it("clears session if localStorage has entry", () => {
      const MOCK_WIN = {
        localStorage: MOCK_LOCAL_STORAGE,
      };
      const localStorageGetItemSpy = spyOn(
        MOCK_LOCAL_STORAGE,
        "removeItem"
      ).and.callThrough();
      const chk = clearSession("FAKE_ID", MOCK_WIN);
      expect(chk).toBeUndefined();
      expect(localStorageGetItemSpy.calls.count()).toBe(1);
      expect(localStorageGetItemSpy.calls.argsFor(0)[0]).toBe(
        "__CONTEXT_FAKE_ID"
      );
    });
  });
});
