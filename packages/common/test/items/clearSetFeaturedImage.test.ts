import * as portalModule from "@esri/arcgis-rest-portal";
import * as UploadImageModule from "../../src/items/uploadImageResource";
import { MOCK_AUTH } from "../mocks/mock-auth";
import { clearSetFeaturedImage } from "../../src/items/clearSetFeaturedImage";
import { HubError } from "../../src";

describe("clearSetFeaturedImage:", () => {
  it("calls uploadImageResource with expected params", async () => {
    const uploadSpy = spyOn(
      UploadImageModule,
      "uploadImageResource"
    ).and.returnValues(Promise.resolve("featuredImage.png"));
    const resp = await clearSetFeaturedImage(
      "fakeFile",
      "set",
      {
        id: "3ef",
        owner: "fakeOwner",
      },
      {
        authentication: MOCK_AUTH,
      }
    );
    expect(resp).toBe("featuredImage.png");
    expect(uploadSpy.calls.count()).toBe(1);
    const args = uploadSpy.calls.argsFor(0);
    expect(args[0]).toBe("3ef");
    expect(args[1]).toBe("fakeOwner");
    expect(args[2]).toBe("fakeFile");
    expect(args[3]).toBe("featuredImage.png");
    expect(args[4]).toEqual({
      authentication: MOCK_AUTH,
    });
  });
  it("calls removeItemResource with expected params", async () => {
    const removeSpy = spyOn(
      portalModule,
      "removeItemResource"
    ).and.returnValues(Promise.resolve({ success: true }));
    const resp = await clearSetFeaturedImage(
      "fakeFile",
      "clear",
      {
        id: "3ef",
        owner: "fakeOwner",
      },
      {
        authentication: MOCK_AUTH,
      }
    );
    expect(resp).toBe(null);
    expect(removeSpy.calls.count()).toBe(1);
    const args = removeSpy.calls.argsFor(0);
    expect(args[0]).toEqual({
      id: "3ef",
      owner: "fakeOwner",
      resource: "featuredImage.png",
      authentication: MOCK_AUTH,
    });
  });
  it("calls removeItemResource and uploadImageResource with expected params", async () => {
    const removeSpy = spyOn(
      portalModule,
      "removeItemResource"
    ).and.returnValues(Promise.resolve({ success: true }));
    const uploadSpy = spyOn(
      UploadImageModule,
      "uploadImageResource"
    ).and.returnValues(Promise.resolve("featuredImage.png"));
    const resp = await clearSetFeaturedImage(
      "fakeFile",
      "both",
      {
        id: "3ef",
        owner: "fakeOwner",
      },
      {
        authentication: MOCK_AUTH,
      }
    );
    expect(resp).toBe("featuredImage.png");
    expect(removeSpy.calls.count()).toBe(1);
    expect(uploadSpy.calls.count()).toBe(1);
    const removeArgs = removeSpy.calls.argsFor(0);
    expect(removeArgs[0]).toEqual({
      id: "3ef",
      owner: "fakeOwner",
      resource: "featuredImage.png",
      authentication: MOCK_AUTH,
    });
    const uploadArgs = uploadSpy.calls.argsFor(0);
    expect(uploadArgs[0]).toBe("3ef");
    expect(uploadArgs[1]).toBe("fakeOwner");
    expect(uploadArgs[2]).toBe("fakeFile");
    expect(uploadArgs[3]).toBe("featuredImage.png");
    expect(uploadArgs[4]).toEqual({
      authentication: MOCK_AUTH,
    });
  });
  it("throws hub error if uploadImageResource fails", async () => {
    spyOn(UploadImageModule, "uploadImageResource").and.returnValues(
      Promise.resolve(null)
    );
    try {
      await clearSetFeaturedImage(
        "fakeFile",
        "set",
        {
          id: "3ef",
          owner: "fakeOwner",
        },
        {
          authentication: MOCK_AUTH,
        }
      );
    } catch (err) {
      expect(err.name).toBe("HubError");
    }
  });
  it("throws hub error if removeItemResource fails", async () => {
    spyOn(portalModule, "removeItemResource").and.returnValues(
      Promise.resolve({ success: false })
    );
    try {
      await clearSetFeaturedImage(
        "fakeFile",
        "clear",
        {
          id: "3ef",
          owner: "fakeOwner",
        },
        {
          authentication: MOCK_AUTH,
        }
      );
    } catch (err) {
      expect(err.name).toBe("HubError");
    }
  });
  it("throws hub error if uploadImageResource rejects with error", async () => {
    spyOn(UploadImageModule, "uploadImageResource").and.returnValues(
      Promise.reject(new HubError("Fake Rejection"))
    );
    try {
      await clearSetFeaturedImage(
        "fakeFile",
        "set",
        {
          id: "3ef",
          owner: "fakeOwner",
        },
        {
          authentication: MOCK_AUTH,
        }
      );
    } catch (err) {
      expect(err.name).toBe("HubError");
    }
  });
  it("should call itself recursively if resource is already present", async () => {
    let count = 1;
    const removeSpy = spyOn(portalModule, "removeItemResource").and.returnValue(
      Promise.resolve({ success: true })
    );

    const uploadSpy = spyOn(
      UploadImageModule,
      "uploadImageResource"
    ).and.callFake(() => {
      if (count === 1) {
        count += 1;
        const err = new Error("CONT_00942: Resource already present");
        return Promise.reject(err);
      } else {
        return Promise.resolve("featuredImage.png");
      }
    });

    const resp = await clearSetFeaturedImage(
      "fakeFile",
      "set",
      {
        id: "3ef",
        owner: "fakeOwner",
      },
      {
        authentication: MOCK_AUTH,
      }
    );
    expect(resp).toBe("featuredImage.png");
    expect(removeSpy.calls.count()).toBe(1);
    expect(uploadSpy.calls.count()).toBe(2);
    const removeArgs = removeSpy.calls.argsFor(0);
    expect(removeArgs[0]).toEqual({
      id: "3ef",
      owner: "fakeOwner",
      resource: "featuredImage.png",
      authentication: MOCK_AUTH,
    });
    const uploadArgs = uploadSpy.calls.argsFor(0);
    expect(uploadArgs[0]).toBe("3ef");
    expect(uploadArgs[1]).toBe("fakeOwner");
    expect(uploadArgs[2]).toBe("fakeFile");
    expect(uploadArgs[3]).toBe("featuredImage.png");
    expect(uploadArgs[4]).toEqual({
      authentication: MOCK_AUTH,
    });
  });
  it("should call itself if resource does not exist", async () => {
    let count = 1;
    const removeSpy = spyOn(portalModule, "removeItemResource").and.callFake(
      () => {
        if (count === 1) {
          count += 1;
          const err = new Error(
            "CONT_00001: Resource does not exist or is inaccessible"
          );
          return Promise.reject(err);
        } else {
          return Promise.resolve({ success: true });
        }
      }
    );

    const uploadSpy = spyOn(
      UploadImageModule,
      "uploadImageResource"
    ).and.returnValues(Promise.resolve("featuredImage.png"));
    const resp = await clearSetFeaturedImage(
      "fakeFile",
      "both",
      {
        id: "3ef",
        owner: "fakeOwner",
      },
      {
        authentication: MOCK_AUTH,
      }
    );
    expect(resp).toBe("featuredImage.png");
    expect(removeSpy.calls.count()).toBe(1);
    expect(uploadSpy.calls.count()).toBe(1);
    const removeArgs = removeSpy.calls.argsFor(0);
    expect(removeArgs[0]).toEqual({
      id: "3ef",
      owner: "fakeOwner",
      resource: "featuredImage.png",
      authentication: MOCK_AUTH,
    });
    const uploadArgs = uploadSpy.calls.argsFor(0);
    expect(uploadArgs[0]).toBe("3ef");
    expect(uploadArgs[1]).toBe("fakeOwner");
    expect(uploadArgs[2]).toBe("fakeFile");
    expect(uploadArgs[3]).toBe("featuredImage.png");
    expect(uploadArgs[4]).toEqual({
      authentication: MOCK_AUTH,
    });
  });
  it("should call itself if resource does not exist and clearOrSet is clear", async () => {
    const removeSpy = spyOn(portalModule, "removeItemResource").and.returnValue(
      Promise.reject(
        new Error("CONT_00001: Resource does not exist or is inaccessible")
      )
    );
    const resp = await clearSetFeaturedImage(
      "fakeFile",
      "clear",
      {
        id: "3ef",
        owner: "fakeOwner",
      },
      {
        authentication: MOCK_AUTH,
      }
    );
    expect(resp).toBe(null);
    expect(removeSpy.calls.count()).toBe(1);
    const args = removeSpy.calls.argsFor(0);
    expect(args[0]).toEqual({
      id: "3ef",
      owner: "fakeOwner",
      resource: "featuredImage.png",
      authentication: MOCK_AUTH,
    });
  });
});
