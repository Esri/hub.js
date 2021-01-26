import { DownloadTarget } from "../../src/download-target";
import { isRecentlyUpdated } from "../../src/portal/utils";

describe("isRecentlyUpdated", () => {
  it('should return false if target is not "portal", even if data was recently updated', done => {
    const targetOne: DownloadTarget = undefined;
    const targetTwo: DownloadTarget = "hub";
    const targetThree: DownloadTarget = "enterprise";
    const lastEditDate: number = new Date().getTime();

    expect(isRecentlyUpdated(targetOne, lastEditDate)).toBeFalsy();
    expect(isRecentlyUpdated(targetTwo, lastEditDate)).toBeFalsy();
    expect(isRecentlyUpdated(targetThree, lastEditDate)).toBeFalsy();
    done();
  });

  it("should return false for any target if data was recently updated", done => {
    const targetOne: DownloadTarget = undefined;
    const targetTwo: DownloadTarget = "hub";
    const targetThree: DownloadTarget = "enterprise";
    const targetFour: DownloadTarget = "portal";
    const lastEditDate: number = 1000;

    expect(isRecentlyUpdated(targetOne, lastEditDate)).toBeFalsy();
    expect(isRecentlyUpdated(targetTwo, lastEditDate)).toBeFalsy();
    expect(isRecentlyUpdated(targetThree, lastEditDate)).toBeFalsy();
    expect(isRecentlyUpdated(targetFour, lastEditDate)).toBeFalsy();
    done();
  });

  it('should return true only if target is "portal" and if data was recently updated', done => {
    const target: DownloadTarget = "portal";
    const lastEditDate: number = new Date().getTime();

    expect(isRecentlyUpdated(target, lastEditDate)).toBeTruthy();
    done();
  });
});
