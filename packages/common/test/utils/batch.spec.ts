import { batch } from "../../src/utils/batch";
import { beforeEach, describe, it, expect, vi } from "vitest";

describe("batch", function () {
  let values: any[];
  let valueMap: { [key: string]: any };
  let batchSize: number;

  beforeEach(() => {
    values = ["one", "two", "three"];
    valueMap = {
      one: 1,
      two: 2,
      three: 3,
    };
    batchSize = 2;
  });

  it("should serially process concurrent batches of method calls", async function () {
    const transform = vi.fn((key: any): any => valueMap[key]);
    const result = await batch(values, transform, batchSize);
    expect(transform.mock.calls.length).toEqual(3);
    expect(transform.mock.calls[0]).toEqual(["one"]);
    expect(transform.mock.calls[1]).toEqual(["two"]);
    expect(transform.mock.calls[2]).toEqual(["three"]);
    expect(result).toEqual([1, 2, 3]);
  });

  it("should support promises/async", async function () {
    const transform = vi.fn(
      (key: any): Promise<any> => Promise.resolve(valueMap[key])
    );
    const result = await batch(values, transform, batchSize);
    expect(transform.mock.calls.length).toEqual(3);
    expect(transform.mock.calls[0]).toEqual(["one"]);
    expect(transform.mock.calls[1]).toEqual(["two"]);
    expect(transform.mock.calls[2]).toEqual(["three"]);
    expect(result).toEqual([1, 2, 3]);
  });

  it("should default to a batchSize of 5", async function () {
    values = ["one", "two", "three", "four", "five", "six"];
    valueMap = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
    };
    const transform = vi.fn((key: any): any => valueMap[key]);
    const result = await batch(values, transform);
    expect(transform.mock.calls.length).toEqual(6);
    expect(transform.mock.calls[0]).toEqual(["one"]);
    expect(transform.mock.calls[1]).toEqual(["two"]);
    expect(transform.mock.calls[2]).toEqual(["three"]);
    expect(transform.mock.calls[3]).toEqual(["four"]);
    expect(transform.mock.calls[4]).toEqual(["five"]);
    expect(transform.mock.calls[5]).toEqual(["six"]);
    expect(result).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
