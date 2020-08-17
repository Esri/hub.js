import { getUniqueGroupTitle } from "../../src/utils/get-unique-group-title";
import * as doesGroupExistModule from "../../src/utils/does-group-exist";
import { IHubRequestOptions } from "@esri/hub-common";

describe("getUniqueGroupTitle", function() {
  it("generates a unique name", async function() {
    const initialTitle = "foobar";
    spyOn(doesGroupExistModule, "doesGroupExist").and.callFake(function(
      candidate: string
    ) {
      return Promise.resolve(
        [`${initialTitle}`, `${initialTitle} 1`].indexOf(candidate) !== -1
      );
    });

    const uniqueTitle = await getUniqueGroupTitle(
      initialTitle,
      {} as IHubRequestOptions
    );

    expect(uniqueTitle).toBe("foobar 2");
  });

  it("rejects if error", async function() {
    const initialTitle = "foobar";
    spyOn(doesGroupExistModule, "doesGroupExist").and.returnValue(
      Promise.reject("something")
    );

    try {
      await getUniqueGroupTitle(initialTitle, {} as IHubRequestOptions);
      fail("should reject");
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});
