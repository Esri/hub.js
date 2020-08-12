import { batch } from "../../src/utils/batch";

describe("batch", function() {
  let values: any[];
  let valueMap: { [key: string]: any };
  let batchSize: number;

  beforeEach(() => {
    values = ["one", "two", "three"];
    valueMap = {
      one: 1,
      two: 2,
      three: 3
    };
    batchSize = 2;
  });

  it("should serially process concurrent batches of method calls", async function() {
    const transform = jasmine
      .createSpy()
      .and.callFake((key: any): any => valueMap[key]);
    const result = await batch(values, transform, batchSize);
    expect(transform.calls.count()).toEqual(3);
    expect(transform.calls.argsFor(0)).toEqual(["one"]);
    expect(transform.calls.argsFor(1)).toEqual(["two"]);
    expect(transform.calls.argsFor(2)).toEqual(["three"]);
    expect(result).toEqual([1, 2, 3]);
  });

  it("should support promises/async", async function() {
    const transform = jasmine
      .createSpy()
      .and.callFake(
        (key: any): Promise<any> =>
          new Promise(resolve => resolve(valueMap[key]))
      );
    const result = await batch(values, transform, batchSize);
    expect(transform.calls.count()).toEqual(3);
    expect(transform.calls.argsFor(0)).toEqual(["one"]);
    expect(transform.calls.argsFor(1)).toEqual(["two"]);
    expect(transform.calls.argsFor(2)).toEqual(["three"]);
    expect(result).toEqual([1, 2, 3]);
  });

  it("should default to a batchSize of 5", async function() {
    values = ["one", "two", "three", "four", "five", "six"];
    valueMap = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6
    };
    const transform = jasmine
      .createSpy()
      .and.callFake((key: any): any => valueMap[key]);
    const result = await batch(values, transform);
    expect(transform.calls.count()).toEqual(6);
    expect(transform.calls.argsFor(0)).toEqual(["one"]);
    expect(transform.calls.argsFor(1)).toEqual(["two"]);
    expect(transform.calls.argsFor(2)).toEqual(["three"]);
    expect(transform.calls.argsFor(3)).toEqual(["four"]);
    expect(transform.calls.argsFor(4)).toEqual(["five"]);
    expect(transform.calls.argsFor(5)).toEqual(["six"]);
    expect(result).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
