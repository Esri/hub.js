import { extractAssets } from "../../src/layout";

describe("extractAssets", function() {
  it("empty array should be returned when obj contains neither fileSrc nor cropSrc properties", function () {
    const obj = {}

    expect(extractAssets(obj)).toEqual([]);
  });

  it("both fileSrc and cropSrc values should be returned when obj contains both fileSrc and cropSrc properties", function () {
    const obj = {
      fileSrc: 'fileSrc value',
      cropSrc: 'cropSrc value'
    }

    expect(extractAssets(obj)).toEqual(['fileSrc value', 'cropSrc value']);
  });

  it("only fileSrc value should be returned when obj only fileSrc property", function () {
    const obj = {
      fileSrc: 'fileSrc value'
    }

    expect(extractAssets(obj)).toEqual(['fileSrc value']);
  });

  it("only cropSrc value should be returned when obj only cropSrc property", function () {
    const obj = {
      cropSrc: 'cropSrc value'
    }

    expect(extractAssets(obj)).toEqual(['cropSrc value']);
  });
});
