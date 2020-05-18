export function expectAllCalled(spys: jasmine.Spy[], expect: any) {
  expectAll(spys, "toHaveBeenCalled", true, expect);
}

export function expectAll(
  args: any[],
  method: string,
  should: boolean,
  expect: any
) {
  const assertFunc = should
    ? (arg: any) => expect(arg)[method]()
    : (arg: any) => expect(arg).not[method]();
  args.forEach(assertFunc);
}
