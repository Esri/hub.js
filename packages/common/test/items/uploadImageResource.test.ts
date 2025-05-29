import { MOCK_AUTH } from "../mocks/mock-auth";
import * as portalModule from "@esri/arcgis-rest-portal";
import { uploadImageResource } from "../../src/items/uploadImageResource";

describe("uploadImageResource:", () => {
  it("calls addItemResource with expected params", async () => {
    const addSpy = spyOn(portalModule, "addItemResource").and.returnValues(
      Promise.resolve({ success: true })
    );
    const resp = await uploadImageResource(
      "3ef",
      "bob",
      "fakeFile",
      "featuredImage.png",
      {
        authentication: MOCK_AUTH,
      }
    );
    expect(resp).toEqual(
      "https://www.arcgis.com/sharing/rest/content/items/3ef/resources/featuredImage.png"
    );
    expect(addSpy.calls.count()).toBe(1);
    const args = addSpy.calls.argsFor(0)[0];
    expect(args.id).toBe("3ef");
    expect(args.owner).toEqual("bob");
    expect(args.resource).toEqual("fakeFile");
    expect(args.name).toEqual("featuredImage.png");
    expect(args.authentication).toEqual(MOCK_AUTH);
  });

  it("Properly constructs url when a prefix is passed", async () => {
    const addSpy = spyOn(portalModule, "addItemResource").and.returnValues(
      Promise.resolve({ success: true })
    );
    const resp = await uploadImageResource(
      "3ef",
      "bob",
      "fakeFile",
      "featuredImage.png",
      {
        authentication: MOCK_AUTH,
      },
      "images"
    );
    expect(resp).toEqual(
      "https://www.arcgis.com/sharing/rest/content/items/3ef/resources/images/featuredImage.png"
    );
    expect(addSpy.calls.count()).toBe(1);
    const args = addSpy.calls.argsFor(0)[0];
    expect(args.id).toBe("3ef");
    expect(args.owner).toEqual("bob");
    expect(args.resource).toEqual("fakeFile");
    expect(args.name).toEqual("featuredImage.png");
    expect(args.authentication).toEqual(MOCK_AUTH);
    expect(args.prefix).toEqual("images");
  });

  it("throws hub error if add fails", async () => {
    spyOn(portalModule, "addItemResource").and.returnValues(
      Promise.resolve({ success: false })
    );
    try {
      await uploadImageResource("3ef", "bob", "fakeFile", "featuredImage.png", {
        authentication: MOCK_AUTH,
      });
    } catch (err) {
      expect((err as Error).name).toBe("HubError");
    }
  });

  it("throws hub error if add rejects with error", async () => {
    spyOn(portalModule, "addItemResource").and.returnValues(
      Promise.reject(new Error("Fake Rejection"))
    );
    try {
      await uploadImageResource("3ef", "bob", "fakeFile", "featuredImage.png", {
        authentication: MOCK_AUTH,
      });
    } catch (err) {
      expect((err as Error).name).toBe("HubError");
    }
  });

  it("throws hub error if add rejects with non-error", async () => {
    spyOn(portalModule, "addItemResource").and.returnValues(
      Promise.reject("Fake Rejection")
    );
    try {
      await uploadImageResource("3ef", "bob", "fakeFile", "featuredImage.png", {
        authentication: MOCK_AUTH,
      });
    } catch (err) {
      expect((err as Error).name).toBe("HubError");
    }
  });
});
