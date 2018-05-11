import { login } from "../src/index";
import * as fetchMock from "fetch-mock";

describe("login", () => {
  afterEach(fetchMock.restore);

  it("should return something excited", done => {
    const check = login();
    expect(check).toEqual("yes!");
    done();
  });
});
