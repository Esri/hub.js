import { MOCK_AUTH } from "../mocks/mock-auth";
import * as portalModule from "@esri/arcgis-rest-portal";
import { upsertResource } from "../../src/resources/upsertResource";

describe("createResource:", () => {
  it("calls addItemResource with expected params", async () => {
    const addSpy = spyOn(portalModule, "addItemResource").and.returnValues(
      Promise.resolve({ success: true })
    );
    const getResourcesSpy = spyOn(
      portalModule,
      "getItemResources"
    ).and.returnValues(Promise.resolve({ resources: [] }));
    const resp = await upsertResource(
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
    expect(getResourcesSpy.calls.count()).toBe(1);
    expect(addSpy.calls.count()).toBe(1);
    const args = addSpy.calls.argsFor(0)[0];
    expect(args.id).toBe("3ef");
    expect(args.owner).toEqual("bob");
    expect(args.resource).toEqual("fakeFile");
    expect(args.name).toEqual("featuredImage.png");
    expect(args.authentication).toEqual(MOCK_AUTH);
  });

  it("calls updateItemResource with expected params", async () => {
    const updateSpy = spyOn(
      portalModule,
      "updateItemResource"
    ).and.returnValues(Promise.resolve({ success: true }));
    const getResourcesSpy = spyOn(
      portalModule,
      "getItemResources"
    ).and.returnValues(
      Promise.resolve({
        resources: [
          { resource: "featuredImage.png" },
          { resource: "test.txt" },
        ],
      })
    );
    const resp = await upsertResource(
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
    expect(getResourcesSpy.calls.count()).toBe(1);
    expect(updateSpy.calls.count()).toBe(1);
    const args = updateSpy.calls.argsFor(0)[0];
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
    const getResourcesSpy = spyOn(
      portalModule,
      "getItemResources"
    ).and.returnValues(Promise.resolve({ resources: [] }));
    const resp = await upsertResource(
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
    expect(getResourcesSpy.calls.count()).toBe(1);
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
      const getResourcesSpy = spyOn(
        portalModule,
        "getItemResources"
      ).and.returnValues(Promise.resolve({ resources: [] }));
      const resp = await upsertResource(
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
      expect(getResourcesSpy.calls.count()).toBe(1);
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
      const getResourcesSpy = spyOn(
        portalModule,
        "getItemResources"
      ).and.returnValues(Promise.resolve({ resources: [] }));
      const resp = await upsertResource(
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
      expect(getResourcesSpy.calls.count()).toBe(1);
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
    spyOn(portalModule, "addItemResource").and.returnValues(
      Promise.resolve({ success: false })
    );
    const getResourcesSpy = spyOn(
      portalModule,
      "getItemResources"
    ).and.returnValues(Promise.resolve({ resources: [] }));
    try {
      await upsertResource("3ef", "bob", "fakeFile", "featuredImage.png", {
        authentication: MOCK_AUTH,
      });
    } catch (err) {
      expect(err.name).toBe("HubError");
    }
  });

  it("throws hub error if add rejects with error", async () => {
    spyOn(portalModule, "addItemResource").and.returnValues(
      Promise.reject(new Error("Fake Rejection"))
    );
    const getResourcesSpy = spyOn(
      portalModule,
      "getItemResources"
    ).and.returnValues(Promise.resolve({ resources: [] }));
    try {
      await upsertResource("3ef", "bob", "fakeFile", "featuredImage.png", {
        authentication: MOCK_AUTH,
      });
    } catch (err) {
      expect(err.name).toBe("HubError");
    }
  });

  it("throws hub error if add rejects with non-error", async () => {
    spyOn(portalModule, "addItemResource").and.returnValues(
      Promise.reject("Fake Rejection")
    );
    const getResourcesSpy = spyOn(
      portalModule,
      "getItemResources"
    ).and.returnValues(Promise.resolve({ resources: [] }));
    try {
      await upsertResource("3ef", "bob", "fakeFile", "featuredImage.png", {
        authentication: MOCK_AUTH,
      });
    } catch (err) {
      expect(err.name).toBe("HubError");
    }
  });
});
