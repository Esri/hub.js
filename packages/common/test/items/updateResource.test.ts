import { MOCK_AUTH } from "../mocks/mock-auth";
import * as portalModule from "@esri/arcgis-rest-portal";
import { updateResource } from "../../src/items/updateResource";

describe("updateResource:", () => {
  it("calls updateItemResource with expected params", async () => {
    const addSpy = spyOn(portalModule, "updateItemResource").and.returnValues(
      Promise.resolve({ success: true })
    );
    const resp = await updateResource(
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
    const addSpy = spyOn(portalModule, "updateItemResource").and.returnValues(
      Promise.resolve({ success: true })
    );
    const resp = await updateResource(
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

  it("Properly converts json to blob", async () => {
    try {
      const addSpy = spyOn(portalModule, "addItemResource").and.returnValues(
        Promise.resolve({ success: true })
      );
      const resp = await updateResource(
        "3ef",
        "bob",
        { foo: "bar" },
        "location.json",
        {
          authentication: MOCK_AUTH,
        }
      );
      expect(resp).toEqual(
        "https://www.arcgis.com/sharing/rest/content/items/3ef/resources/location.json"
      );
      expect(addSpy.calls.count()).toBe(1);
      const args = addSpy.calls.argsFor(0)[0];
      expect(args.id).toBe("3ef");
      expect(args.owner).toEqual("bob");
      expect(args.resource).toEqual(
        new Blob(['{"foo":"bar"}'], { type: "application/json" })
      );
      expect(args.name).toEqual("location.json");
      expect(args.authentication).toEqual(MOCK_AUTH);
    } catch (ex) {
      if (typeof Blob === "undefined") {
        expect(ex.message).toEqual(
          "objectToJsonBlob is not currently supported on Node"
        );
      }
    }
  });

  it("Properly converts text to blob", async () => {
    try {
      const addSpy = spyOn(portalModule, "addItemResource").and.returnValues(
        Promise.resolve({ success: true })
      );
      const resp = await updateResource(
        "3ef",
        "bob",
        "some text",
        "location.txt",
        {
          authentication: MOCK_AUTH,
        }
      );
      expect(resp).toEqual(
        "https://www.arcgis.com/sharing/rest/content/items/3ef/resources/location.txt"
      );
      expect(addSpy.calls.count()).toBe(1);
      const args = addSpy.calls.argsFor(0)[0];
      expect(args.id).toBe("3ef");
      expect(args.owner).toEqual("bob");
      expect(args.resource).toEqual(
        new Blob(["some text"], { type: "text/plain" })
      );
      expect(args.name).toEqual("location.txt");
      expect(args.authentication).toEqual(MOCK_AUTH);
    } catch (ex) {
      if (typeof Blob === "undefined") {
        expect(ex.message).toEqual(
          "stringToBlob is not currently supported on Node"
        );
      }
    }
  });

  it("throws hub error if add fails", async () => {
    spyOn(portalModule, "updateItemResource").and.returnValues(
      Promise.resolve({ success: false })
    );
    try {
      await updateResource("3ef", "bob", "fakeFile", "featuredImage.png", {
        authentication: MOCK_AUTH,
      });
    } catch (err) {
      expect(err.name).toBe("HubError");
    }
  });

  it("throws hub error if add rejects with error", async () => {
    spyOn(portalModule, "updateItemResource").and.returnValues(
      Promise.reject(new Error("Fake Rejection"))
    );
    try {
      await updateResource("3ef", "bob", "fakeFile", "featuredImage.png", {
        authentication: MOCK_AUTH,
      });
    } catch (err) {
      expect(err.name).toBe("HubError");
    }
  });

  it("throws hub error if add rejects with non-error", async () => {
    spyOn(portalModule, "updateItemResource").and.returnValues(
      Promise.reject("Fake Rejection")
    );
    try {
      await updateResource("3ef", "bob", "fakeFile", "featuredImage.png", {
        authentication: MOCK_AUTH,
      });
    } catch (err) {
      expect(err.name).toBe("HubError");
    }
  });
});
